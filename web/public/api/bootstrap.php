<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$configPath = __DIR__ . '/config.php';
if (!is_readable($configPath)) {
    http_response_code(503);
    echo json_encode(['error' => 'Server not configured. Copy config.example.php to config.php on the server.']);
    exit;
}

/** @var array<string, mixed> $CONFIG */
$CONFIG = require $configPath;

session_name((string) ($CONFIG['session_name'] ?? 'eeca_admin'));
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
    ]);
    session_start();
}

function json_response($data, int $code = 200)
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function require_admin(): void
{
    if (empty($_SESSION['admin_id'])) {
        json_response(['error' => 'Unauthorized'], 401);
    }
}

function pdo(): PDO
{
    global $CONFIG;
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=utf8mb4',
        $CONFIG['db_host'],
        $CONFIG['db_name'],
    );
    $pdo = new PDO($dsn, (string) $CONFIG['db_user'], (string) $CONFIG['db_pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    return $pdo;
}

function row_to_api(array $row): array
{
    foreach (['answers', 'auto_tags', 'contact', 'uploads'] as $jsonCol) {
        if (isset($row[$jsonCol]) && is_string($row[$jsonCol])) {
            $decoded = json_decode($row[$jsonCol], true);
            $row[$jsonCol] = $decoded ?? ($jsonCol === 'auto_tags' ? [] : null);
        }
    }
    $row['created_at'] = gmdate('c', strtotime((string) $row['created_at']));
    return $row;
}

function notify_team(array $CONFIG, array $row): void
{
    $to = trim((string) ($CONFIG['notify_email'] ?? ''));
    if ($to === '') {
        return;
    }
    $contact = is_array($row['contact'] ?? null) ? $row['contact'] : [];
    $subject = 'New EECA consultation response — ' . ($row['country'] ?? 'unknown country');
    $body = "New stakeholder consultation submission\n\n"
        . 'ID: ' . $row['id'] . "\n"
        . 'Type: ' . $row['respondent_type'] . "\n"
        . 'Country: ' . ($row['country'] ?? '—') . "\n"
        . 'Urgency score: ' . $row['urgency_score'] . "\n"
        . 'Contact: ' . ($contact['email'] ?? 'none') . "\n\n"
        . 'View in admin: https://eecalunghealth.com/admin/responses/' . $row['id'];
    @mail($to, $subject, $body, 'From: noreply@eecalunghealth.com');
}

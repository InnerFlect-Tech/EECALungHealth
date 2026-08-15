import { SiteLayout } from '../components/Layout';
import { T } from '../i18n/I18nProvider';

type TeamMember = {
  name: string;
  role: string;
  bio1: string;
  bio2: string;
  roleHub: string;
  roleText: string;
  photo: string;
  alt: string;
  linkedin?: string;
};

const team: TeamMember[] = [
  {
    name: 'team-alesia-name',
    role: 'team-alesia-role',
    bio1: 'team-alesia-bio1',
    bio2: 'team-alesia-bio2',
    roleHub: 'team-alesia-role-hub',
    roleText: 'team-alesia-role-text',
    photo: '/assets/images/team/team-alesia.png',
    alt: 'Portrait of Alesia Matusevych',
    linkedin: 'https://www.linkedin.com/in/alesia-matusevych-558813a1/',
  },
  {
    name: 'team-gayane-name',
    role: 'team-gayane-role',
    bio1: 'team-gayane-bio1',
    bio2: 'team-gayane-bio2',
    roleHub: 'team-gayane-role-hub',
    roleText: 'team-gayane-role-text',
    photo: '/assets/images/team/team-gayane.png',
    alt: 'Portrait of Gayané Arustamyan',
    linkedin: 'https://www.linkedin.com/in/gayane-arustamyan/',
  },
  {
    name: 'team-daniel-name',
    role: 'team-daniel-role',
    bio1: 'team-daniel-bio1',
    bio2: 'team-daniel-bio2',
    roleHub: 'team-daniel-role-hub',
    roleText: 'team-daniel-role-text',
    photo: '/assets/images/team/team-daniel.png',
    alt: 'Portrait of Daniel Fernandes',
    linkedin: 'https://www.linkedin.com/in/indiasfernandes/',
  },
];

export function TeamPage() {
  return (
    <SiteLayout current="team">
      <section className="page-hero">
        <div className="page-hero-inner container">
          <p className="page-hero-eyebrow"><T k="nav-team" /></p>
          <h1><T k="team-title" /></h1>
          <p className="page-hero-lead"><T k="team-lead" /></p>
        </div>
      </section>
      <section className="section team-page">
        <div className="container">
          <div className="team-list" aria-label="Core team profiles">
            {team.map((member) => (
              <article className="team-profile" key={member.name}>
                <figure className="team-photo-wrap">
                  <img className="team-photo" src={member.photo} alt={member.alt} />
                </figure>
                <div className="team-content">
                  <div className="team-heading">
                    <h2><T k={member.name} /></h2>
                    {member.linkedin ? (
                      <a
                        className="team-linkedin"
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`LinkedIn – ${member.name}`}
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.83v1.65h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.77 2.5 4.77 5.75V21h-4v-5.35c0-1.28-.02-2.92-1.87-2.92-1.87 0-2.16 1.36-2.16 2.83V21h-4V9z" />
                        </svg>
                      </a>
                    ) : null}
                  </div>
                  <p className="team-title"><T k={member.role} /></p>
                  <p><T k={member.bio1} /></p>
                  <p><T k={member.bio2} /></p>
                  <p>
                    <strong><T k={member.roleHub} /></strong>{' '}
                    <T k={member.roleText} />
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

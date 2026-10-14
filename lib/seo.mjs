import inventory from '../reference/inventory.json' with {type: 'json'};

export const pages = inventory.pages;

export function siteUrl() {
  const url = new URL(process.env.SITE_URL || 'https://winbuzz-dsym.onrender.com');
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('SITE_URL must be an HTTP(S) origin without credentials.');
  }
  return url.origin;
}

export function isIndexable(route) {
  return !/^\/(tag|author|category)(\/|$)/.test(route);
}

const overrides = {
  '/how-to-create-winbuzz-account-step-by-step-guide': ['Create a Winbuzz Account: Step-by-Step Guide', 'Review the steps described for creating a Winbuzz account, including registration details, verification questions and account-security checks.'],
  '/winbuzz-bet-login-smart-habits': ['Winbuzz Login Habits: Everyday Account-Security Checks', 'Review everyday Winbuzz login habits, including password protection, device checks, saved credentials and account-activity awareness.'],
  '/winbuzz-com-login-issues-causes-fixes': ['Winbuzz Com Login Issues: Causes and Checks', 'Explore common Winbuzz Com login issues, including credential errors, browser behaviour, verification delays and connection checks.'],
  '/winbuzz-cricket-markets-explained': ['Winbuzz Cricket Markets: Match and Player Terms Explained', 'Read explanations of Winbuzz cricket-market terms, including match outcomes, runs, player selections and live-market considerations.'],
  '/winbuzz-cricket-match-updates': ['Winbuzz Cricket Match Updates: Scores and Navigation', 'Learn how Winbuzz cricket match updates are described, including score information, match navigation and account-access considerations.'],
  '/winbuzz-bet-india-betting-ban-legal-rules': ['Winbuzz Bet: India Betting Restrictions and Rules', 'Read the discussion of Winbuzz Bet and Indian betting restrictions, including legal-awareness questions and the need to verify current rules.'],
  '/how-to-recover-winbuzz-bet-login-username': ['Recover a Winbuzz Bet Username: Account-Access Checks', 'Review Winbuzz Bet username-recovery guidance, including saved account details, available support routes and credential-security precautions.'],
  '/winbuzz-id-password-reset-account-recovery': ['Winbuzz ID Password Reset: Account-Recovery Checks', 'Read Winbuzz ID password-reset guidance covering recovery options, verification questions and practical account-security checks.'],
};

export function pageSeo(route, page) {
  let title = page.title;
  let description = page.description;
  if (overrides[route]) [title, description] = overrides[route];
  const pagination = route.match(/^\/blog\/page\/(\d+)$/);
  if (pagination) {
    title = `Winbuzz Blog: Guides and Updates | Page ${pagination[1]}`;
    description = `Browse page ${pagination[1]} of the Winbuzz blog for account guidance, cricket articles, payment information and security topics.`;
  }
  const archive = route.match(/^\/(tag|category|author)\/(.+)$/);
  if (archive) {
    const topic = archive[2].replaceAll('-', ' ');
    description = archive[1] === 'author'
      ? `Browse articles published under the ${topic} author profile, including Winbuzz account, cricket, payment and security guides.`
      : `Browse Winbuzz articles grouped under ${topic}, with links to related guides, account information and cricket updates.`;
  }
  return {
    title: {absolute: title},
    description,
    alternates: {canonical: new URL(route, siteUrl()).href},
    robots: {index: isIndexable(route), follow: true},
  };
}

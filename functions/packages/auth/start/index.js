// GitHub OAuth — step 1. The CMS opens this in a popup; we redirect to GitHub's authorize
// page. GitHub then redirects back to the callback action with a code.
//
// Env: GITHUB_CLIENT_ID (from the GitHub OAuth App), OAUTH_REDIRECT_URI (the callback URL).

function main(args) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.OAUTH_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    return { statusCode: 500, body: 'OAuth relay not configured.' };
  }
  const url =
    'https://github.com/login/oauth/authorize' +
    '?client_id=' + encodeURIComponent(clientId) +
    '&redirect_uri=' + encodeURIComponent(redirectUri) +
    '&scope=' + encodeURIComponent('public_repo') +
    '&allow_signup=false';
  return { statusCode: 302, headers: { Location: url }, body: '' };
}

exports.main = main;

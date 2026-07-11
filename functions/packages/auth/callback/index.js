// GitHub OAuth — step 2. GitHub redirects here with ?code=. We exchange it for an access
// token and hand it back to the CMS window via the Netlify/Decap postMessage handshake.
//
// Env: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET (from the GitHub OAuth App).

function page(status, payload) {
  const msg = 'authorization:github:' + status + ':' + JSON.stringify(payload);
  return (
    '<!doctype html><html><head><meta charset="utf-8"></head><body>' +
    '<p style="font:15px -apple-system,sans-serif">Signing you in…</p>' +
    '<script>(function(){' +
    'var message=' + JSON.stringify(msg) + ';' +
    'function receive(e){' +
    'if(!window.opener){return;}' +
    'window.opener.postMessage(message, e.origin);' +
    'window.removeEventListener("message", receive, false);' +
    '}' +
    'window.addEventListener("message", receive, false);' +
    'if(window.opener){window.opener.postMessage("authorizing:github","*");}' +
    '})();</script></body></html>'
  );
}

async function main(args) {
  const code = args.code;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const htmlHeaders = { 'Content-Type': 'text/html; charset=utf-8' };

  if (!code) {
    return { statusCode: 400, headers: htmlHeaders, body: page('error', { error: 'missing code' }) };
  }
  if (!clientId || !clientSecret) {
    return { statusCode: 500, headers: htmlHeaders, body: page('error', { error: 'relay not configured' }) };
  }

  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await res.json();
    if (data.access_token) {
      return { statusCode: 200, headers: htmlHeaders, body: page('success', { token: data.access_token, provider: 'github' }) };
    }
    return { statusCode: 200, headers: htmlHeaders, body: page('error', { error: data.error || 'no access_token' }) };
  } catch (e) {
    return { statusCode: 200, headers: htmlHeaders, body: page('error', { error: 'token exchange failed' }) };
  }
}

exports.main = main;

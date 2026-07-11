// DigitalOcean Function — receives a stevebrock.bio "Stage Door" contact submission
// and emails it via Resend. The page posts a NATIVE HTML form (no JavaScript), so this
// action reads a URL-encoded body and answers with a 303 redirect back to the page
// (?sent=1 on success, ?sent=0 on failure) — that means NO CORS is involved at all.
//
// The Resend API key is read from the RESEND_API_KEY environment variable — never
// hardcoded, never in the repo. Deployed as a `web: raw` action so it can read the raw
// POST body + method and return its own status code + Location header.

const TO = 'steve@stevebrockmedia.com';
// updates.stevebrockmedia.com is verified in Resend — send from that domain.
const FROM = 'stevebrock.bio <noreply@updates.stevebrockmedia.com>';
// Where to send the visitor back to. Override with SITE_URL env once the domain is live.
const SITE_URL = process.env.SITE_URL || 'https://stevebrock.bio';

function redirect(ok) {
  return {
    statusCode: 303,
    headers: { Location: `${SITE_URL}/?sent=${ok ? '1' : '0'}#contact` },
    body: '',
  };
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

async function main(args) {
  const method = String(args.__ow_method || 'get').toUpperCase();
  if (method !== 'POST') return redirect(false);

  // Raw web action delivers the body in __ow_body — base64 only when the
  // __ow_isBase64Encoded flag is set; a urlencoded form arrives as a plain string.
  let params;
  try {
    const body = args.__ow_body || '';
    const raw = args.__ow_isBase64Encoded ? Buffer.from(body, 'base64').toString('utf8') : body;
    params = new URLSearchParams(raw);
  } catch {
    return redirect(false);
  }

  // Honeypot: a hidden field a human never fills. If a bot filled it, pretend
  // success and silently drop — no email sent.
  if ((params.get('botcheck') || '').trim() !== '') return redirect(true);

  const name = (params.get('name') || '').trim();
  const email = (params.get('email') || '').trim();
  const message = (params.get('message') || '').trim();
  if (!name || !email || !message) return redirect(false);

  const subject = `[stevebrock.bio] Message from ${name}`;
  const html =
    `<div style="font:14px -apple-system,Segoe UI,sans-serif;color:#111">` +
    `<p style="color:#666;margin:0 0 12px">New message via stevebrock.bio</p>` +
    `<table style="border-collapse:collapse">` +
    `<tr><td style="padding:4px 12px 4px 0;color:#666"><strong>Name</strong></td><td>${esc(name)}</td></tr>` +
    `<tr><td style="padding:4px 12px 4px 0;color:#666"><strong>Email</strong></td><td>${esc(email)}</td></tr>` +
    `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top"><strong>Message</strong></td>` +
    `<td style="white-space:pre-wrap">${esc(message)}</td></tr>` +
    `</table></div>`;
  const text = `Name: ${name}\nEmail: ${email}\n\n${message}`;

  const key = process.env.RESEND_API_KEY;
  if (!key) return redirect(false);

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: TO, subject, reply_to: email || undefined, html, text }),
    });
    return redirect(res.ok);
  } catch {
    return redirect(false);
  }
}

exports.main = main;

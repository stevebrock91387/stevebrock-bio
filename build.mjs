// build.mjs — regenerate index.html from content.json.
// The DESIGN lives here (edit this file to change layout/style); the CONTENT lives in
// content.json (edited via /admin). Run: `node build.mjs`. The GitHub Action runs this
// automatically whenever content.json changes, so the served index.html is always static.

import { readFileSync, writeFileSync } from 'node:fs';

const c = JSON.parse(readFileSync(new URL('./content.json', import.meta.url), 'utf8'));

// Escape text/attribute values for HTML. Content is Steve's own, but we escape so a stray
// & or < in a blurb never breaks the page.
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// A single work entry: italic title, optional year, blurb, optional single link.
function entry(e) {
  const year = e.year
    ? ` <span style="font-family:Archivo;font-size:.8rem;color:var(--ink-faint);font-weight:500">${esc(e.year)}</span>`
    : '';
  const link = e.linkText && e.linkUrl
    ? `\n      <p class="links"><a href="${esc(e.linkUrl)}">${esc(e.linkText)}</a></p>`
    : '';
  return `    <div class="entry">
      <h3><em>${esc(e.title)}</em>${year}</h3>
      <p>${esc(e.blurb)}</p>${link}
    </div>`;
}

const screenEntries = c.screen.map(entry).join('\n');
const stageEntries = c.stage.map(entry).join('\n');
const creditRows = (c.credits || []).map(x =>
  `    <p class="cred"><b>${esc(x.title)}</b><span class="r"> — ${esc(x.role)}</span>${x.year ? `<span class="y">${esc(x.year)}</span>` : ''}</p>`
).join('\n');
const connectRow = c.connect
  .map((s, i) => `      <a href="${esc(s.url)}">${esc(s.label)}</a>${i < c.connect.length - 1 ? '<span class="sep">·</span>' : ''}`)
  .join('\n');
const sid = esc(c.spotifyId);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Steve Brock — Actor · Singer-Songwriter · Filmmaker · Screenwriter</title>
<meta name="description" content="The program for Steve Brock: a Los Angeles actor, singer-songwriter, filmmaker, and screenwriter whose work blends music, film, and theater.">

<!-- Open Graph / social -->
<meta property="og:type" content="website">
<meta property="og:title" content="Steve Brock">
<meta property="og:description" content="Actor · Singer-Songwriter · Filmmaker · Screenwriter — work that blends music, film, and theater.">
<meta property="og:image" content="${esc(c.headshot).replace(/format=\\d+w/, 'format=1200w')}">
<meta property="og:url" content="https://stevebrock.bio">
<meta name="twitter:card" content="summary_large_image">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;0,6..96,700;1,6..96,400;1,6..96,500;1,6..96,600&family=Archivo:wght@400;500;600&family=Alfa+Slab+One&display=swap" rel="stylesheet">

<style>
  :root{
    --paper:#faf6ee;
    --paper-2:#f3ece0;
    --ink:#1c1813;
    --ink-soft:#4a4238;
    --ink-faint:#8a7f6f;
    --rule:rgba(28,24,19,.14);
    --brass:#9a6f2e;
    --brass-bright:#b98a3f;
    --field:#fffdf8;
    --maxw:44rem;
  }
  @media (prefers-color-scheme: dark){
    :root{
      --paper:#131110;
      --paper-2:#1a1715;
      --ink:#ece5d7;
      --ink-soft:#c3b8a6;
      --ink-faint:#8f8474;
      --rule:rgba(236,229,215,.16);
      --brass:#cca768;
      --brass-bright:#e0bd80;
      --field:#1d1917;
    }
  }
  /* explicit theme toggle wins in both directions */
  :root[data-theme="light"]{--paper:#faf6ee;--paper-2:#f3ece0;--ink:#1c1813;--ink-soft:#4a4238;--ink-faint:#8a7f6f;--rule:rgba(28,24,19,.14);--brass:#9a6f2e;--brass-bright:#b98a3f;--field:#fffdf8;}
  :root[data-theme="dark"]{--paper:#131110;--paper-2:#1a1715;--ink:#ece5d7;--ink-soft:#c3b8a6;--ink-faint:#8f8474;--rule:rgba(236,229,215,.16);--brass:#cca768;--brass-bright:#e0bd80;--field:#1d1917;}

  *{box-sizing:border-box}
  html{-webkit-text-size-adjust:100%;overflow-x:hidden}
  body{
    margin:0;
    overflow-x:hidden;
    background:var(--paper);
    color:var(--ink);
    font-family:"Archivo",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    font-size:17px;
    line-height:1.65;
    text-rendering:optimizeLegibility;
    -webkit-font-smoothing:antialiased;
  }
  .wrap{max-width:var(--maxw);margin:0 auto;padding:0 1.5rem}

  a{color:var(--brass);text-decoration:none;transition:color .15s}
  a:hover{color:var(--brass-bright);text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px}

  /* labels — letterspaced smallcaps */
  .label{
    font-size:.72rem;letter-spacing:.22em;text-transform:uppercase;
    color:var(--ink-faint);font-weight:600;
  }

  /* ---------- Masthead ---------- */
  header.cover{text-align:center;padding:4.5rem 0 3rem}
  .portrait{
    width:168px;height:168px;object-fit:cover;border-radius:50%;
    border:1px solid var(--rule);
    box-shadow:0 1px 0 rgba(255,255,255,.04);
    margin-bottom:1.9rem;
  }
  .name{
    font-family:"Alfa Slab One",serif;font-weight:400;
    font-size:clamp(2.6rem,10vw,4.8rem);line-height:.92;margin:0;
    text-transform:uppercase;letter-spacing:-.02em;
    display:inline-block;transform:scaleX(.62);transform-origin:center;
  }
  .roles{
    margin:1.15rem 0 0;font-size:.8rem;letter-spacing:.24em;
    text-transform:uppercase;color:var(--ink-soft);font-weight:500;
  }
  .roles span{white-space:nowrap}
  .essence{
    font-family:"Bodoni Moda",serif;font-style:italic;font-weight:400;
    font-size:1.12rem;color:var(--ink-soft);margin:1.6rem auto 0;max-width:32rem;
    line-height:1.5;
  }

  /* ---------- Nav ---------- */
  nav.bill{
    border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);
    text-align:center;padding:.85rem 0;margin-top:2.6rem;
    position:sticky;top:0;background:var(--paper);z-index:5;
  }
  nav.bill a{
    color:var(--ink-soft);font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;
    font-weight:600;margin:0 .7rem;
  }
  nav.bill a:hover{color:var(--brass);text-decoration:none}

  /* ---------- Acts ---------- */
  section.act{padding:3.4rem 0;border-bottom:1px solid var(--rule)}
  .act-head{margin-bottom:2rem;text-align:center}
  .act-no{display:block;margin-bottom:.5rem}
  .act-title{
    font-family:"Alfa Slab One",serif;font-weight:400;font-size:2.6rem;margin:0;line-height:1.05;
    text-transform:uppercase;letter-spacing:-.02em;
    display:inline-block;transform:scaleX(.6);transform-origin:center;
  }

  .lede{
    font-size:1.02rem;color:var(--ink-soft);max-width:34rem;margin:0 auto 2rem;
    text-align:center;
  }

  /* work entries */
  .entry{margin:0 0 1.7rem;padding:0}
  .entry:last-child{margin-bottom:0}
  .entry h3{
    font-family:"Bodoni Moda",serif;font-weight:600;font-size:1.28rem;margin:0 0 .25rem;
    line-height:1.25;
  }
  .entry h3 em{font-style:italic}
  .entry p{margin:.25rem 0 .4rem;color:var(--ink-soft);font-size:.98rem}
  .entry .links{font-size:.82rem;letter-spacing:.02em}
  .entry .links a{margin-right:.2rem}
  .sep{color:var(--ink-faint);margin:0 .35rem}

  /* selected credits */
  .cred-list{max-width:33rem;margin:0 auto}
  .cred{margin:.5rem 0;font-size:1rem;text-align:center;line-height:1.4}
  .cred b{font-family:"Bodoni Moda",serif;font-style:italic;font-weight:600;color:var(--ink)}
  .cred .r{color:var(--ink-soft)}
  .cred .y{color:var(--ink-faint);font-size:.82rem;margin-left:.45rem}

  /* embed */
  .embed{margin:2.2rem 0 0;border-radius:12px;overflow:hidden;border:1px solid var(--rule)}
  .embed iframe{display:block;width:100%;border:0}

  /* ---------- Connect ---------- */
  .company{text-align:center}
  .company .row{font-size:.86rem;line-height:2.1;letter-spacing:.04em}
  .company .row a{color:var(--ink-soft);font-weight:500;margin:0 .15rem}
  .company .row a:hover{color:var(--brass)}

  /* ---------- Stage Door / contact ---------- */
  form.stage-door{max-width:30rem;margin:1.6rem auto 0}
  .field{margin-bottom:1rem}
  .field label{display:block;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-faint);font-weight:600;margin-bottom:.35rem}
  .field input,.field textarea{
    width:100%;background:var(--field);border:1px solid var(--rule);border-radius:8px;
    padding:.7rem .8rem;font:inherit;font-size:.95rem;color:var(--ink);
  }
  .field input:focus,.field textarea:focus{outline:none;border-color:var(--brass);box-shadow:0 0 0 3px rgba(154,111,46,.14)}
  .field textarea{min-height:7rem;resize:vertical}
  .hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
  button.send{
    display:block;width:100%;background:var(--brass);color:var(--paper);
    border:0;border-radius:8px;padding:.8rem 1rem;font:inherit;font-weight:600;
    font-size:.8rem;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;
    transition:background .15s;
  }
  button.send:hover{background:var(--brass-bright)}
  #form-status{text-align:center;margin:1rem 0 0;font-size:.9rem}
  #form-status.ok{color:var(--brass)}
  #form-status.err{color:#b4462f}
  @media (prefers-color-scheme:dark){#form-status.err{color:#e08a6f}}

  .contact-extra{text-align:center;margin-top:2.2rem;font-size:.9rem;color:var(--ink-soft)}
  .contact-extra .k{display:block;font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-faint);margin-bottom:.15rem;font-weight:600}
  .contact-extra .grid{display:flex;flex-wrap:wrap;gap:1.6rem 2.4rem;justify-content:center;margin-top:.4rem}

  /* ---------- Footer ---------- */
  footer{text-align:center;padding:2.6rem 0 3.4rem;color:var(--ink-faint);font-size:.78rem}
  footer .colophon{margin-top:.5rem;font-style:italic;font-family:"Bodoni Moda",serif}

  /* theme toggle */
  .theme-toggle{position:fixed;top:.7rem;right:.9rem;z-index:20;background:transparent;border:1px solid var(--rule);border-radius:20px;color:var(--ink-faint);font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;padding:.3rem .7rem;cursor:pointer;font-family:inherit}
  .theme-toggle:hover{color:var(--brass);border-color:var(--brass)}

  @media (max-width:480px){
    body{font-size:16px}
    nav.bill a{margin:0 .45rem;font-size:.66rem}
    .name{font-size:2.1rem}
    .act-title{font-size:2rem}
  }
</style>
</head>
<body>

<button class="theme-toggle" id="themeToggle" aria-label="Toggle light or dark">Theme</button>

<!-- ============ COVER / MASTHEAD ============ -->
<header class="cover">
  <div class="wrap">
    <img class="portrait" src="${esc(c.headshot)}" alt="Steve Brock" width="168" height="168" style="object-position:center ${Number(c.headshotCrop) || 50}%">
    <h1 class="name">Steve Brock</h1>
    <p class="roles"><span>Actor</span> · <span>Singer-Songwriter</span> · <span>Filmmaker</span> · <span>Screenwriter</span></p>
    <p class="essence">${esc(c.essence)}</p>
  </div>
</header>

<!-- ============ THE BILL (nav) ============ -->
<nav class="bill">
  <a href="#screen">Screen</a>
  <a href="#stage">Stage</a>
  <a href="#song">Song</a>
  <a href="#connect">Connect</a>
  <a href="#contact">Contact</a>
</nav>

<div class="wrap">

  <!-- ============ OVERTURE / ABOUT ============ -->
  <section class="act" id="about" style="text-align:center">
    <p class="label" style="margin-bottom:1.1rem">Overture</p>
    <p style="font-family:'Bodoni Moda',serif;font-size:1.28rem;line-height:1.6;color:var(--ink-soft);max-width:34rem;margin:0 auto">
      ${esc(c.bioLead)}
      <em>${esc(c.bioEmphasis)}</em>
    </p>
    ${c.recognition ? `<p class="label" style="margin:1.7rem auto 0;color:var(--brass);letter-spacing:.16em">${esc(c.recognition)}</p>` : ''}
  </section>

  <!-- ============ ACT I — ON SCREEN ============ -->
  <section class="act" id="screen">
    <div class="act-head">
      <span class="label act-no">Act I</span>
      <h2 class="act-title">On Screen</h2>
    </div>
    <p class="lede">Films written, directed, and produced under the <a href="https://www.stevebrock.media/fof">Fair&nbsp;Oaks&nbsp;Films</a> banner &mdash; stories built around the people inside them.</p>

${screenEntries}
  </section>

  <!-- ============ SELECTED CREDITS ============ -->
  <section class="act" id="credits">
    <div class="act-head">
      <span class="label act-no">On Camera</span>
      <h2 class="act-title">Selected Credits</h2>
    </div>
    <div class="cred-list">
${creditRows}
    </div>
  </section>

  <!-- ============ ACT II — ON STAGE ============ -->
  <section class="act" id="stage">
    <div class="act-head">
      <span class="label act-no">Act II</span>
      <h2 class="act-title">On Stage</h2>
    </div>

${stageEntries}
    <div class="entry">
      <h3>Casting &amp; press</h3>
      <p>Profiles and the full press kit for casting directors and collaborators.</p>
      <p class="links">
        <a href="https://www.imdb.me/stevebrock">IMDb</a><span class="sep">·</span>
        <a href="http://resumes.actorsaccess.com/stevebrock">Actors Access</a><span class="sep">·</span>
        <a href="https://app.castingnetworks.com/talent/public-profile/c1a91e90-bdb3-11eb-ac81-9d7aec181d6d">Casting Networks</a><span class="sep">·</span>
        <a href="https://www.stevebrock.media/s/EPK.pdf">Press kit (EPK)</a>
      </p>
    </div>
  </section>

  <!-- ============ ACT III — IN SONG ============ -->
  <section class="act" id="song">
    <div class="act-head">
      <span class="label act-no">Act III</span>
      <h2 class="act-title">In Song</h2>
    </div>
    <p class="lede">Two albums &mdash; <em>Cry by the Light of the Moon</em> and <em>Infinity</em> &mdash; and <em>A&nbsp;Trip&nbsp;Around&nbsp;the&nbsp;Sun</em>, twenty original songs in a single year. Somewhere between Sinatra and James&nbsp;Taylor.</p>
    <p class="essence" style="margin:0 auto 1.4rem">&ldquo;Music is what happens when you&rsquo;re so full of emotion that mere words cannot express how you feel.&rdquo;</p>

    <div class="entry" style="text-align:center">
      <p class="links" style="font-size:.86rem;line-height:2.1">
        <a href="https://open.spotify.com/artist/${sid}">Spotify</a><span class="sep">·</span>
        <a href="https://music.apple.com/us/artist/steve-brock/504613119">Apple Music</a><span class="sep">·</span>
        <a href="https://music.youtube.com/channel/UCbJ-PcUB8aGwpr9_OQMdQ4w">YouTube Music</a><span class="sep">·</span>
        <a href="https://music.amazon.com/artists/B0C5LFG67B/steve-brock">Amazon Music</a><span class="sep">·</span>
        <a href="https://www.youtube.com/@SteveNBrockVEVO">VEVO</a><span class="sep">·</span>
        <a href="https://www.stevebrock.shop">Shop</a>
      </p>
    </div>

    <div class="embed">
      <iframe src="https://open.spotify.com/embed/artist/${sid}?theme=0" height="352" loading="lazy" allow="encrypted-media" title="Steve Brock on Spotify"></iframe>
    </div>
    ${c.featuredVideo ? `<div class="embed" style="margin-top:1.4rem">
      <iframe style="aspect-ratio:16/9;height:auto" src="https://www.youtube-nocookie.com/embed/${esc(c.featuredVideo)}" loading="lazy" allow="encrypted-media" allowfullscreen title="Steve Brock — featured music video"></iframe>
    </div>` : ''}
  </section>

  <!-- ============ THE COMPANY / CONNECT ============ -->
  <section class="act company" id="connect">
    <div class="act-head">
      <span class="label act-no">The Company</span>
      <h2 class="act-title">Connect</h2>
    </div>
    <p class="row">
${connectRow}
    </p>
  </section>

  <!-- ============ STAGE DOOR / CONTACT ============ -->
  <section class="act" id="contact" style="border-bottom:none">
    <div class="act-head">
      <span class="label act-no">Stage Door</span>
      <h2 class="act-title">Get in touch</h2>
    </div>

    <form class="stage-door" action="https://faas-sfo3-7872a1dd.doserverless.co/api/v1/web/fn-235d4b39-8a3a-4926-bbd7-b91a85a6d964/contact/submit" method="POST">
      <!-- honeypot: real people leave this empty -->
      <div class="hp" aria-hidden="true"><label>Leave this empty<input type="text" name="botcheck" tabindex="-1" autocomplete="off"></label></div>
      <div class="field">
        <label for="name">Name</label>
        <input id="name" name="name" type="text" required>
      </div>
      <div class="field">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" required>
      </div>
      <div class="field">
        <label for="message">Message</label>
        <textarea id="message" name="message" required></textarea>
      </div>
      <button class="send" type="submit">Send</button>
      <p id="form-status" hidden></p>
    </form>

    <div class="contact-extra">
      <div class="grid">
        <div><span class="k">Email</span><a href="mailto:steve@stevebrockmedia.com">steve@stevebrockmedia.com</a></div>
        <div><span class="k">Phone</span><a href="tel:+16616454741">(661) 645-4741</a></div>
        <div><span class="k">vCard</span><a href="/contact.vcf" download="Steve-Brock.vcf">Save contact</a></div>
      </div>
      <p style="margin-top:1.7rem;font-size:.82rem;color:var(--ink-faint)"><span class="k" style="display:inline;margin-right:.5rem">Management</span>Andy Rooney · Midwest Talent · <a href="mailto:andy@midwesttalent.com">andy@midwesttalent.com</a> · <a href="tel:+13238616679">(323) 861-6679</a></p>
    </div>
  </section>

</div>

<footer>
  <div class="wrap">
    <div>&copy; <span id="yr">2026</span> Steve Brock. All rights reserved.</div>
    <div class="colophon">End of program.</div>
  </div>
</footer>

<script>
  // year
  document.getElementById('yr').textContent = new Date().getFullYear();

  // theme toggle (persisted)
  (function(){
    var root=document.documentElement, key='sb-theme';
    var saved=localStorage.getItem(key);
    if(saved) root.setAttribute('data-theme',saved);
    document.getElementById('themeToggle').addEventListener('click',function(){
      var cur=root.getAttribute('data-theme');
      if(!cur){ cur = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light'; }
      var next = cur==='dark' ? 'light':'dark';
      root.setAttribute('data-theme',next);
      localStorage.setItem(key,next);
    });
  })();

  // contact form status from ?sent=
  (function(){
    var p=new URLSearchParams(location.search);
    if(!p.has('sent')) return;
    var el=document.getElementById('form-status');
    if(!el) return;
    el.hidden=false;
    if(p.get('sent')==='1'){ el.textContent='Thanks — your message is on its way.'; el.className='ok'; }
    else { el.textContent='Something went wrong. Please email andy@midwesttalent.com.'; el.className='err'; }
    var f=document.getElementById('contact'); if(f) f.scrollIntoView();
  })();
</script>
</body>
</html>
`;

writeFileSync(new URL('./index.html', import.meta.url), html);
console.log('index.html written from content.json');

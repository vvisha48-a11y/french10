# The assistant server

This tiny server exists for one reason: **your Gemini key must never reach a
student's browser.** `docs/app.html` is a static file on GitHub Pages, so
anything it carries is visible in DevTools' Network tab — no amount of hiding
changes that. The key lives here instead, and students' browsers only ever send
their Firebase sign-in.

## What it checks before spending anything

1. **A real sign-in.** The request must carry a valid Firebase ID token for
   *your* project. Without this, anyone who found the URL could spend your money.
   Verified against Google's public keys — tested to reject forged signatures,
   `alg:none` downgrades, expired tokens, tampered payloads and tokens from
   other Firebase projects.
2. **Your class switch.** It reads `config/ai` in Firestore. Turning students off
   in **Admin → AI** stops requests here too, not just in the app.
3. **A burst guard** — 15 requests a minute per student. No human reaches that;
   a runaway loop hits it instantly. It is the only thing standing between a bug
   and a large bill.

It also refuses to name any model but the two on its allow-list, so nobody can
ask it for an expensive one on your account.

---

## Setting it up (about ten minutes, once)

**1. Install the tool and sign in**

```bash
cd "C:/claude/10 th/ai-proxy" && npx wrangler login
```

A browser window opens; approve it. Create a free Cloudflare account first if
you do not have one — no card needed.

**2. Put your Gemini key in, as a secret**

```bash
cd "C:/claude/10 th/ai-proxy" && npx wrangler secret put GEMINI_KEY
```

Paste the key when prompted. It is stored by Cloudflare, never written to a file
here, and never committed to git.

**3. Deploy**

```bash
cd "C:/claude/10 th/ai-proxy" && npx wrangler deploy
```

It prints a URL like `https://cbse-french-ai.<your-name>.workers.dev`. Copy it.

**4. Tell the app where it is**

Open the app as teacher → **Admin → AI** → paste the URL into *Assistant server*
→ **Save**. Tick *Students may use the assistant*.

**5. Lock it to your site** (after GitHub Pages is live)

Uncomment `ALLOWED_ORIGINS` in `wrangler.toml`, set it to your Pages URL, and
deploy again. Without this, someone could point their own page at your proxy.

---

## Day to day

- **Turn the class off:** Admin → AI → untick *Students may use the assistant*.
  Takes effect within a minute, in the app and at the server.
- **Change the key:** re-run step 2 and deploy again.
- **See what it is doing:** `npx wrangler tail` streams live requests.

## What it costs

About **$0.0005 per question**. Realistic class use — 76 students asking ~20
questions a day — is roughly **$16 a month**. The burst guard and Cloudflare's
own 100,000/day free ceiling bound the worst case.

One thing worth doing before you rely on it in a lesson: **enable billing on the
Gemini key itself**. On Google's free tier, 76 students behind one key will hit
per-project rate limits mid-class and start seeing "the class is busy".

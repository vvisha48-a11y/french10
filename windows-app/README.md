# French Grammar for Windows

The CBSE Class 10 French deck as a Windows app. It is the website, served from the
app's own folder, so it opens instantly, keeps working with no internet after one
approved sign-in, and updates itself from GitHub Releases.

Nothing in the website changes. Everything desktop-only lives in this folder:
`npm run check` proves on every build that `docs/`, `build-system/`, `ai-proxy/`,
`master-grammar-app.html` and `firestore.rules` are untouched.

## Everyday use

| You want to… | Run in `windows-app/` |
|---|---|
| Try the app | `npm start` |
| Build the installer only | `npm run dist` (→ `release/French-Grammar-Setup.exe`) |
| Publish an update to every student | `npm version patch` then `npm run release` |

After changing lessons, run `bash build.sh` at the repo root first as usual. The
next `npm start` / `npm run release` copies the new lessons in.

**First time on a PC:** install Node.js, then run `npm install` in this folder.

## What the app adds to the website

- **Opens as the website.** The window shows
  `https://vvisha48-a11y.github.io/french10/app.html`, but every file comes from
  disk (`src/serve-local.js`). Sign-in, teacher approval and the AI assistant work
  unchanged, because they all check that address.
- **Offline after one approved sign-in.** The 3 Firebase files are bundled. The
  student's approved profile is remembered on the PC, per account
  (`scripts/offline-approval.js`, applied to the app's copy only). Online, the
  live check always runs, so removing a student takes effect the next time they
  are online.
- **Sharp photos.** The 85 lesson photos are the full-resolution originals, loaded
  in the background after the first slide.
- **Presentation defaults.** Every launch starts in Plus Jakarta Sans at
  130% — Projector. "150% — Maximum" is added to Text size. Photos lose the striped
  placeholder, and cards scroll instead of cutting off. In model letters the English
  line is the same size as the French, in slate `#334155` on light themes.
- **Search everything, offline: Ctrl+Shift+F.** Full text of 950 slides and the 237
  exam questions, indexed in about a third of a second. Past-paper answers and
  teacher-only notes are left out of the results.
- **Printing: Ctrl+P or 🖨️.** A choice of **Print** or **Save as PDF**, one slide
  per A4 landscape page, in colour (the projector-view layout from commit 9d77c11).
- **📚 saves the whole workbook as one PDF per topic** into a folder you choose, in
  that same layout — 198 files, about three and a half minutes, named
  `001 Les Verbes - Le Présent.pdf` and so on, and the folder opens when it is done.
  It cannot be one print job: 950 slides is more than Windows will take (measured —
  both a printer and Save as PDF refuse a job that size).
- **📅 Class materials: Ctrl+Shift+M.** See below.
- **Updates.** A silent check on launch. If there is a new version, a card appears at
  the top right of the screen with **Download and restart** / **Later**. It never
  takes the keyboard away from the lesson.

## 📅 Class materials — one-time setup

1. **Publish the rule.** Open `firestore-daily-materials.rules.txt` and follow the
   three lines at its top (Firebase console → Firestore → Rules → paste → Publish).
   Until then the calendar tells you so.
2. **Links need nothing more.** In the app, open 📅, pick a day and use **Publish a
   link** with any Google Drive or Google Docs link.
3. **To drag files in from your PC** (uploaded to *your* Drive, shared as view-only
   links, published automatically), connect Google Drive once, on your PC only:
   1. At <https://console.cloud.google.com>, create a project, e.g. *French Grammar*.
   2. **APIs & Services → Library**: enable **Google Drive API**.
   3. **OAuth consent screen**: set it up as *External*, then **Publish app** so it is
      *In production*. (While it says *Testing*, Google expires the sign-in every
      7 days.) The app asks only for `drive.file` (access to the files it creates
      itself, nothing else in your Drive), which needs no Google review.
   4. **Credentials → Create credentials → OAuth client ID → Desktop app**, then
      **Download JSON**.
   5. In the app: 📅 → **Connect Google Drive** → choose that JSON → sign in to
      Google in your browser.

   The sign-in is kept on that PC only, encrypted by Windows. Nothing secret is in
   the installer.

Students see a read-only list with **Open Document ↗**, which opens in their normal
browser. Only Google Drive and Google Docs links are ever opened.

## Publishing updates — one-time setup

`npm run release` uploads the installer to GitHub Releases of
`vvisha48-a11y/french10`, which is where every installed copy looks. It needs a
GitHub token in the `GH_TOKEN` environment variable:

1. GitHub → Settings → Developer settings → **Fine-grained tokens** → Generate:
   repository *french10* only, permission **Contents: Read and write**.
2. In a terminal of your own: `setx GH_TOKEN "the-token"`, then open a new terminal.

Keep the token to yourself. Students need no token: the repository is public.

## Switches

Add these to the app's shortcut (*Target* field) or after `npm run dev --`:

- `--safe-graphics`: turns GPU acceleration off, for a PC whose graphics driver
  draws the slides wrongly.
- `--offline-test`: behaves as if the internet were down, without unplugging
  anything.
- `--preview-update-card`: shows the update card with a pretend version.
- `--pdf-to=C:\path\file.pdf` (testing): a print button saves straight to that PDF,
  skipping the dialogs.

## Honest limits

- Internet is still needed for the first sign-in on a PC, and for AI, the
  leaderboard, the class picker, the calendar, uploads and updates.
- The installer is unsigned for now. Windows shows *"Windows protected your PC"*
  once per PC (**More info → Run anyway**). Updates still install normally.
- Google may refuse **Sign in with Google** inside apps. Email/password and phone
  sign-in always work.
- Printing keeps strictly one slide per sheet. 8 of the 950 slides are taller than
  a projector screen, and their bottom is cut on paper: the two *What Was Corrected*
  model-message slides, and the *Photo → mot* games of Leçons 3, 4, 5, 6, 7 and 10.
- The Question Papers stack is the exception that flows across sheets. Printed
  whole, it is 104 pages and about 49 MB, because Chromium redraws the one long
  card on every sheet (the website's own print of it is 78 pages and 24 MB).
- Sign in with Google opens Google's own pages in the app. Google may still refuse
  them there; email/password and phone sign-in are unaffected.

## Files

```
src/main.js            window, menu, print/PDF, safe external links, permissions
src/serve-local.js     the website address, answered from content/; everything else -> network
src/preload.js         window.desktop: the page's only bridge; loads the layers below
src/updater.js         silent check + src/notify.html, the top-right card
src/drive.js           Google Drive sign-in (teacher's PC) + upload + sharing
src/inject/            the layers: ui-overrides, print-landscape, print-bridge,
                       photo-preload, search, calendar
scripts/sync-content.js     docs/app.html + photos + SDK -> content/ (read-only on the website)
scripts/offline-approval.js the one patch to the app's copy of app.html
scripts/check-desktop.js    the gate (npm run check)
scripts/make-icon.js        draws build/icon.png, the placeholder icon
firestore-daily-materials.rules.txt   the rule to paste for the calendar
```

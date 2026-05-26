# Avishai Kolet — Resume Website

Elegant, modern, single-page static website that presents the data from `Avishai_Kolet_resume.pdf` in an attractive and highly usable way.

**Live preview**: Open `index.html` in any browser (double-click).

## Features

- Dark-first professional design (teal accents) with instant light/dark toggle (persisted)
- All content faithfully extracted from the original PDF resume
- Interactive skills filter (live text search + category chips)
- One-click copy buttons for phone, email, and LinkedIn
- Print-optimized layout (produces a clean, professional A4/Letter resume)
- Mobile responsive with hamburger menu
- Direct download link to the original PDF
- Zero dependencies — works offline after first load

## Quick Start (Windows)

1. Double-click `index.html` (or run in PowerShell):
   ```powershell
   Start-Process .\index.html
   ```
2. Or serve it locally for the best experience:
   ```powershell
   python -m http.server 8000
   ```
   Then open http://localhost:8000

## Files

- `index.html` — Main site (Tailwind via CDN + all content)
- `css/style.css` — Print styles + visual polish
- `js/main.js` — Interactivity (theme, copy, filters, active nav)
- `Avishai_Kolet_resume.pdf` — Original source PDF (linked for download)

## Customization

All resume data lives directly in `index.html` (search for the section headings).  
To update:

- **Contact info / name / title**: Edit the hero section near the top
- **Summary, Experience, Education, Projects**: Edit the corresponding `<section>`
- **Skills**: Edit the skill pills inside `#skills-grid` (keep the `data-group` attributes for filtering)
- **Colors / theme**: Change the Tailwind classes or edit the accent color in `css/style.css`

The site stays beautiful with minimal changes.

## Deployment

### GitHub Pages (recommended — 3 minutes)

1. Create a new GitHub repository (public or private).
2. Upload the 5 files (or push via git).
3. Go to **Settings → Pages** → Source: “Deploy from a branch” → Branch: `main` → Save.
4. Your site will be live at `https://<username>.github.io/<repo>` within ~1 minute.

Add a `.nojekyll` file (empty) in the root if you ever see 404 issues on assets.

### Other easy options

- **Netlify Drop**: Drag the folder onto https://app.netlify.com/drop
- **Vercel**: Import the folder or use the CLI
- **Cloudflare Pages**: Connect the repo

## Print / PDF Export

Click the **Print** button in the navbar (or press Ctrl/Cmd + P).  
The stylesheet produces a clean, professional document with proper margins and no navigation elements.

You can also use “Save as PDF” from the browser’s print dialog.

## Accessibility & Performance

- Semantic HTML + proper heading hierarchy
- Keyboard accessible (all interactive elements)
- WCAG AA contrast in both themes
- ~120 KB total (mostly Tailwind CDN — cached after first visit)
- Works without JavaScript (graceful degradation)

## Credits

Built from the original one-page PDF resume of Avishai Kolet.  
Data is presented 1:1 with only minor date formatting for human readability.

---

Open `index.html` and enjoy. Feedback welcome!

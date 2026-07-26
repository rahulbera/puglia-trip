# Puglia Companion

A mobile-first, JSON-driven travel dashboard for a ten-day trip through Puglia.

## Open it locally

The app loads its itinerary and beach data with `fetch`, so open it through a small local web server rather than double-clicking `index.html`:

```bash
git clone <your-repository-url>
cd puglia-trip
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## Publish it with GitHub Pages

This repository includes a GitHub Actions workflow that deploys the static app whenever a commit reaches the `main` branch.

1. Push this project to a GitHub repository and merge the app changes into `main`.
2. Open the repository on GitHub and select **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Open the **Actions** tab and wait for **Deploy Puglia Companion to GitHub Pages** to finish.
5. Follow the deployment URL shown in that workflow, or select **Visit site** in **Settings → Pages**.

For a project repository named `puglia-trip`, the resulting address normally has this form:

```text
https://YOUR-GITHUB-USERNAME.github.io/puglia-trip/
```

The exact address depends on the GitHub account and repository name.

## Update trip content

- Edit `data/itinerary.json` to change daily plans and transfers.
- Edit `data/beaches.json` to change beach information.
- The page is rendered from those files by `script.js`; no build command is required.

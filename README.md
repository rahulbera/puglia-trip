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
3. Under **Build and deployment**, set **Source** to **GitHub Actions**. The workflow also uses `enablement: true` so the first run can create the Pages site when it does not exist yet.
4. Open the **Actions** tab, select **Deploy Puglia Companion to GitHub Pages**, and use **Run workflow** if the failed run happened before Pages was enabled.
5. Wait for the workflow to finish, then follow its deployment URL or select **Visit site** in **Settings → Pages**.

### Fixing “Get Pages site failed”

This error means GitHub's Pages API could not find an enabled Pages site for the repository. The included workflow can now enable it during the first deployment. After merging this fix, rerun the failed workflow or start it manually from the **Actions** tab.

If the error continues:

1. Confirm **Settings → Pages → Source** is set to **GitHub Actions**.
2. Confirm **Settings → Actions → General → Workflow permissions** allows read and write permissions, if that option is managed at repository level.
3. Check whether an organization policy disables GitHub Pages or prevents Actions from creating Pages sites; an organization owner must change that policy.
4. On GitHub Free, confirm the repository is public. Private-repository Pages availability depends on the account or organization plan.

For a project repository named `puglia-trip`, the resulting address normally has this form:

```text
https://YOUR-GITHUB-USERNAME.github.io/puglia-trip/
```

The exact address depends on the GitHub account and repository name.

## Update trip content

- Edit `data/itinerary.json` to change daily plans and transfers.
- Edit `data/beaches.json` to change beach information.
- The page is rendered from those files by `script.js`; no build command is required.

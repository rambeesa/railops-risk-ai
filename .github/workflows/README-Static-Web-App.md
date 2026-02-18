# Azure Static Web Apps workflow

If your GitHub Actions run shows:
- `app_location: ./railops-risk`
- `output_location: build`

then GitHub is **not** using the correct workflow. That usually means either:

1. **Another workflow file exists** (often created by Azure when you connected the Static Web App), e.g. `azure-static-web-apps-<random>.yml`. It overrides or runs instead of this one.
2. **This repo’s workflow wasn’t pushed** – the version on GitHub is still the old one.

**Fix on GitHub:**

1. In your repo, go to **Code** → **`.github/workflows`** and open each `.yml` file.
2. Find the workflow that contains `app_location: ./railops-risk` and `output_location: build`.
3. Either:
   - **Option A:** Replace that file’s entire content with the content of **`azure-static-web-apps.yml`** from this repo (so it uses `railops-risk/frontend`, `dist`, and `app_build_command`), **or**
   - **Option B:** Delete that workflow file, then commit and push this repo so **`azure-static-web-apps.yml`** is the only Static Web Apps workflow.
4. Re-run the workflow from the **Actions** tab.

The correct workflow must have:
- `app_location: "railops-risk/frontend"`
- `output_location: "dist"`
- `app_build_command: "npm install && npm run build"`

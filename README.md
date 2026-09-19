# RoboICL website

The site is static and has no build step.

## Preview in VS Code

Fastest path: press **F5** and choose **Preview: Main website**. VS Code starts the server on port `4173`, forwards the port, and opens the page.

Alternatively:

1. Run **Tasks: Run Task** from the Command Palette.
2. Choose **RoboICL: Preview website**.
3. Open the forwarded port **4173**, or run **Simple Browser: Show** and enter `http://localhost:4173`.

The recommended Live Server extension is also configured with `website/` as its root and port `4173`.

Do not open `index.html` as a `file://` URL: serving it over HTTP makes video seeking and downloaded component assets behave consistently.

## Site structure

- `index.html` is the sole page entry point.
- `styles.css` contains the site styles, and `script.js` contains its interactions and visualizations.
- `assets/videos/teaser-grid/` contains the head-camera clips used by the Figure 1 matrix.
- `assets/data/request-anatomy.public.json` is a sanitized structural specimen of model call 49.

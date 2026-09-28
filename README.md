# RoboICL website

## Preview in VS Code

From this directory, start a static server:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Forward port `8000` in VS Code and open the forwarded URL. Do not open
`index.html` through a `file://` URL because rollout data and videos are loaded
over HTTP.

## Site structure

- `index.html` is the page entry point.
- `styles.css` contains the site styles.
- `script.js` contains the benchmark visualizations and rollout player.
- `assets/data/benchmark-rollouts.json` indexes the available rollouts.
- `assets/data/benchmark-traces/` contains recorded policy-decision traces.
- `assets/videos/benchmark/` contains the three-view rollout videos.

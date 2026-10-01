# Claims Dashboard Rebuild

A responsive static HTML/CSS/JavaScript recreation of the supplied hospital claims dashboard screenshot.

## Run

Open `index.html` directly, or serve the folder locally:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Included behavior

- Responsive desktop, tablet, and mobile layout
- Expandable mobile sidebar
- Search and status filtering
- Client-side pagination
- Excel file picker and drag-and-drop validation
- Mock upload queue updates
- Profile dropdown and toast feedback
- Mock recent activity list

## Integration points

Replace the `files` and `activities` arrays in `app.js` with API responses. Replace the mock `acceptFiles()` behavior with `FormData` and your upload API. Connect action buttons to your project routes or handlers.

## Dependencies

Google Fonts and Font Awesome are loaded from CDNs. To run fully offline, download those assets and update the links in `index.html`.

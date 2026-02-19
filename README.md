# Beefree SDK Playground

A demonstration of [Beefree SDK](https://docs.beefree.io/beefree-sdk) integration featuring template selection, HTML import, static exports, configuration toggles, and a live beeConfig editor.

---

## Features

### Beefree SDK Editor
- Full-featured email/page builder powered by Beefree SDK
- Real-time editing with onChange/onSave callbacks
- Custom CSS injection, sidebar position control, and module grouping
- Editable beeConfig JSON with live apply

### HTML Import
- One-click import of a sample newsletter template
- Server-side conversion from HTML to Beefree JSON via the Beefree HTML Importer API

### Static Exports
All exports are pre-generated static files. User edits in the editor are **not** included in exports. A confirmation prompt is shown before each export. Supported formats: HTML, Plain Text, PDF, and Image (PNG).

For live Content Services API integration, see the [official SDK code samples](https://docs.beefree.io/beefree-sdk/apis/content-services-api).

### Configuration Toggles
- **Apply Custom CSS** - Adds/removes the `customCss` property in beeConfig
- **Move Sidebar** - Toggles `sidebarPosition` between `"left"` and `"right"`
- **Group Content Tiles** - Adds/removes `modulesGroups` configuration

---

## Quick Start

### Prerequisites
- Node.js >= 18
- npm
- Beefree SDK credentials ([Get them here](https://developers.beefree.io))

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd playground

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your API keys

# Start development servers (two terminals)
npm run dev          # Frontend — http://localhost:5173
npm run dev:proxy    # Backend  — http://localhost:3001
```

---

## Project Structure

```
playground/
├── api/                            # Serverless Functions
│   ├── proxy/bee-auth.js           # Authentication endpoint
│   └── v1/html-importer.js        # HTML-to-JSON conversion (hardcoded sample)
│
├── src/
│   ├── components/
│   │   ├── BeefreeEditor.tsx       # SDK lifecycle and initialization
│   │   ├── BeeConfigSidebar.tsx    # JSON config editor + toggle handlers
│   │   ├── TemplateTopBar.tsx      # Template dropdown + toggle switches
│   │   ├── ExportDropdown.tsx      # Export menu
│   │   ├── ExportResultModal.tsx   # Export results display + download
│   │   ├── HtmlImportModal.tsx     # HTML import modal
│   │   └── sampleHtml.ts          # Sample newsletter HTML template
│   ├── services/
│   │   ├── api.ts                  # Axios client for authentication
│   │   └── localTemplates.ts       # Static template loader
│   ├── types/
│   │   ├── beefree.ts              # Beefree SDK type definitions
│   │   ├── index.ts                # Re-exports
│   │   └── window.ts              # Window interface extensions
│   ├── utils/
│   │   └── downloadHelpers.ts      # File download utilities
│   ├── constants/
│   │   └── index.ts                # App constants and default config
│   ├── App.tsx                     # Root component
│   ├── App.css                     # Global styles
│   └── main.tsx                    # React entry point
│
├── public/
│   ├── template.json               # Initial template (loaded on app start)
│   └── templates/
│       ├── index.json              # Template catalog index
│       ├── *.json                  # Individual template JSON files
│       └── exports/                # Pre-generated static exports
│           ├── *.html
│           ├── *.txt
│           ├── *.pdf
│           └── *.png
│
├── docker/
│   └── Dockerfile.backend          # Backend container (Node 18 Alpine)
│
├── proxy-server.js                 # Express dev server (local development)
├── vite.config.ts                  # Vite build config + dev proxy
├── vitest.config.ts                # Test configuration
├── tsconfig.json                   # TypeScript configuration
├── eslint.config.js                # Linting rules
└── package.json
```

---

## Technologies

- **React 18** + **TypeScript** (strict mode) — UI framework
- **Vite 5** — Build tool and dev server
- **Beefree SDK 9.2.1** — Email/page builder
- **Express** — Local dev proxy server
- **Helmet** — Security headers
- **express-rate-limit** — Rate limiting
- **Vitest** + **Testing Library** — Unit tests

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/proxy/bee-auth` | POST | Authenticate with Beefree and get SDK token |
| `/v1/html-importer` | POST | Convert sample HTML to Beefree JSON |
| `/healthcheck` | GET | Server health check (local dev only) |

---

## Environment Variables

### Required

```bash
BEE_CLIENT_ID=your_client_id
BEE_CLIENT_SECRET=your_client_secret
```

### Optional

```bash
# Only needed for the "Import HTML" feature
HTML_IMPORTER_API_KEY=your_importer_key

# CORS origins for the proxy server (comma-separated, default: http://localhost:5173)
ALLOWED_ORIGINS=http://localhost:5173

# Proxy server port (default: 3001)
PORT=3001
```

---

## Security

The proxy server includes the following security measures:

- **CORS** — Restricted to configured allowed origins (not open to all)
- **Rate limiting** — 100 requests per 15 minutes globally, 20 per 15 minutes on the auth endpoint
- **Helmet** — Standard security headers (X-Frame-Options, X-Content-Type-Options, CSP, HSTS, etc.)
- **Input validation** — `uid` parameter validated with pattern matching and length limits; HTML sanitized before processing
- **Error handling** — Internal error details are not leaked to clients
- **Payload limits** — Request body limited to 5MB
- **No hardcoded secrets** — All credentials read from environment variables; `.env` files are gitignored

---

## Testing

### Run Tests

```bash
npm test              # Watch mode
npm run test:run      # Single run
npm run test:coverage # With coverage report
npm run test:ui       # Vitest UI
```

### Manual Testing Checklist

- [ ] Builder initializes with the demo template auto-selected
- [ ] Template dropdown shows all available templates
- [ ] Selecting a template loads it in the editor
- [ ] Custom CSS toggle adds/removes `customCss` in beeConfig
- [ ] Move Sidebar toggle moves the sidebar left/right
- [ ] Group Content Tiles toggle groups modules
- [ ] Export HTML/Text/PDF/Image shows confirmation, then displays result
- [ ] Import HTML loads the sample newsletter
- [ ] Editing beeConfig JSON + "Apply changes" restarts the editor
- [ ] "Reset" button restores default configuration

---

## Deployment

### Docker (Backend Only)

```bash
docker build -f docker/Dockerfile.backend -t playground-backend .
docker run -p 3001:3001 --env-file .env playground-backend
```

---

## How It Works

### Template Loading
1. App loads and auto-selects the initial template
2. User selects a different template from the dropdown
3. Template JSON is fetched from `/templates/{id}.json`
4. `BeefreeEditor` normalizes the JSON and loads it into the SDK

### Export Flow
1. User clicks Export and selects a format
2. Confirmation prompt warns that user edits are not included
3. Pre-generated static file is loaded from `/templates/exports/`
4. Result is displayed in a modal with a download option

### Configuration Toggles
1. User toggles a switch in the template top bar
2. The corresponding window function updates the beeConfig JSON
3. Changes are auto-applied and the editor restarts with the new config

---

## Resources

- [Beefree SDK Documentation](https://docs.beefree.io/beefree-sdk)
- [SDK Configuration Reference](https://docs.beefree.io/beefree-sdk/reference/sdk-configuration)
- [Developer Portal](https://developers.beefree.io)
- [Support](https://devportal.beefree.io)

---

## License

See [LICENSE](./LICENSE) file for details.

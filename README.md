# Beefree SDK Playground

A demonstration of [Beefree SDK](https://docs.beefree.io/beefree-sdk) integration featuring template selection, HTML import, static exports, configuration toggles, and a live beeConfig editor.

---

## Features

### Beefree SDK Editor
- Full-featured email/page builder powered by the [@beefree.io/react-email-builder](https://github.com/BeefreeSDK/react-email-builder) React wrapper
- Declarative `<Builder>` component with `useBuilder` hook for SDK lifecycle management
- Real-time editing with onChange/onSave callbacks
- Dynamic configuration updates via `updateConfig` (no full restart needed)
- Custom CSS injection, sidebar position control, and module grouping
- Editable beeConfig JSON with live apply

### HTML Import
- One-click import of a sample newsletter template
- Server-side conversion from HTML to Beefree JSON via the Beefree HTML Importer API

### Static Exports
All exports are pre-generated static files. User edits in the editor are **not** included in exports. A confirmation prompt is shown before each export. Supported formats: HTML, Plain Text, PDF, and Image (PNG).

For live Content Services API integration, see the [official SDK code samples](https://docs.beefree.io/beefree-sdk/apis/content-services-api).

### Preset configuration changes (toggles)
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
├── src/
│   ├── components/
│   │   ├── BeefreeEditor.tsx       # Builder + useBuilder wrapper
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
│   ├── favicon.png                 # Beefree favicon
│   ├── apple-touch-icon.png        # Beefree apple touch icon
│   └── templates/
│       ├── index.json              # Template catalog index
│       ├── *.json                  # Individual template JSON files
│       └── exports/                # Pre-generated static exports
│           ├── *.html
│           ├── *.txt
│           ├── *.pdf
│           └── *.png
│
├── scripts/
│   ├── deploy-frontend.sh          # S3 deploy script with Matomo injection
│   └── matomo-tracking.txt         # Matomo tracking snippet (injected at deploy time)
│
├── docker/
│   └── Dockerfile.backend          # Backend container (Node 18 Alpine)
│
├── proxy-server.js                 # Express proxy server (auth + HTML importer)
├── vite.config.ts                  # Vite build config + dev proxy
├── vitest.config.ts                # Test configuration
├── tsconfig.json                   # TypeScript configuration
├── eslint.config.js                # Linting rules
└── package.json
```

---

## Architecture

### Frontend
- **React 18** + **TypeScript** — UI framework
- **Vite 5** — Build tool and dev server
- **@beefree.io/react-email-builder** — Official React wrapper for the Beefree SDK
- **Vitest** + **Testing Library** — Unit tests

### Backend (Proxy Server)
- **Express** — HTTP server
- **Helmet** — Security headers
- **express-rate-limit** — Rate limiting
- **Axios** — HTTP client for upstream Beefree APIs

### Deployment
- **Frontend** — Static build (`npm run build`) deployed to S3
- **Backend** — Docker container deployed to AWS ECS
- Environment variables: `VITE_BACKEND_URL` must be set at frontend **build time**; `ALLOWED_ORIGINS`, `BEE_CLIENT_ID`, `BEE_CLIENT_SECRET` must be set in the ECS task definition at **runtime**

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

# Frontend only — set at build time to point to the backend URL
# Leave empty for local development (Vite proxy handles routing)
VITE_BACKEND_URL=
```

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
- [ ] Editing beeConfig JSON + "Apply changes" updates the editor dynamically
- [ ] "Reset" button restores default configuration

---

## Deployment

### Frontend (S3)

```bash
# Build with backend URL baked in
VITE_BACKEND_URL=https://your-backend-url npm run build

# Deploy to S3 (injects Matomo tracking, then syncs dist/)
S3_BUCKET=your-bucket-name ./scripts/deploy-frontend.sh
```

### Backend (Docker / ECS)

```bash
docker build -f docker/Dockerfile.backend -t playground-backend .
docker run -p 3001:3001 --env-file .env playground-backend
```

For ECS, set `BEE_CLIENT_ID`, `BEE_CLIENT_SECRET`, `ALLOWED_ORIGINS`, and optionally `HTML_IMPORTER_API_KEY` in the task definition (via environment variables or AWS Secrets Manager).

---

## How It Works

### Authentication
1. Frontend calls `/proxy/bee-auth` with a user ID
2. Backend proxies the request to `auth.getbee.io/loginV2` with SDK credentials
3. Token is returned to the frontend and passed to the `<Builder>` component

### Template Loading
1. App loads and auto-selects the initial template
2. User selects a different template from the dropdown
3. Template JSON is fetched from `/templates/{id}.json`
4. `BeefreeEditor` normalizes the JSON and calls `load()` from the `useBuilder` hook

### Export Flow
1. User clicks Export and selects a format
2. Confirmation prompt warns that user edits are not included
3. Pre-generated static file is loaded from `/templates/exports/`
4. Result is displayed in a modal with a download option

### Configuration Updates
1. User edits the beeConfig JSON in the sidebar or uses a toggle
2. Changes are applied dynamically via `updateConfig()` from the `useBuilder` hook
3. The builder updates in place without a full restart

---

## Resources

- [Beefree SDK Documentation](https://docs.beefree.io/beefree-sdk)
- [React Email Builder](https://github.com/BeefreeSDK/react-email-builder)
- [SDK Configuration Reference](https://docs.beefree.io/beefree-sdk/reference/sdk-configuration)
- [Developer Portal](https://developers.beefree.io)
- [Support](https://devportal.beefree.io)

---

## License

See [LICENSE](./LICENSE) file for details.

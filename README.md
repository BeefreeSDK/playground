# 🐝 Beefree SDK Playground

A comprehensive demonstration of Beefree SDK integration featuring Template Catalog, Content Services exports, HTML Import, configuration toggles, and real-time change tracking.

**Ready for team review** ✅ - All documentation updated, security best practices applied, clean code standards enforced.

![Beefree SDK](https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/bs0kfqbg/tqu/rwx/rj4/Logo%20version%3DColored%2C%20Name%3DOn.svg)

---

## ✨ Features

### 🎨 Beefree SDK Editor
- Full-featured email/page builder
- Real-time editing with onChange/onSave callbacks
- Template changes logged to browser console
- Custom CSS injection support
- Sidebar position control
- Module grouping configuration
- Editable beeConfig with live preview

### 📚 Static Template System
- 9 pre-exported professional templates
- Initial template auto-selected on app load
- One-click template loading
- Seamless template switching

### 📤 Static Export System
- **HTML Export** - Pre-generated responsive HTML
- **Plain Text Export** - Pre-generated text-only version
- **PDF Export** - Pre-generated PDF documents
- **Image Export** - Pre-generated PNG thumbnails

> **Note**: All exports are static files generated at build time. User edits in the editor are NOT included in exports. A warning is displayed before each export.

### 📥 HTML Import
- Load sample newsletter template
- Converts HTML → Beefree JSON
- One-click import

### 🎨 Configuration Toggles
- **Apply Custom CSS** - Inject external CSS stylesheet
- **Move Sidebar** - Toggle sidebar position (left/right)
- **Group Content Tiles** - Organize modules into collapsible groups
- All toggles auto-apply changes (no manual "Apply" needed)
- See changes in beeConfig JSON

### ⚙️ BeeConfig Editor
- 500px wide sidebar for comfortable editing
- Tall JSON textarea (fills vertical space)
- Real-time validation
- Reset to defaults

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16
- npm or yarn
- Beefree SDK credentials ([Get them here](https://developers.beefree.io))

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd playground-demo

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your API keys

# Start development servers
npm run dev          # Frontend (Terminal 1)
npm run dev:proxy    # Backend  (Terminal 2)

# Open browser
open http://localhost:5173
```

---

## 📁 Project Structure

```
playground-demo/
├── api/                          # Vercel Serverless Functions
│   ├── proxy/bee-auth.js         # Authentication
│   ├── templates/                # Template Catalog endpoints
│   └── v1/                       # Content Services & HTML Importer
│
├── src/
│   ├── components/
│   │   ├── BeefreeEditor.tsx    # SDK container
│   │   ├── BeeConfigSidebar.tsx # Config editor
│   │   ├── TemplateTopBar.tsx   # Template selector + CSS toggle
│   │   ├── ExportDropdown.tsx   # Export menu
│   │   ├── ExportResultModal.tsx# Export results display
│   │   ├── HtmlImportModal.tsx  # HTML import modal
│   │   └── sampleHtml.ts        # Newsletter template
│   ├── App.tsx                   # Root component
│   └── App.css                   # Global styles
│
├── public/
│   ├── template.json             # Initial template (loaded on app start)
│   └── templates/                # Static template exports
│       ├── index.json            # Template catalog index
│       ├── *.json                # Template metadata + JSON
│       └── exports/              # Pre-generated exports
│           ├── *.html            # HTML versions
│           ├── *.txt             # Plain text versions
│           ├── *.pdf             # PDF versions
│           └── *.png             # Image versions
│
├── scripts/
│   └── export-templates.js       # Template export script
├── proxy-server.js               # Express server (local dev)
├── vercel.json                   # Vercel configuration
└── package.json                  # Dependencies
```

---

## 🛠 Technologies

- **React 18** + **TypeScript** - UI framework
- **Vite** - Build tool and dev server
- **Beefree SDK 9.2.1** - Email/page builder
- **Vercel Serverless Functions** - Backend
- **Axios** - HTTP client

---

## 📊 API Endpoints

### Serverless Functions (8 total)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/proxy/bee-auth` | POST | Authenticate with Beefree |
| `/api/templates` | GET | List templates from catalog |
| `/api/templates/{id}` | GET | Get single template |
| `/v1/html-importer` | POST | Convert HTML to Beefree JSON |
| `/v1/message/html` | POST | Export template to HTML |
| `/v1/message/plain-text` | POST | Export template to plain text |
| `/v1/message/pdf` | POST | Export HTML to PDF |
| `/v1/message/image` | POST | Export HTML to PNG image |

**Vercel Free Tier:** 12 function limit
**Current Usage:** 8 functions ✅

---

## 🎯 How It Works

### Template Loading Flow
```
1. App loads → Initial template auto-selected (beefree-sdk-demo-template)
   ↓
2. User can select different template from dropdown
   ↓
3. Load template JSON from /templates/{id}.json
   ↓
4. Call window.loadTemplate(templateData)
   ↓
5. Beefree SDK loads template into editor
   ↓
6. User can edit (edits NOT saved to exports)
```

### Export Flow (All Formats)
```
1. User clicks Export → [Format]
   ↓
2. Warning alert: "User edits NOT included"
   ↓
3. User confirms
   ↓
4. Load pre-generated static file from /templates/exports/
   ↓
5. Display in modal
   - HTML/Text: Show in textarea
   - PDF: Show "Open PDF" button
   - Image: Show thumbnail
```

### Configuration Toggles Flow
```
1. User toggles any configuration toggle (CSS/Sidebar/Groups)
   ↓
2. Call corresponding window function (toggleCustomCss/toggleMoveSidebar/toggleGroupContentTiles)
   ↓
3. Update beeConfig JSON automatically
   ↓
4. Auto-apply changes (editor restarts)
   ↓
5. Changes visible immediately!
```

**Available Toggles:**
- **Apply Custom CSS** - Adds/removes `customCss` property
- **Move Sidebar** - Toggles `sidebarPosition` between "left" and "right"
- **Group Content Tiles** - Adds/removes `modulesGroups` configuration

---

## 🌐 Deployment (Vercel)

### One-Time Setup

1. **Connect GitHub repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your repository

2. **Add Environment Variables**
   
   Go to: Project Settings → Environment Variables

   ```
   BEE_CLIENT_ID=your_client_id
   BEE_CLIENT_SECRET=your_client_secret
   TEMPLATE_CATALOG_API_TOKEN=your_catalog_token
   CS_API_TOKEN=your_content_services_token
   HTML_IMPORTER_API_KEY=your_importer_key
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait ~2 minutes
   - Your app is live! 🎉

### Continuous Deployment

Every push to `main` branch automatically deploys:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will:
- Build frontend (`npm run build`)
- Deploy static files to CDN
- Deploy serverless functions
- Update live site

### Monitoring

**View Logs:**
- Vercel Dashboard → Deployments → [Latest] → Functions
- Click function name to see logs
- Check for errors, response times

**Common Issues:**
- **404 on API**: Check `vercel.json` rewrites
- **500 errors**: Check function logs for missing env vars
- **Template catalog not loading**: Verify `TEMPLATE_CATALOG_API_TOKEN`

---

## 🧩 Key Concepts

### Window Functions for Component Communication

Instead of complex prop drilling, we use `window` object:

```javascript
// Expose in BeefreeEditor
(window as any).loadTemplate = async (data) => { ... };

// Call from App.tsx
(window as any).loadTemplate(importedData);
```

**Exposed Functions:**
- `window.loadTemplate(data)` - Load template into editor
- `window.restartEditor()` - Restart with new config
- `window.toggleCustomCss(enabled)` - Add/remove customCss property

### Auto-HTML Generation Pattern

PDF and Image exports require HTML (not JSON). We handle this automatically:

```javascript
// Check if HTML already generated
let html = lastHtmlRef.current;

if (!html) {
  // Auto-generate HTML in background
  const response = await fetch('/v1/message/html', { ... });
  html = await response.text();
  lastHtmlRef.current = html; // Cache for future use
}

// Now use HTML for PDF/Image
await fetch('/v1/message/pdf', { body: JSON.stringify({ html, ... }) });
```

**User Experience:**
- Click "PDF" → See "Creating PDF..." → PDF ready!
- No errors, no manual steps

### State Synchronization

When loading templates from different sources, clear conflicting state:

```javascript
// When importing HTML
setSelectedTemplate(null);  // Prevents catalog template from auto-reloading
window.loadTemplate(importedData);
```

---

## 📖 Documentation

All documentation is available in the [`docs/`](./docs/) folder:

- **📚 [Documentation Index](./docs/INDEX.md)** - Start here! Guide to all documentation
- **🚀 [Quick Start](./docs/QUICK-START.md)** - Get up and running in 5 minutes
- **🤝 [Contribution Guide](./docs/CONTRIBUTION-GUIDE.md)** - Detailed architecture and development guide
- **📝 [Coding Standards](./docs/CODING-STANDARDS.md)** - Best practices and clean code guidelines
- **🔒 [Security Guide](./docs/SECURITY.md)** - Security best practices
- **✅ [Deployment Checklist](./docs/DEPLOYMENT-CHECKLIST.md)** - Complete Vercel deployment guide
- **🧪 [Features Verification](./docs/FEATURES-VERIFICATION.md)** - Testing guide for all features

**External Resources:**
- **Beefree SDK Docs**: https://docs.beefree.io/beefree-sdk
- **Template Catalog API**: https://docs.beefree.io/beefree-sdk/apis/template-catalog-api
- **Content Services API**: https://docs.beefree.io/beefree-sdk/apis/content-services-api

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### For New Contributors

1. **Read the documentation:**
   - [`docs/QUICK-START.md`](./docs/QUICK-START.md) - Get up and running
   - [`docs/CONTRIBUTION-GUIDE.md`](./docs/CONTRIBUTION-GUIDE.md) - Understand architecture
   - [`docs/CODING-STANDARDS.md`](./docs/CODING-STANDARDS.md) - Follow best practices
   - [`docs/SECURITY.md`](./docs/SECURITY.md) - Security guidelines

2. **Set up development environment:**
   ```bash
   git clone <repo-url>
   cd playground-demo
   npm install
   cp env.example .env
   # Edit .env with your credentials
   ```

3. **Start developing:**
   ```bash
   npm run dev          # Terminal 1
   npm run dev:proxy    # Terminal 2
   ```

4. **Make your changes:**
   - Follow coding standards
   - Add comments for complex logic
   - Test locally before committing

5. **Submit PR:**
   - Create feature branch
   - Write clear commit messages
   - Test all functionality
   - Update docs if needed

### Code Review Checklist

Before submitting PR:
- [ ] Code follows [`docs/CODING-STANDARDS.md`](./docs/CODING-STANDARDS.md)
- [ ] Security practices from [`docs/SECURITY.md`](./docs/SECURITY.md) followed
- [ ] All features tested locally
- [ ] Documentation updated if needed
- [ ] No console.log in production code
- [ ] No hardcoded secrets or API keys

---

## 📝 Environment Variables

### Required

```bash
# Beefree SDK Authentication
BEE_CLIENT_ID=your_client_id
BEE_CLIENT_SECRET=your_client_secret

# Template Catalog API
TEMPLATE_CATALOG_API_TOKEN=your_catalog_token

# Content Services API (Exports)
CS_API_TOKEN=your_content_services_token

# HTML Importer API
HTML_IMPORTER_API_KEY=your_importer_key
```

### Optional (Have Defaults)

```bash
TEMPLATE_CATALOG_API_URL=https://api.getbee.io/v1/catalog
HTML_IMPORTER_URL=https://api.getbee.io/v1/conversion/html-to-json
PORT=3001
```

---

## 🎨 UI Overview

### Layout

```
┌────────────────────────────────────────────────────┐
│  Header: Logo | Import HTML | Export | Docs        │
├────────────────────────────────────────────────────┤
│  Template Bar: [Dropdown] [CSS Toggle]             │
├──────────────┬─────────────────────────────────────┤
│  beeConfig   │         Beefree Editor              │
│  (500px)     │         (Full Width)                │
│              │                                     │
│  [JSON       │                                     │
│   Editor]    │                                     │
│              │                                     │
│  [Apply]     │                                     │
│  [Info]      │                                     │
└──────────────┴─────────────────────────────────────┘
```

### Colors

- **Purple** (#7747FF) - Primary brand color, buttons, links
- **Mint Green** (#82EDA8) - Custom CSS toggle ON state
- **Dark Purple** (#26045D) - Headings, dark text
- **Light Background** (#FBF9FF) - Page background

---

## 🧪 Testing

### Local Testing Checklist

- [ ] Builder initializes with "Beefree SDK Demo Template" auto-selected
- [ ] Template dropdown shows 9 templates
- [ ] Selecting template loads it in editor
- [ ] Custom CSS toggle works (check JSON updates)
- [ ] Move Sidebar toggle works (sidebar moves left/right)
- [ ] Group Content Tiles toggle works (modules grouped)
- [ ] onChange logs template JSON to console when editing
- [ ] onSave logs template JSON to console when saving
- [ ] Export HTML shows warning, then displays pre-generated HTML
- [ ] Export Plain Text shows warning, then displays pre-generated text
- [ ] Export PDF shows warning, then displays PDF link
- [ ] Export Image shows warning, then displays pre-generated image
- [ ] Import HTML loads sample newsletter
- [ ] Edit beeConfig + Apply changes restarts editor

### Production Testing (After Deploy)

Same checklist on your Vercel URL.

If something doesn't work:
1. Check Vercel function logs
2. Verify environment variables
3. Check browser console for errors

---

## 📞 Support

**Issues?**
1. Check [`docs/CONTRIBUTION-GUIDE.md`](./docs/CONTRIBUTION-GUIDE.md)
2. Review inline code comments
3. Check Beefree SDK docs
4. Open an issue on GitHub

**Beefree Resources:**
- Documentation: https://docs.beefree.io
- Developer Portal: https://developers.beefree.io
- Support: https://devportal.beefree.io

---

## 📄 License

See LICENSE file for details.

---

## 🎉 Features Highlights

✅ **Static Template System** - 9 pre-exported templates with all formats
✅ **Auto-Selected Initial Template** - Ready to use on app load
✅ **Static Export System** - Pre-generated HTML, PDF, PNG, TXT files
✅ **Export Warnings** - Clear alerts that user edits aren't included
✅ **3 Configuration Toggles** - CSS, Sidebar, Module Groups
✅ **onChange/onSave Callbacks** - Template changes logged to console
✅ **500px Config Sidebar** - Comfortable JSON editing
✅ **Modal-Based Exports** - Professional UX
✅ **Sample Newsletter** - One-click HTML import
✅ **Fully Commented Code** - Easy to understand and extend
✅ **Security Best Practices** - Secure API key management
✅ **Clean Code Standards** - TypeScript, async/await, error handling
✅ **No Dark Mode** - Clean light theme only
✅ **No User Tracking** - Privacy-focused
✅ **Vercel Ready** - Deploy in minutes

Built with ❤️ using Beefree SDK

---

**Ready to build something amazing? Start editing!** 🚀

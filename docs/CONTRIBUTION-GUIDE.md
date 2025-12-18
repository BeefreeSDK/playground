# 🤝 Contribution Guide - Beefree SDK Playground

Welcome! This guide will help you understand the project structure, technologies, and how everything works together.

---

## 📁 Project Structure

```
playground-demo/
├── api/                                  # Vercel Serverless Functions (Backend)
│   ├── proxy/
│   │   └── bee-auth.js                   # Beefree SDK authentication
│   └── v1/
│       └── html-importer.js              # Convert HTML to Beefree JSON
│
├── src/                                  # Frontend (React + TypeScript + Vite)
│   ├── components/
│   │   ├── BeefreeEditor.tsx            # Main editor component (SDK initialization)
│   │   ├── BeeConfigSidebar.tsx         # JSON config editor sidebar
│   │   ├── TemplateTopBar.tsx           # Template selector + Custom CSS toggle
│   │   ├── ExportDropdown.tsx           # Export button dropdown menu
│   │   ├── ExportResultModal.tsx        # Modal for showing export results
│   │   ├── HtmlImportModal.tsx          # Modal for importing sample HTML
│   │   ├── sampleHtml.ts                # Newsletter template HTML constant
│   │   └── ExportResultModal.css        # Export modal styles
│   ├── services/
│   │   ├── api.ts                        # API client utilities
│   │   └── localTemplates.ts            # Local template loading
│   ├── types/
│   │   └── index.ts                      # TypeScript type definitions
│   ├── utils/
│   │   └── exportHelpers.ts             # Export helper functions
│   ├── App.tsx                           # Root component (orchestrates everything)
│   ├── App.css                           # Global styles
│   ├── main.tsx                          # React entry point
│   └── index.css                         # Base CSS reset
│
├── public/
│   ├── assets/
│   │   └── css/
│   │       └── beefree-custom-design.css # Custom CSS for SDK
│   ├── templates/                        # Static template files
│   │   ├── index.json                    # Template catalog
│   │   ├── *.json                        # Template JSON files
│   │   └── exports/                      # Pre-generated exports
│   │       ├── *.html                    # HTML exports
│   │       ├── *.txt                     # Plain text exports
│   │       ├── *.pdf                     # PDF exports
│   │       └── *.png                     # Image exports
│   └── template.json                     # Default template loaded on init
│
├── proxy-server.js                       # Express server for local development
├── vercel.json                           # Vercel configuration and routing
├── package.json                          # Dependencies and scripts
├── vite.config.ts                        # Vite configuration (dev server, proxy)
└── tsconfig.json                         # TypeScript configuration
```

---

## 🛠 Technologies Used

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **@beefree.io/sdk** - Beefree SDK for email/page building
- **Axios** - HTTP client

### Backend
- **Vercel Serverless Functions** - Production backend
- **Express** - Local development server
- **Axios** - External API calls

### Deployment
- **Vercel** - Hosting platform for both frontend and serverless functions
- **GitHub** - Version control and CI/CD trigger

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js >= 16
npm or yarn
Git
```

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd playground-demo
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp env.example .env
```

Edit `.env` and add your API keys:
```
# REQUIRED (for Beefree SDK)
BEE_CLIENT_ID=your_client_id
BEE_CLIENT_SECRET=your_client_secret

# OPTIONAL (only for HTML Import feature)
HTML_IMPORTER_API_KEY=your_importer_key
```

**📝 Note:** This app uses **local static templates** from `public/templates/` and **pre-generated exports** from `public/templates/exports/`, so it does NOT need:
- ~~TEMPLATE_CATALOG_API_TOKEN~~ (not used)
- ~~CS_API_TOKEN~~ (not used)

4. **Start development servers**

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend Proxy:
```bash
npm run dev:proxy
```

5. **Open browser**
```
http://localhost:5173
```

---

## 📐 Layout & Container Sizes

### UI Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  Header (100% width, fixed height ~64px)                │
├─────────────────────────────────────────────────────────┤
│  Template Top Bar (100% width, fixed height ~56px)      │
│  [Template Dropdown] [Custom CSS Toggle]                │
├─────────────┬───────────────────────────────────────────┤
│  Config     │        Editor (Full Width)                 │
│  Sidebar    │                                            │
│  500px      │   Beefree SDK                              │
│  wide       │   (fills remaining space)                  │
│             │                                            │
│  [JSON]     │                                            │
│  (fills     │                                            │
│  vertical   │                                            │
│  space)     │                                            │
│             │                                            │
│  [Apply]    │                                            │
│  [Info]     │                                            │
└─────────────┴───────────────────────────────────────────┘
```

### Container Specifications

| Element | Width | Height | Behavior |
|---------|-------|--------|----------|
| **Header** | 100% | ~64px | Fixed, contains logo, Export, Import HTML, Docs |
| **Template Bar** | 100% | ~56px | Fixed, contains template dropdown & CSS toggle |
| **Config Sidebar** | 500px | calc(100vh - 125px) | Fixed width, scrollable content |
| **Editor** | flex: 1 | calc(100vh - 125px) | Fills remaining width |
| **JSON Textarea** | 100% of sidebar | flex: 1 | Fills vertical space in sidebar |
| **Modals** | max-width: 800px | max-height: 90vh | Centered overlay |

### CSS Variables

```css
:root {
  --beefree-purple: #7747FF;         /* Primary brand color */
  --beefree-purple-dark: #5A2FD9;    /* Hover states */
  --beefree-green: #82EDA8;          /* Toggle ON state */
  --beefree-dark: #26045D;           /* Dark text */
  --bg-primary: #FFFFFF;             /* Main background */
  --bg-secondary: #F8F9FB;           /* Secondary background */
  --border-color: #E1E4E8;           /* Borders */
  --text-primary: #1F2937;           /* Main text */
  --text-secondary: #6B7280;         /* Secondary text */
}
```

---

## 🔄 How Everything Works

### 1. **Beefree SDK Initialization** (`src/components/BeefreeEditor.tsx`)

**Flow:**
1. Component mounts → `useEffect` triggers
2. Call `/api/proxy/bee-auth` to get authentication token
3. Create `BeefreeSDK` instance with token
4. Load initial template from `/public/template.json`
5. Configure callbacks:
   - `onChange`: Tracks template changes
   - `onSave`: Handles save events
   - `onError`: Handles SDK errors
6. Call `sdk.start(config, template)` to initialize
7. Update parent with initial template (enables exports immediately)

**Key Files:**
- `src/components/BeefreeEditor.tsx` (lines 123-324)
- `api/proxy/bee-auth.js` (authentication endpoint)

**Key Refs:**
- `sdkRef.current` - Beefree SDK instance (used for `.load()`, `.save()`, etc.)
- `currentTemplateRef.current` - Always has the latest template being edited

**Window Functions Exposed:**
- `window.loadTemplate(templateData)` - Load new template
- `window.restartEditor()` - Restart with new config

---

### 2. **Local Template System** (`src/services/localTemplates.ts`, `src/components/TemplateTopBar.tsx`)

**⚠️ IMPORTANT:** This app uses **local static templates**, NOT the Template Catalog API!

**Flow:**
1. Component mounts → Calls `getTemplates()` from `localTemplates.ts`
2. Fetches `/templates/index.json` (static file)
3. Displays templates in dropdown
4. User selects template → Calls `getTemplateById(id)`
5. Fetches `/templates/{id}.json` (static file)
6. Calls `onTemplateSelect` → Triggers `window.loadTemplate()` in BeefreeEditor
7. Template loads into editor

**Template Files Location:**
- `public/templates/index.json` - List of available templates
- `public/templates/*.json` - Individual template JSON files

**Export Files Location:**
- `public/templates/exports/*.html` - Pre-generated HTML exports
- `public/templates/exports/*.txt` - Pre-generated plain text exports
- `public/templates/exports/*.pdf` - Pre-generated PDF exports
- `public/templates/exports/*.png` - Pre-generated image exports

**⚠️ CRITICAL:** Exports show the ORIGINAL template, NOT user edits!

---

### 3. **Configuration Toggles** (`src/components/TemplateTopBar.tsx` + `src/components/BeeConfigSidebar.tsx`)

**Component Communication Pattern:**
Uses `window` object for cross-component communication (avoids complex prop drilling)

**Available Toggles:**
1. **Apply Custom CSS** - Adds/removes `customCss` property
2. **Move Sidebar** - Toggles `sidebarPosition` between "left" and "right"
3. **Group Content Tiles** - Adds/removes `modulesGroups` configuration

**Flow (All Toggles Follow Same Pattern):**
1. User toggles any configuration toggle in `TemplateTopBar`
2. Handler calls corresponding window function (e.g., `window.toggleCustomCss(true/false)`)
3. `BeeConfigSidebar` exposes window functions via `useEffect`
4. Function updates beeConfig JSON automatically
5. Auto-calls `onConfigChange(newConfig)` (no manual "Apply changes" needed)
6. Editor restarts with new config
7. Changes visible immediately

**Key Files:**
- `src/components/TemplateTopBar.tsx` - Toggle UI and handlers (lines 123-177)
- `src/components/BeeConfigSidebar.tsx` - Window functions (lines 38-176)
- `src/App.tsx` - Toggle handlers (lines 85-109)
- `src/App.css` - Toggle switch styling

**Window Functions Exposed:**
- `window.toggleCustomCss(enabled)` - Custom CSS toggle
- `window.toggleMoveSidebar(enabled)` - Sidebar position toggle
- `window.toggleGroupContentTiles(enabled)` - Module groups toggle

**CSS Variables for Toggle:**
- OFF: `background-color: #374151` (dark grey)
- ON: `background-color: #82EDA8` (mint green)

---

### 4. **BeeConfig Editor** (`src/components/BeeConfigSidebar.tsx`)

**Flow:**
1. `currentConfig` prop updates → JSON stringified and shown in textarea
2. User edits JSON
3. User clicks "Apply changes" → JSON parsed → Sent to parent via `onConfigChange`
4. Parent calls `window.restartEditor()` → Editor re-initializes with new config

**Auto-Apply Features:**
- Custom CSS toggle automatically applies changes
- No need to click "Apply changes" when toggling Custom CSS

**Reset Functionality:**
Clicking "Reset" loads default config with:
- `container`, `language`, `sidebarPosition`
- `rowDisplayConditions` (example conditional content)
- `rowsConfiguration` (external content URLs, default rows)
- `mergeTags` (example merge tags)

**Key Files:**
- `src/components/BeeConfigSidebar.tsx` (full file)
- `src/App.css` (lines 576-747) - Sidebar and textarea styling

---

### 5. **Export Functionality** (All 4 Types)

**⚠️ IMPORTANT:** This app uses **pre-generated static exports**, NOT Content Services API!

All exports load pre-generated files from `public/templates/exports/` directory.

**⚠️ CRITICAL WARNING:** Exports display the ORIGINAL template as it was loaded from the template catalog. They do NOT include any user edits made in the editor!

#### **A. HTML Export**

**Flow:**
1. User clicks "Export" → "HTML"
2. Gets current template ID from state
3. Fetches `/templates/exports/{template-id}.html` (static file)
4. Display in modal with download button

**File Location:** `public/templates/exports/*.html`

---

#### **B. Plain Text Export**

**Flow:**
1. User clicks "Export" → "Plain Text"
2. Gets current template ID from state
3. Fetches `/templates/exports/{template-id}.txt` (static file)
4. Display in modal with download button

**File Location:** `public/templates/exports/*.txt`

---

#### **C. PDF Export**

**Flow:**
1. User clicks "Export" → "PDF"
2. Gets current template ID from state
3. Opens `/templates/exports/{template-id}.pdf` in new tab (static file)

**File Location:** `public/templates/exports/*.pdf`

---

#### **D. Image Export**

**Flow:**
1. User clicks "Export" → "Thumbnail Image"
2. Gets current template ID from state
3. Fetches `/templates/exports/{template-id}.png` (static file)
4. Display image in modal with download button

**File Location:** `public/templates/exports/*.png`

---

### **Generating Exports**

Pre-generated exports are created using the `npm run export-templates` script, which:
1. Reads all templates from `public/templates/*.json`
2. Calls Beefree Content Services API to generate exports
3. Saves exports to `public/templates/exports/`
4. Updates `public/templates/index.json` with export file paths

**Script Location:** `scripts/export-templates.js`

**Run Command:**
```bash
npm run export-templates
```

**Requirements:**
- `BEE_CLIENT_ID` and `BEE_CLIENT_SECRET` in `.env`
- (Optional) `CS_API_TOKEN` for Content Services API

---

### 6. **Export Result Modal** (`src/components/ExportResultModal.tsx`)

**Purpose:** Unified modal for displaying all export results

**Props:**
- `isOpen` - Modal visibility
- `type` - Export type (html, plain-text, pdf, image)
- `content` - Text content (for HTML/Plain Text)
- `imageUrl` - Blob URL (for Image)
- `pdfUrl` - Download URL (for PDF)
- `loading` - Show loading state

**Behavior by Type:**

| Type | Display | Actions |
|------|---------|---------|
| **HTML** | Textarea with code | Download HTML button |
| **Plain Text** | Textarea with text | Download Text button |
| **PDF** | Success message + link | Open PDF in New Tab |
| **Image** | Image preview | Download Image button |

**Loading States:**
- "Exporting HTML..."
- "Exporting Plain Text..."
- "Creating PDF..."
- "Creating Thumbnail..."

**Key Files:**
- `src/components/ExportResultModal.tsx`
- `src/components/ExportResultModal.css`

---

### 7. **HTML Import** (`src/components/HtmlImportModal.tsx`)

**Flow:**
1. User clicks "Import HTML" button
2. Modal opens with sample newsletter preview (greyed out, read-only)
3. User clicks "Load Sample HTML"
4. Send `SAMPLE_NEWSLETTER_HTML` to `/v1/html-importer`
5. API converts HTML → Beefree JSON
6. Clear `selectedTemplate` state (prevents template catalog from reloading)
7. Call `window.loadTemplate(importedData)`
8. Template loads in editor
9. Modal closes

**Sample HTML:**
- Located in `src/components/sampleHtml.ts`
- Full newsletter template with all sections
- **No images** (to avoid conversion issues)
- Uses emoji icons instead (📰 📺 📋 🐝)

**Backend:**
- `api/v1/html-importer.js`
- Sanitizes HTML (removes scripts, iframes, etc.)
- Forwards to `https://api.getbee.io/v1/conversion/html-to-json`
- Content-Type: `text/html` (not JSON!)

**State Management:**
```javascript
setSelectedTemplate(null); // Prevents catalog template from auto-reloading
setCurrentJson(importedData); // Updates App state
window.loadTemplate(importedData); // Loads into editor
```

---

## 🔌 API Integration

### Local Development
- Frontend: `http://localhost:5173` (Vite)
- Backend: `http://localhost:3001` (Express)
- Vite proxies API calls:
  - `/proxy/*` → `http://localhost:3001`
  - `/v1/*` → `http://localhost:3001`

### Production (Vercel)
- Frontend: Static files served by Vercel
- Backend: Serverless functions in `/api` directory
- `vercel.json` routes requests:
  - `/v1/*` → `/api/v1/*`
  - `/proxy/*` → `/api/proxy/*`

### Serverless Functions (2 Total)

**⚠️ IMPORTANT:** This app only has 2 API endpoints! Templates and exports are static files.

**1. Authentication** (`api/proxy/bee-auth.js`)
```javascript
POST /proxy/bee-auth
Body: { uid: 'demo-user' }
Returns: { token, ... }
Forwards to: https://auth.getbee.io/loginV2
```

**Purpose:** Authenticate with Beefree SDK and get token for SDK initialization.

**2. HTML Importer** (`api/v1/html-importer.js`)
```javascript
POST /v1/html-importer
Body: { html: '<html>...</html>' }
Returns: Beefree JSON template
Forwards to: https://api.getbee.io/v1/conversion/html-to-json
Content-Type: text/html
```

**Purpose:** Convert HTML to Beefree JSON format for loading into editor.

### Static File Serving

**Templates:**
- `GET /templates/index.json` - List of available templates
- `GET /templates/{id}.json` - Individual template JSON

**Exports:**
- `GET /templates/exports/{id}.html` - HTML export
- `GET /templates/exports/{id}.txt` - Plain text export
- `GET /templates/exports/{id}.pdf` - PDF export
- `GET /templates/exports/{id}.png` - Image export

### Authorization Headers

Beefree API calls use Bearer token authentication:
```javascript
headers: {
  'Authorization': `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json' // or 'text/html' for HTML importer
}
```

---

## 🎨 Component Details

### App.tsx (Root Orchestrator)

**Responsibilities:**
- State management for templates, exports, imports
- Coordinates between all child components
- Handles export logic with auto-HTML generation
- Manages modal states

**State Flow:**
```
selectedTemplate → BeefreeEditor → currentJson → Export Functions
      ↓                                               ↓
TemplateTopBar                              ExportResultModal
```

**Window Functions Used:**
- `window.loadTemplate(data)` - Load template into editor
- `window.restartEditor()` - Restart editor with new config
- `window.toggleCustomCss(enabled)` - Add/remove customCss from config
- `window.toggleMoveSidebar(enabled)` - Toggle sidebar position
- `window.toggleGroupContentTiles(enabled)` - Toggle module groups

---

### BeefreeEditor.tsx (SDK Container)

**Responsibilities:**
- SDK initialization and authentication
- Loading templates into editor
- Tracking current template state
- Config changes and restarts

**Key Lifecycle:**
1. Mount → Initialize SDK
2. `selectedTemplate` changes → Load new template
3. `configChangeCounter` changes → Re-initialize SDK
4. User edits → `onChange` fires → Logs JSON to console → Update refs and parent
5. User saves → `onSave` fires → Logs JSON to console → Update refs and parent

**Callbacks Enabled:**
- `onChange` - Fires on every template change, logs JSON to browser console
- `onSave` - Fires when user saves, logs JSON to browser console
- `trackChanges: true` - Required for onChange callback to work

**Important Pattern:**
```javascript
// Always keep currentTemplateRef updated
onChange: (json) => {
  currentTemplateRef.current = json;  // Update ref
  onTemplateLoad(json);                // Notify parent
}
```

---

### TemplateTopBar.tsx (Template Selection + CSS Toggle)

**Responsibilities:**
- Fetch and display templates from catalog
- Handle template selection
- Custom CSS toggle
- Show success messages

**Custom CSS Toggle Logic:**
```javascript
// Toggle ON
currentConfig.customCss = "/assets/css/beefree-custom-design.css";

// Toggle OFF
delete currentConfig.customCss;

// Auto-apply
onConfigChange(currentConfig);
```

**Success Message:**
- Shows for 5 seconds
- Green background (#D1FAE5)
- Positioned below toggle

---

### BeeConfigSidebar.tsx (Configuration Editor)

**Responsibilities:**
- Display current beeConfig as editable JSON
- Validate JSON on apply
- Reset to default config
- Expose `window.toggleCustomCss` function

**Layout Structure:**
```
┌──────────────────┐
│ beeConfig [Reset]│ ← Header
├──────────────────┤
│                  │
│   JSON Textarea  │ ← Fills vertical space (flex: 1)
│   (editable)     │
│                  │
├──────────────────┤
│ [Apply changes]  │ ← Button at bottom
├──────────────────┤
│ Info section     │ ← Help text
└──────────────────┘
```

**Window Function:**
```javascript
window.toggleCustomCss = (enabled: boolean) => {
  // Parse current JSON
  // Add or remove customCss property
  // Update textarea
  // Auto-apply changes
};
```

---

### ExportDropdown.tsx (Export Menu)

**Responsibilities:**
- Show dropdown menu with 4 export options
- Handle loading states
- Close on outside click

**Menu Items:**
1. HTML
2. Plain Text
3. Thumbnail Image
4. PDF
5. Documentation link (opens in new tab)

**Behavior:**
- Dropdown closes after selecting an option
- Disabled while any export is loading
- Animated arrow rotation when open

---

### HtmlImportModal.tsx (Sample Newsletter Import)

**Responsibilities:**
- Display sample newsletter HTML (read-only preview)
- Load sample HTML into editor on button click
- Handle errors

**Sample HTML:**
- Imported from `src/components/sampleHtml.ts`
- Full newsletter with multiple sections
- No images (uses emoji icons)
- Maintains all Beefree styling (#7747ff purple, #26045d dark, etc.)

**Flow:**
```
User clicks "Import HTML" 
  → Modal opens
  → Shows newsletter preview (greyed out)
  → User clicks "Load Sample HTML"
  → Loading state ("Importing...")
  → API call to /v1/html-importer
  → Template loads in editor
  → Modal closes
```

---

### ExportResultModal.tsx (Export Display)

**Responsibilities:**
- Display export results for all 4 types
- Show loading states during export
- Provide download/open actions

**Content Display by Type:**
```javascript
// HTML & Plain Text
<textarea value={content} readOnly />

// Image
<img src={imageUrl} />

// PDF
<a href={pdfUrl} target="_blank">Open PDF in New Tab</a>
```

**Loading States:**
- Large spinner animation
- Type-specific messages
- Prevents closing while loading

---

## 🌐 Vercel Deployment

### File Structure Requirements

Vercel automatically detects:
- Frontend: Vite project (builds to `/dist`)
- Backend: Any `.js` files in `/api` directory become serverless functions

### vercel.json Configuration

```json
{
  "rewrites": [
    { "source": "/v1/message/:path*", "destination": "/api/v1/message/:path*" },
    { "source": "/v1/:path*", "destination": "/api/v1/:path*" },
    { "source": "/proxy/:path*", "destination": "/api/proxy/:path*" }
  ],
  "functions": {
    "api/**/*.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

**Why Rewrites?**
- Frontend calls `/v1/message/html`
- Vercel routes to `/api/v1/message/html.js`
- Keeps frontend code clean (no `/api` prefix in fetch calls)

### Environment Variables

**Required in Vercel Dashboard:**

Go to: Project Settings → Environment Variables

```
# REQUIRED (for Beefree SDK)
BEE_CLIENT_ID=your_client_id
BEE_CLIENT_SECRET=your_client_secret

# OPTIONAL (only for HTML Import feature)
HTML_IMPORTER_API_KEY=your_importer_key
```

**Optional (have defaults):**
```
HTML_IMPORTER_URL=https://api.getbee.io/v1/conversion/html-to-json
```

**📝 Note:** This app uses **local static templates** and **pre-generated exports**, so it does NOT need:
- ~~TEMPLATE_CATALOG_API_TOKEN~~ (not used)
- ~~CS_API_TOKEN~~ (not used)

**IMPORTANT:** After adding/changing environment variables, click "Redeploy"!

### Deployment Process

1. **Push to GitHub:**
```bash
git add .
git commit -m "Your changes"
git push origin main
```

2. **Vercel Auto-Deploys:**
- Detects new commit
- Runs `npm install`
- Runs `npm run build`
- Deploys frontend static files
- Deploys serverless functions from `/api`
- Takes ~2 minutes

3. **Monitor Deployment:**
- Vercel Dashboard → Deployments → [Latest]
- Check build logs
- Check function logs (if APIs fail)

### Function Limits

**Vercel Free Tier:** Max 12 serverless functions
**Current Usage:** 2 functions ✅

Plenty of room for expansion if needed!

### Debugging Vercel Deployments

**View Function Logs:**
1. Vercel Dashboard → Deployments → [Your Deployment]
2. Click "Functions" tab
3. Click specific function to see logs
4. Look for:
   - `"Token not configured"` = Missing env var
   - `401 Unauthorized` = Wrong API token
   - `404 Not Found` = Routing issue
   - `500 Error` = Check detailed error in logs

**Common Issues:**
- **"No template loaded"**: Missing initial template in `/public/template.json`
- **"Templates not loading"**: Check that `public/templates/index.json` and template files deployed correctly
- **"Exports not working"**: Check that `public/templates/exports/` directory deployed correctly
- **"Failed to import HTML"**: Check `HTML_IMPORTER_API_KEY`

---

## 🧩 Key Concepts & Patterns

### 1. **Window Functions for Cross-Component Communication**

Instead of complex prop drilling, we use `window` object:

```javascript
// In BeefreeEditor.tsx
useEffect(() => {
  (window as any).loadTemplate = async (data) => { ... };
}, []);

// In App.tsx
const handleHtmlImport = async (html) => {
  const imported = await convertHtml(html);
  (window as any).loadTemplate(imported);  // ✅ Direct call
};
```

**Why?**
- Cleaner than passing callbacks through 3+ levels
- Decouples components
- Easy to extend

### 2. **Auto-HTML Generation for PDF/Image**

**Problem:** Users had to manually export HTML before exporting PDF/Image (confusing!)

**Solution:** Auto-generate HTML in background

```javascript
// Check if HTML exists
let html = lastHtmlRef.current;
if (!html) {
  // Auto-generate HTML first
  const htmlResponse = await fetch('/v1/message/html', { ... });
  html = await htmlResponse.text();
  lastHtmlRef.current = html;
}

// Now use HTML for PDF/Image
const response = await fetch('/v1/message/pdf', { 
  body: JSON.stringify({ html, ... })
});
```

**User Experience:**
- Click "PDF" → Modal shows "Creating PDF..." → PDF ready!
- No errors, no extra steps

### 3. **State Synchronization Pattern**

**Challenge:** Multiple sources can load templates (catalog, HTML import, initial load)

**Solution:** Clear conflicting state when loading from new source

```javascript
// When importing HTML
setSelectedTemplate(null);  // Clear catalog selection
setCurrentJson(importedData);  // Set new template
window.loadTemplate(importedData);  // Load into editor
```

**Why?**
- Prevents catalog template from auto-reloading
- Ensures imported template stays loaded

### 4. **Ref vs State for Current Template**

**Use `currentTemplateRef`** for:
- Export operations
- Brand styles (removed but pattern still valid)
- Any operation needing the latest editor state

**Use `currentJson` state** for:
- Checking if template exists before export
- Passing to child components
- React rendering

**Why Both?**
- Ref always has latest value (updated on every change)
- State may be stale during rapid edits
- Exports use ref to ensure they get current content

---

## 🎨 Styling Guidelines

### Color Palette

```css
/* Primary Brand Colors */
--beefree-purple: #7747FF         /* Buttons, links, accents */
--beefree-purple-dark: #5A2FD9    /* Hover states */
--beefree-green: #82EDA8          /* Toggle ON, success */
--beefree-dark: #26045D           /* Dark text, headings */

/* Backgrounds */
--bg-primary: #FFFFFF             /* Main background */
--bg-secondary: #F8F9FB           /* Sidebar, cards */
--bg-tertiary: #F0F2F5            /* Disabled states */

/* Borders */
--border-color: #E1E4E8           /* Default borders */

/* Text */
--text-primary: #1F2937           /* Main text */
--text-secondary: #6B7280         /* Labels, secondary text */
```

### Component Styling Conventions

1. **Use CSS Variables** for colors, never hardcode
2. **Flexbox for layouts** (avoid floats)
3. **Smooth transitions** (0.2s ease for hover states)
4. **Box shadows** for depth (sm, md, lg, xl defined)
5. **Border radius** 6-8px for cards, 4px for buttons
6. **Font family** 'Inter' for UI, 'SF Mono' for code

### Responsive Design

Mobile breakpoints in `App.css`:
- 1800px+ - Larger sidebars
- 1600px - Default
- 1400px - Smaller sidebars
- 1200px - Compact
- 900px - Hide sidebars, single column
- 600px - Mobile optimizations

---

## 🧪 Testing

### Local Testing

```bash
# Start dev servers
npm run dev          # Terminal 1
npm run dev:proxy    # Terminal 2
```

**Test Checklist:**
- [ ] Builder loads with initial template
- [ ] Template dropdown shows templates
- [ ] Select template → Loads in editor
- [ ] Custom CSS toggle works
- [ ] Export HTML → Modal shows HTML
- [ ] Export PDF → Auto-generates HTML, shows PDF link
- [ ] Export Image → Auto-generates HTML, shows thumbnail
- [ ] Export Plain Text → Modal shows text
- [ ] Import HTML → Sample loads correctly
- [ ] Edit beeConfig → Apply changes → Editor restarts

### Production Testing (Vercel)

After deployment, test the same checklist on your Vercel URL.

**Common Issues:**
1. **APIs not working** → Check environment variables in Vercel
2. **404 on API calls** → Check `vercel.json` rewrites
3. **Builder loads but templates don't** → Check `public/templates/` files deployed correctly

---

## 📝 Making Changes

### Adding New Templates

1. **Add template JSON file:**
```bash
# Add your template JSON to public/templates/
public/templates/my-new-template.json
```

2. **Generate exports:**
```bash
npm run export-templates
```
This will automatically:
- Generate HTML, PDF, Image, and Text exports
- Update `public/templates/index.json`

3. **Commit and deploy:**
```bash
git add public/templates/
git commit -m "Add new template"
git push origin main
```

### Regenerating All Exports

If template files change:
```bash
npm run export-templates
```

This script:
- Reads all templates from `public/templates/*.json`
- Calls Beefree Content Services API
- Saves exports to `public/templates/exports/`
- Updates template index

**Requirements:**
- `BEE_CLIENT_ID` and `BEE_CLIENT_SECRET` in `.env`
- (Optional) `CS_API_TOKEN` for Content Services API

### Modifying the Sample Newsletter

Edit `src/components/sampleHtml.ts`:
```javascript
export const SAMPLE_NEWSLETTER_HTML = `<!DOCTYPE html>...`;
```

**Guidelines:**
- Keep existing color scheme (#7747ff, #26045d, #fbf9ff)
- Avoid images (use emoji or text icons)
- Maintain responsive table structure
- Test with HTML Importer API before committing

### Adding a New API Endpoint

If you need to add a new backend endpoint:

1. **Create serverless function:**
```javascript
// api/your-endpoint.js
export default async function handler(req, res) {
  // Your logic here
  res.json({ success: true });
}
```

2. **Update vercel.json if needed:**
```json
{
  "source": "/your-path",
  "destination": "/api/your-endpoint"
}
```

3. **Add frontend handler in appropriate component**

---

## 🐛 Debugging Tips

### Frontend Debugging

**Console Logs:**
All major operations log to console:
- `🚀 Initializing Beefree SDK...`
- `✅ Authentication successful`
- `📄 Loaded initial template`
- `onChange fired - updated currentTemplateRef`

**React DevTools:**
- Check `App` component state (currentJson, beeConfig, etc.)
- Verify refs are updating

### Backend Debugging (Vercel)

**Function Logs:**
All serverless functions log errors:
```javascript
console.error('Export error:', error.response?.data || error.message);
```

**View in Vercel:**
1. Dashboard → Functions → Click function name
2. See request logs, errors, responses

### Common Errors

**"No template loaded"**
- `currentJson` is null
- Initial template didn't load from `/public/template.json`
- Fix: Check template.json exists and is valid

**"Failed to authenticate"**
- Missing BEE_CLIENT_ID or BEE_CLIENT_SECRET
- Invalid credentials
- Fix: Check .env file or Vercel env vars

**"Templates not loading"**
- Missing `public/templates/index.json`
- Template JSON files not deployed
- Fix: Check that template files exist and are committed

**"Exports not working"**
- Missing export files in `public/templates/exports/`
- Export files not deployed
- Fix: Run `npm run export-templates` and commit the exports

---

## 🔐 Security Notes

**⚠️ IMPORTANT:** See `SECURITY.md` for comprehensive security guidelines.

### Quick Security Checklist

- ✅ All API keys stored in environment variables
- ✅ `.env` file in `.gitignore` (never commit!)
- ✅ `env.example` uses placeholders only
- ✅ HTML input sanitized before processing
- ✅ Error messages don't expose internal details
- ✅ No secrets in console.log statements

### API Key Storage

**Local (.env file):**
```
BEE_CLIENT_ID=your_actual_key_here
BEE_CLIENT_SECRET=your_actual_secret_here
```

**Production (Vercel):**
- Stored in Vercel dashboard (encrypted)
- Never in git
- Never in frontend code

### HTML Sanitization

HTML Importer sanitizes input to prevent XSS:
```javascript
// Removes:
- <script> tags
- <iframe> tags
- javascript: URLs
- Event handlers (onclick, onload, etc.)
```

### CORS

- Serverless functions automatically handle CORS for your domain
- No additional configuration needed

---

## 📚 Resources

### Project Documentation
- **Quick Start**: [`QUICK-START.md`](./QUICK-START.md) - Get up and running in 5 minutes
- **Coding Standards**: [`CODING-STANDARDS.md`](./CODING-STANDARDS.md) - Best practices and clean code
- **Security Guide**: [`SECURITY.md`](./SECURITY.md) - Security best practices
- **Deployment**: [`DEPLOYMENT-CHECKLIST.md`](./DEPLOYMENT-CHECKLIST.md) - Vercel deployment guide

### Beefree Documentation
- **SDK Docs**: https://docs.beefree.io/beefree-sdk
- **HTML Importer**: https://docs.beefree.io/beefree-sdk/apis/html-importer-api
- **Content Services API**: https://docs.beefree.io/beefree-sdk/apis/content-services-api (used by export-templates script)
- **Template Catalog API**: https://docs.beefree.io/beefree-sdk/apis/template-catalog-api (not used in this app)

### Vercel Documentation
- **Serverless Functions**: https://vercel.com/docs/functions
- **Environment Variables**: https://vercel.com/docs/environment-variables
- **Rewrites**: https://vercel.com/docs/edge-network/rewrites

### Technologies
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org
- **Vite**: https://vitejs.dev
- **Axios**: https://axios-http.com

---

## 🚨 Important Notes

### Function Count Limit

Vercel free tier limits to **12 serverless functions**.

**Current usage: 8/12** ✅

To stay under limit:
- Consolidate related endpoints
- Use dynamic routing (`[id].js`, `[type].js`)
- Remove unused endpoints

### Best Practices

1. **Always validate currentJson before exports**
   ```javascript
   if (!currentJson) {
     alert('No template loaded');
     return;
   }
   ```

2. **Handle both JSON and text responses**
   ```javascript
   const raw = await response.text();
   let html = raw;
   try {
     const maybeJson = JSON.parse(raw);
     html = maybeJson.body?.html || html;
   } catch {}
   ```

3. **Clear conflicting state**
   ```javascript
   setSelectedTemplate(null); // When importing HTML
   ```

4. **Update refs immediately**
   ```javascript
   currentTemplateRef.current = newTemplate;
   ```

5. **Use window functions for cross-component calls**
   ```javascript
   if ((window as any).loadTemplate) {
     await (window as any).loadTemplate(data);
   }
   ```

### Code Style

**See `CODING-STANDARDS.md` for comprehensive guidelines.**

Quick reference:
- **Use async/await** (not .then())
- **Add comments** for complex logic (explain "why", not "what")
- **Keep functions small** (single responsibility)
- **Use TypeScript types** for props and state (avoid `any`)
- **Descriptive variable names** (not abbreviations)
- **Use CSS variables** (no hardcoded colors)
- **Handle errors consistently** (try-catch with user-friendly messages)

---

## 🤝 Contributing

### Pull Request Process

1. **Create a branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
- Add inline comments for complex logic
- Update this guide if you change architecture
- Test locally before committing

3. **Build and test**
```bash
npm run build
npm run dev
# Test all functionality
```

4. **Commit**
```bash
git add .
git commit -m "feat: description of your changes"
```

5. **Push and create PR**
```bash
git push origin feature/your-feature-name
```

### Commit Message Guidelines

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` CSS/UI changes
- `refactor:` Code refactoring
- `test:` Adding tests

### Code Review Checklist

- [ ] Code follows `CODING-STANDARDS.md`
- [ ] Security practices from `SECURITY.md` followed
- [ ] Code has inline comments (explain "why")
- [ ] No console.log in production code (console.error OK for errors)
- [ ] Build succeeds (`npm run build`)
- [ ] All features tested locally
- [ ] No hardcoded API keys or secrets
- [ ] TypeScript types defined (no `any` unless necessary)
- [ ] CSS uses variables (no hardcoded colors)
- [ ] Error handling is consistent
- [ ] Responsive design maintained
- [ ] Documentation updated if needed

---

## 🎯 Quick Reference

### Start Development
```bash
npm run dev          # Frontend (port 5173)
npm run dev:proxy    # Backend (port 3001)
```

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
git push origin main  # Auto-deploys
```

### View Logs (Vercel)
```
Dashboard → Deployments → [Latest] → Functions → [Function Name]
```

### Update Environment Variables
```
Vercel Dashboard → Settings → Environment Variables → Add/Edit → Redeploy
```

---

## 📞 Need Help?

**Check:**
1. This contribution guide
2. Inline code comments
3. Beefree SDK docs: https://docs.beefree.io
4. Vercel function logs (for API issues)
5. Browser console (for frontend issues)

**Common Questions:**

**Q: Why are we using window functions?**
A: To avoid prop drilling through multiple component levels. It's simpler for cross-component communication.

**Q: Why do PDF and Image exports need HTML?**
A: Beefree's Content Services API requires HTML for PDF/Image generation, not JSON.

**Q: How do I add a new Beefree API endpoint?**
A: Create a file in `/api` directory, add to `vercel.json` rewrites if needed, create frontend handler in App.tsx.

**Q: Why are there two servers (Express and Vercel functions)?**
A: Express for local dev, Vercel functions for production. Same logic, different execution environments.

**Q: Can I use the Pro tier features?**
A: Yes! Just update to Vercel Pro and you get more functions (100+), longer timeouts (60s), and more memory.

---

## ✨ Summary

This playground demonstrates:
- ✅ Beefree SDK integration
- ✅ Local template system (static files)
- ✅ Pre-generated exports (HTML, PDF, Image, Text)
- ✅ HTML Importer API
- ✅ Custom CSS injection
- ✅ Editable beeConfig
- ✅ Vercel serverless deployment

All built with clean code, inline comments, and maintainable patterns!

**Key Architecture:**
- Templates served as static JSON files from `public/templates/`
- Exports pre-generated and served from `public/templates/exports/`
- Only 2 API endpoints (authentication + HTML importer)
- Fast, scalable, and cost-effective!

Happy coding! 🚀


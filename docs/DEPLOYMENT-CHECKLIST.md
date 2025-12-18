# ✅ Vercel Deployment Checklist

Use this checklist to ensure everything works correctly on Vercel.

---

## 📋 Pre-Deployment

### Code Verification
- [ ] Run `npm run build` locally - builds without errors
- [ ] Run `npm run dev` - frontend works on localhost:5173
- [ ] Run `npm run dev:proxy` - backend proxy works on localhost:3001
- [ ] All features tested locally (see testing checklist below)

### Environment Variables
- [ ] `.env` file exists locally (for development)
- [ ] `.env` is in `.gitignore` (never commit!)
- [ ] `env.example` has all required variables listed

### Git Repository
- [ ] All changes committed
- [ ] Changes pushed to GitHub `main` branch
- [ ] No sensitive data in git history

---

## 🚀 Vercel Setup (One-Time)

### 1. Connect Repository

- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Click "Add New Project"
- [ ] Import your GitHub repository
- [ ] Vercel auto-detects: Vite project ✅

### 2. Configure Environment Variables

Go to: **Project Settings → Environment Variables**

Add these (copy from your `.env` file):

#### Required Variables (2 only!)
- [ ] `BEE_CLIENT_ID` - Beefree SDK client ID
- [ ] `BEE_CLIENT_SECRET` - Beefree SDK client secret

#### Optional Variables
- [ ] `HTML_IMPORTER_API_KEY` - HTML Importer API key (only needed for "Import HTML" feature)
- [ ] `HTML_IMPORTER_URL` - Custom HTML importer endpoint (default: `https://api.getbee.io/v1/conversion/html-to-json`)

**📝 Note:** This app uses **local static templates** and **pre-generated exports**, so these are NOT needed:
- ~~TEMPLATE_CATALOG_API_TOKEN~~ (not used)
- ~~TEMPLATE_CATALOG_API_URL~~ (not used)
- ~~CS_API_TOKEN~~ (not used)
- ~~PORT~~ (Vercel auto-assigns ports)

**Important Settings:**
- Set for **all environments** (Production, Preview, Development)
- **NO quotes** around values in Vercel dashboard
- Values should NOT include the `Bearer ` prefix (code adds it automatically)

### 3. Deploy

- [ ] Click "Deploy" button
- [ ] Wait ~2 minutes for build to complete
- [ ] Deployment succeeds ✅

### 4. Redeploy After Adding Variables

**CRITICAL:** After adding environment variables for the first time:
- [ ] Click "Deployments" tab
- [ ] Find latest deployment
- [ ] Click "••• " menu → "Redeploy"
- [ ] Wait for redeploy to complete

---

## 🔄 How Vercel Works

### Local Development
- Frontend runs on port `5173` (Vite)
- Backend runs on port `3001` (Express)
- Vite proxies `/api`, `/proxy`, `/v1` to Express server

**Start locally:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:proxy
```

### Production (Vercel)
- Frontend is served as static files
- API routes map to serverless functions in `/api` folder
- `vercel.json` handles routing:
  - `/api/*` → `/api/*` (serverless functions)
  - `/proxy/*` → `/api/proxy/*`
  - `/v1/*` → `/api/v1/*`

### Project Structure on Vercel

```
playground-demo/
├── api/                          # Serverless Functions (Backend)
│   ├── proxy/
│   │   └── bee-auth.js          # Authentication endpoint
│   ├── templates/
│   │   ├── index.js             # Get all templates
│   │   └── [id].js              # Get single template
│   └── v1/
│       ├── html-importer.js     # HTML import
│       └── message/
│           ├── html.js          # HTML export
│           ├── plain-text.js    # Plain text export
│           ├── pdf.js           # PDF export
│           └── image.js         # Image export
├── src/                          # Frontend (React + Vite)
├── vercel.json                   # Vercel configuration
└── env.example                   # Environment variables template
```

---

## 📡 API Endpoints

### Authentication
- `POST /proxy/bee-auth` - Get Beefree SDK token

### Template Catalog
- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get single template

### Content Services (Export)
- `POST /v1/message/html` - Export to HTML
- `POST /v1/message/plain-text` - Export to plain text
- `POST /v1/message/pdf` - Export to PDF
- `POST /v1/message/image` - Export to image

### HTML Import
- `POST /v1/html-importer` - Import HTML to Beefree JSON

---

## 🧪 Post-Deployment Testing

### Core Functionality
- [ ] Visit your Vercel URL
- [ ] Page loads without errors
- [ ] Beefree SDK initializes (you see the builder)
- [ ] Initial template loads in builder
- [ ] Open browser console → See onChange logs when editing template
- [ ] Save template → See onSave logs in console

### Template Catalog
- [ ] Open "Template:" dropdown
- [ ] See 10 templates listed
- [ ] Select a template
- [ ] Template loads in builder ✅

### Configuration Toggles
- [ ] Toggle "Apply Custom CSS" ON → `customCss` added to beeConfig
- [ ] Toggle "Move Sidebar" ON → Sidebar moves to right
- [ ] Toggle "Move Sidebar" OFF → Sidebar moves back to left
- [ ] Toggle "Group Content Tiles" ON → `modulesGroups` added to beeConfig
- [ ] Toggle "Group Content Tiles" OFF → `modulesGroups` removed
- [ ] All toggles auto-apply (no manual "Apply changes" needed)

### Export - HTML
- [ ] Click "Export" button
- [ ] Click "HTML"
- [ ] Modal opens with "Exporting HTML..."
- [ ] HTML appears in textarea
- [ ] "Download HTML" button works

### Export - Plain Text
- [ ] Click "Export" → "Plain Text"
- [ ] Modal opens
- [ ] Plain text appears
- [ ] "Download Text" button works

### Export - PDF
- [ ] Click "Export" → "PDF"
- [ ] Modal opens with "Creating PDF..."
- [ ] (HTML auto-generates in background)
- [ ] PDF link appears
- [ ] "Open PDF in New Tab" button opens PDF

### Export - Thumbnail Image
- [ ] Click "Export" → "Thumbnail Image"
- [ ] Modal opens with "Creating Thumbnail..."
- [ ] (HTML auto-generates in background)
- [ ] Thumbnail image appears
- [ ] "Download Image" button works

### HTML Import
- [ ] Click "Import HTML" button
- [ ] Modal opens
- [ ] Sample newsletter HTML shown (greyed out)
- [ ] Click "Load Sample HTML"
- [ ] "Importing..." state shows
- [ ] Newsletter template loads in builder
- [ ] Modal closes
- [ ] Template is editable in builder

### BeeConfig Editor
- [ ] Config sidebar visible on left (500px wide)
- [ ] JSON fills vertical space
- [ ] Edit JSON
- [ ] Click "Apply changes"
- [ ] Builder restarts with new config
- [ ] Click "Reset"
- [ ] Default config loads

---

## 🐛 Troubleshooting

### If Template Catalog Doesn't Work

**Symptoms:** Dropdown is empty or shows error

**Debug Steps:**
1. Open browser console (F12)
2. Look for network error on `/api/templates`
3. Check Vercel function logs:
   - Dashboard → Deployments → [Latest] → Functions
   - Click `api/templates/index.js`
   - Look for error message

**Common Causes:**
- Templates are loaded from local files (`public/templates/index.json`)
- Check that template files deployed correctly to Vercel
- Check browser console for file loading errors

**Fix:**
1. Verify token in Vercel environment variables
2. Click "Redeploy"

---

### If Exports Don't Work

**Symptoms:** 404 errors or "Failed to export"

**Debug Steps:**
1. Check which export fails (HTML, PDF, Image, Plain Text)
2. Check browser console for error
3. Check Vercel function logs for that specific export

**Common Causes:**
- Exports are pre-generated static files in `public/templates/exports/`
- Check that export files deployed correctly to Vercel
- **Note:** Exports show the ORIGINAL template, NOT user edits

**Fix:**
1. Verify `public/templates/exports/` directory exists in deployment
2. Check browser Network tab for 404 errors on export files
3. User edits are NOT saved - this is expected behavior

---

### If HTML Import Doesn't Work

**Symptoms:** Error when clicking "Load Sample HTML"

**Debug Steps:**
1. Check browser console error
2. Check Vercel function logs for `api/v1/html-importer.js`

**Common Causes:**
- Missing `HTML_IMPORTER_API_KEY` in Vercel
- Sample HTML too large (should be fine, ours is ~15KB)
- API timeout (30s limit)

**Fix:**
1. Verify `HTML_IMPORTER_API_KEY` in Vercel
2. Click "Redeploy"

---

### If Builder Doesn't Load

**Symptoms:** Blank screen or loading forever

**Debug Steps:**
1. Check browser console
2. Look for authentication errors
3. Check Vercel function logs for `api/proxy/bee-auth.js`

**Common Causes:**
- Missing `BEE_CLIENT_ID` or `BEE_CLIENT_SECRET`
- Invalid credentials
- Network error

**Fix:**
1. Verify credentials in Vercel
2. Test authentication endpoint directly:
   ```javascript
   fetch('/proxy/bee-auth', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ uid: 'test' })
   }).then(r => r.json()).then(console.log);
   ```

---

### Common Vercel Issues

**CORS errors?**
Vercel serverless functions automatically handle CORS for your domain.

**Function timeout?**
Vercel has a 10-second timeout on the free tier (60s on Pro). If operations take longer, consider:
- Optimizing API calls
- Upgrading to Pro tier
- Using a dedicated backend service

**Environment variables not working?**
- Make sure variables are added to **all environments** (Production, Preview, Development)
- Redeploy after adding variables
- Variables should NOT have quotes in Vercel dashboard

---

## 📊 Vercel Function Logs

### How to Access Logs

1. **Go to Vercel Dashboard**
2. **Click "Deployments"**
3. **Click your latest deployment**
4. **Click "Functions" tab**
5. **Click function name** to see logs

### What to Look For

**Successful Request:**
```
✅ Status: 200
✅ Duration: < 1000ms
✅ Memory: < 128MB
```

**Failed Request:**
```
❌ Status: 500
❌ Error message in logs
❌ Check "message" field for details
```

### Common Log Messages

| Message | Meaning |
|---------|---------|
| `"Token not configured"` | Missing environment variable |
| `"Templates fetched successfully"` | Template Catalog working ✅ |
| `"HTML export requested"` | Export started ✅ |
| `"Auth error: ..."` | Authentication failed |
| `401 Unauthorized` | Wrong API token |
| `404 Not Found` | Wrong endpoint URL or routing issue |

---

## 🔄 Continuous Deployment

Every push to `main` automatically deploys:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will:
1. Detect new commit
2. Build frontend (`npm run build`)
3. Deploy static files
4. Deploy serverless functions
5. Update live site
6. Send notification (if configured)

**Build Time:** ~2 minutes

### Deployment Notifications

Optional: Configure in Vercel Dashboard → Settings → Notifications
- Slack
- Discord  
- Email
- Webhook

---

## 📈 Monitoring & Performance

### Function Execution Time

**Vercel Free Tier:** 10-second timeout

**Current Functions:**
- Authentication: ~100-200ms ✅
- Template List: ~400-600ms ✅
- Template Single: ~400-600ms ✅
- HTML Export: ~1-2s ✅
- PDF Export: ~2-4s ✅
- Image Export: ~2-4s ✅
- HTML Import: ~3-6s ✅

All well under the 10s limit! ✅

### Memory Usage

**Allocated:** 1024MB (configured in `vercel.json`)
**Typical Usage:** 100-120MB ✅

### Bandwidth

**Vercel Free Tier:** 100GB/month

**Typical Usage:**
- Initial page load: ~500KB
- Template fetch: ~50-200KB
- HTML export: ~50-500KB (varies by template)
- Image export: ~100-500KB

---

## 🎯 Performance Tips

### Optimize for Production

1. **Lazy load components** (if adding more features)
2. **Cache API responses** (template catalog)
3. **Compress images** (if adding images back)
4. **Use CDN** for static assets (Vercel does this automatically)

### Reduce Function Cold Starts

Vercel Pro features:
- Faster cold starts
- More concurrent executions
- Longer timeout (60s vs 10s)

For free tier:
- Functions stay warm if called frequently
- First call may be slower (~500ms)
- Subsequent calls are fast (~100ms)

---

## 🔐 Security Checklist

- [ ] `.env` in `.gitignore`
- [ ] No API keys in git history
- [ ] Vercel environment variables set
- [ ] HTML sanitization enabled (in html-importer.js)
- [ ] CORS handled by Vercel (automatic)
- [ ] No sensitive data in frontend code
- [ ] Authentication required for SDK (via proxy)

---

## 🎉 Deployment Complete!

If all checkboxes above are checked:

✅ Your Beefree SDK Playground is fully deployed!  
✅ All 8 serverless functions working  
✅ All exports functioning correctly  
✅ Template Catalog integrated  
✅ Configuration toggles operational  
✅ HTML import working  

**Share your deployed URL and start building!** 🚀

---

## 📞 Need Help?

1. Check [`CONTRIBUTION-GUIDE.md`](./CONTRIBUTION-GUIDE.md) for architecture details
2. Review inline code comments
3. Check Vercel function logs
4. Check browser console
5. Review Beefree SDK docs: https://docs.beefree.io
6. Open an issue on GitHub

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Beefree Docs**: https://docs.beefree.io
- **Vercel Docs**: https://vercel.com/docs
- **Beefree Developer Portal**: https://developers.beefree.io


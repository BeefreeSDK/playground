# ✅ Features Verification Guide

Use this guide to verify all features work correctly after deployment or changes.

---

## ⚠️ IMPORTANT ARCHITECTURE NOTES

This app uses a **static file-based architecture**, NOT API-based:

1. **Templates:** Served as static JSON files from `public/templates/`
2. **Exports:** Pre-generated static files in `public/templates/exports/`
3. **API Endpoints:** Only 2 (authentication + HTML importer)

**CRITICAL LIMITATION:**
- Exports show the ORIGINAL template as loaded from files
- Exports do NOT include user edits made in the editor
- This is by design to avoid API costs and improve performance

---

## 🎯 Complete Feature List

### Core Features (Must Work)
1. ✅ Beefree SDK Editor Initialization
2. ✅ Local Template System (Static Files)
3. ✅ Template Loading
4. ✅ Custom CSS Toggle
5. ✅ BeeConfig Editor
6. ✅ HTML Export (Pre-generated)
7. ✅ Plain Text Export (Pre-generated)
8. ✅ PDF Export (Pre-generated)
9. ✅ Image Export (Pre-generated)
10. ✅ HTML Import (Sample Newsletter)

**⚠️ IMPORTANT:** This app uses **local static templates** and **pre-generated exports**, NOT API-based systems!

---

## 🧪 Testing Each Feature

### 1. Beefree SDK Editor Initialization ✅

**Expected Behavior:**
- Page loads
- Beefree SDK builder appears in center
- Default template loads automatically
- Content blocks visible in builder

**How to Test:**
1. Open app in browser
2. Wait 2-3 seconds
3. Builder should be fully loaded

**Success Criteria:**
- No error messages
- Builder is interactive
- You can click modules and edit

**If It Fails:**
- Check browser console for auth errors
- Check `BEE_CLIENT_ID` and `BEE_CLIENT_SECRET` environment variables
- Verify `/public/template.json` exists

---

### 2. Local Template System ✅

**⚠️ IMPORTANT:** Templates are loaded from **static files** in `public/templates/`, NOT from an API!

**Expected Behavior:**
- Template dropdown shows "Choose a template..." by default
- Click dropdown → See list of template names
- Names are readable (not IDs or undefined)

**How to Test:**
1. Look at top bar
2. Click "Template:" dropdown
3. Verify templates are listed

**Success Criteria:**
- Dropdown populates instantly
- Templates listed with descriptive names
- Template names match files in `public/templates/`

**If It Fails:**
- Check browser console Network tab for `/templates/index.json` error (404)
- Verify `public/templates/index.json` exists
- Check that template files deployed correctly

---

### 3. Template Loading ✅

**Expected Behavior:**
- Select template from dropdown
- Brief loading state
- New template loads in builder
- Previous template is replaced

**How to Test:**
1. Select any template from dropdown
2. Watch builder area
3. Template should load within 1-2 seconds

**Success Criteria:**
- Template loads completely
- No errors in console
- Template is editable
- Selected template name shows on right

**If It Fails:**
- Check browser console for `/templates/{id}.json` error (404)
- Verify template JSON file exists in `public/templates/`
- Check that template file is valid JSON

---

### 4. Custom CSS Toggle ✅

**Expected Behavior:**
- Toggle starts in OFF state (dark grey)
- Click toggle → Turns mint green
- Success message appears below for 5 seconds
- BeeConfig JSON updates with `customCss` line
- Editor restarts automatically

**How to Test:**
1. Look at top bar next to template dropdown
2. Click toggle (should turn green)
3. Look at beeConfig sidebar on left
4. Find `"customCss": "https://..."` line

**Success Criteria:**
- Toggle color: Grey (#374151) → Green (#82EDA8)
- Success message shows: "Custom CSS applied..."
- JSON updates with customCss line
- Message disappears after 5 seconds

**Toggle OFF Test:**
- Click toggle again
- Should turn grey
- `customCss` line removed from JSON
- Editor restarts

**If It Fails:**
- Check browser console for `toggleCustomCss` errors
- Verify BeeConfigSidebar is mounted
- Try manual JSON edit to test if Apply works

---

### 5. BeeConfig Editor ✅

**Expected Behavior:**
- Left sidebar shows "beeConfig" header
- Large JSON textarea (500px wide, fills vertical space)
- "Apply changes" button near bottom
- Info section at bottom
- "Reset" button in header

**How to Test:**
1. Look at left sidebar
2. Scroll through JSON
3. Edit any value (e.g., change `language` to `"es-ES"`)
4. Click "Apply changes"
5. Watch builder restart

**Success Criteria:**
- JSON is readable and editable
- Textarea fills most of vertical space
- Apply changes triggers editor restart
- Reset loads default config

**If It Fails:**
- Check for JSON syntax errors (shows error message)
- Verify `window.restartEditor` function exists
- Check browser console for errors

---

### 6. HTML Export ✅

**⚠️ IMPORTANT:** HTML exports are **pre-generated static files**, NOT generated from API!

**⚠️ CRITICAL WARNING:** Export shows the ORIGINAL template, NOT user edits made in the editor!

**Expected Behavior:**
- Click "Export" → "HTML"
- Modal opens with "Exporting HTML..."
- Pre-generated HTML appears in textarea
- "Download HTML" button available
- Modal can be closed with X or outside click

**How to Test:**
1. Select a template from dropdown
2. Click "Export" dropdown button
3. Click "HTML"
4. Check HTML content in modal

**Success Criteria:**
- Modal opens immediately
- HTML appears instantly (static file)
- HTML is valid (contains `<html>`, `<body>`, etc.)
- Download button works
- **HTML matches ORIGINAL template, not any edits**

**If It Fails:**
- Check "No template selected" error → Select a template first
- Check browser console for `/templates/exports/{id}.html` 404
- Verify export file exists in `public/templates/exports/`
- Run `npm run export-templates` to regenerate exports

---

### 7. Plain Text Export ✅

**⚠️ IMPORTANT:** Plain text exports are **pre-generated static files**, NOT generated from API!

**⚠️ CRITICAL WARNING:** Export shows the ORIGINAL template, NOT user edits made in the editor!

**Expected Behavior:**
- Click "Export" → "Plain Text"
- Modal opens
- Pre-generated plain text appears
- "Download Text" button works

**How to Test:**
1. Select a template from dropdown
2. Click "Export" → "Plain Text"
3. Check text content
4. Click download

**Success Criteria:**
- Text is readable (no HTML tags)
- Preserves content from ORIGINAL template
- Download creates .txt file
- **Text matches ORIGINAL template, not any edits**

**If It Fails:**
- Check "No template selected" error → Select a template first
- Check browser console for `/templates/exports/{id}.txt` 404
- Verify export file exists in `public/templates/exports/`
- Run `npm run export-templates` to regenerate exports

---

### 8. PDF Export ✅

**⚠️ IMPORTANT:** PDF exports are **pre-generated static files**, NOT generated from API!

**⚠️ CRITICAL WARNING:** Export shows the ORIGINAL template, NOT user edits made in the editor!

**Expected Behavior:**
- Click "Export" → "PDF"
- Pre-generated PDF opens in new tab instantly

**How to Test:**
1. Select a template from dropdown
2. Click "Export" → "PDF"
3. New tab opens with PDF

**Success Criteria:**
- PDF opens instantly (static file)
- PDF renders correctly in browser
- **PDF matches ORIGINAL template, not any edits**

**If It Fails:**
- Check "No template selected" error → Select a template first
- Check browser console for `/templates/exports/{id}.pdf` 404
- Verify export file exists in `public/templates/exports/`
- Run `npm run export-templates` to regenerate exports

---

### 9. Image Export ✅

**⚠️ IMPORTANT:** Image exports are **pre-generated static files**, NOT generated from API!

**⚠️ CRITICAL WARNING:** Export shows the ORIGINAL template, NOT user edits made in the editor!

**Expected Behavior:**
- Click "Export" → "Thumbnail Image"
- Modal opens
- Pre-generated thumbnail image appears
- "Download Image" button works

**How to Test:**
1. Select a template from dropdown
2. Click "Export" → "Thumbnail Image"
3. Check image in modal
4. Click download

**Success Criteria:**
- Modal opens immediately
- Image appears instantly (static file)
- Image displays correctly
- Download creates .png file
- **Image matches ORIGINAL template, not any edits**

**If It Fails:**
- Check "No template selected" error → Select a template first
- Check browser console for `/templates/exports/{id}.png` 404
- Verify export file exists in `public/templates/exports/`
- Run `npm run export-templates` to regenerate exports

---

### 10. HTML Import (Sample Newsletter) ✅

**Expected Behavior:**
- Click "Import HTML" button in header
- Modal opens
- Shows sample newsletter HTML (greyed out, read-only)
- Click "Load Sample HTML"
- Modal shows "Importing..."
- Newsletter template loads in builder
- Modal closes

**How to Test:**
1. Click "Import HTML"
2. Read preview (should see newsletter HTML)
3. Click "Load Sample HTML"
4. Watch builder

**Success Criteria:**
- Modal shows full newsletter HTML
- HTML is greyed out (read-only)
- Button loads newsletter within 3-6 seconds
- Newsletter appears in builder with:
  - "Hey folks," heading
  - Recipe section
  - Industry news
  - Video section
  - Changelog
  - Footer
- All purple branding (#7747ff) visible

**If It Fails:**
- Check `/v1/html-importer` endpoint (404?)
- Verify `HTML_IMPORTER_API_KEY` in environment
- Check if HTML is too large (should be ~15KB, well under 500KB limit)
- Check Vercel logs for `api/v1/html-importer.js`
- Look for sanitization issues (shouldn't have any)

---

## 🎨 Visual Verification

### Colors Should Match Brand

**Purple Theme:**
- Primary buttons: #7747FF (purple)
- Links: #7747FF (purple)
- Headings in newsletter: #7747FF (purple)
- Toggle ON: #82EDA8 (mint green)
- Toggle OFF: #374151 (dark grey)

**Backgrounds:**
- Page: #FBF9FF (light purple tint)
- Sidebars: #FFFFFF (white)
- Newsletter background: #FBF9FF

### Layout Should Be Balanced

**Sidebar:**
- Width: 500px (comfortable for JSON editing)
- JSON textarea: Fills most of vertical space
- "Apply changes" button: Near bottom (not cramped)

**Editor:**
- Fills remaining horizontal space
- No horizontal scrolling needed
- Modules panel visible on left/right (Beefree SDK's own UI)

**Modals:**
- Centered on screen
- Max width: 800px
- Readable content
- Professional appearance

---

## 🔄 End-to-End Workflow Test

**Complete User Journey:**

1. **Start:** Open app
   - ✅ Builder loads with default template

2. **Load Template:** Select "Thanksgiving Travel" (or any)
   - ✅ Template loads in builder

3. **Enable Custom CSS:** Toggle ON
   - ✅ Turns green
   - ✅ Success message shows
   - ✅ JSON updates

4. **Export HTML:** Click Export → HTML
   - ✅ Modal shows HTML
   - ✅ Download works

5. **Export PDF:** Click Export → PDF
   - ✅ Auto-generates HTML
   - ✅ PDF link appears
   - ✅ PDF opens

6. **Import Newsletter:** Click Import HTML → Load Sample HTML
   - ✅ Newsletter loads
   - ✅ Previous template replaced

7. **Edit Config:** Change `sidebarPosition` to `"right"`
   - ✅ Apply changes
   - ✅ Builder restarts
   - ✅ Sidebar now on right

8. **Reset Config:** Click Reset
   - ✅ Default config loads
   - ✅ customCss removed (if was set)

**If all 8 steps work:** ✅ Everything is functioning perfectly!

---

## 📊 Performance Benchmarks

### Load Times (Expected)

**⚠️ Note:** Using static files instead of APIs makes this app MUCH faster!

| Operation | Time | Notes |
|-----------|------|-------|
| Initial page load | 1-2s | Includes SDK initialization |
| Authentication | 100-200ms | Cached by Vercel |
| Template list fetch | <50ms | Static file (index.json) |
| Single template fetch | <100ms | Static JSON file |
| HTML export | <100ms | Pre-generated static file |
| Plain text export | <100ms | Pre-generated static file |
| PDF export | <100ms | Pre-generated static file |
| Image export | <100ms | Pre-generated static file |
| HTML import | 3-6s | API call to HTML Importer |

**MUCH faster than API-based approach!** ✅

**Note:** Exports don't include user edits, so they're instant but show original template only.

---

## 🚨 Critical Features That Must Work

### Cannot Deploy If These Fail:

1. **Builder initialization** - Core functionality
2. **Template loading** - From local files
3. **Authentication** - Required for SDK

### Can Deploy If These Have Issues:

1. **Exports** - Static files might be missing, can regenerate with `npm run export-templates`
2. **Custom CSS** - Nice to have feature
3. **HTML Import** - Optional feature, requires API key

---

## 🎯 Sign-Off Checklist

Before marking as "production ready":

### Functionality
- [ ] All 10 features tested and working
- [ ] No console errors (except expected warnings)
- [ ] All modals open and close correctly
- [ ] All downloads work
- [ ] All API endpoints respond successfully

### Performance
- [ ] Page loads in < 3 seconds
- [ ] Exports complete in < 10 seconds
- [ ] No memory leaks (test by using for 10+ minutes)
- [ ] Responsive on different screen sizes

### User Experience
- [ ] All buttons have hover states
- [ ] Loading states show for async operations
- [ ] Error messages are user-friendly
- [ ] Success messages show when appropriate
- [ ] Modals can be closed (X, outside click, Escape)

### Code Quality
- [ ] Build succeeds without errors
- [ ] TypeScript types are correct
- [ ] Inline comments present
- [ ] No TODO comments left
- [ ] No console.log in production code (or only informative ones)

### Documentation
- [ ] README.md is up to date
- [ ] CONTRIBUTION-GUIDE.md covers all features
- [ ] Environment variables documented
- [ ] Deployment steps tested

### Security
- [ ] No API keys in code
- [ ] `.env` in `.gitignore`
- [ ] HTML sanitization enabled
- [ ] CORS configured
- [ ] No sensitive data in logs

---

## ✨ All Green?

If every checkbox is checked: **🎉 Ready for Production!**

Share your Vercel URL and let others build amazing email experiences with Beefree SDK! 🚀


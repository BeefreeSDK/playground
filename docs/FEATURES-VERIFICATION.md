# ✅ Features Verification Guide

Use this guide to verify all features work correctly after deployment or changes.

---

## 🎯 Complete Feature List

### Core Features (Must Work)
1. ✅ Beefree SDK Editor Initialization
2. ✅ Template Catalog Integration
3. ✅ Template Loading
4. ✅ Custom CSS Toggle
5. ✅ BeeConfig Editor
6. ✅ HTML Export
7. ✅ Plain Text Export
8. ✅ PDF Export (with auto-HTML)
9. ✅ Image Export (with auto-HTML)
10. ✅ HTML Import (Sample Newsletter)

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

### 2. Template Catalog Integration ✅

**Expected Behavior:**
- Template dropdown shows "Choose a template..." by default
- Click dropdown → See 10 template names
- Names are readable (not IDs or undefined)

**How to Test:**
1. Look at top bar
2. Click "Template:" dropdown
3. Count templates (should be 10)

**Success Criteria:**
- Dropdown populates within 1 second
- 10 templates listed
- Template names are descriptive

**If It Fails:**
- Check browser console Network tab for `/api/templates` error
- Verify `TEMPLATE_CATALOG_API_TOKEN` in environment
- Check Vercel function logs for `api/templates/index.js`

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
- Check browser console for `/api/templates/{id}` error
- Verify template has `json_data` property
- Check Vercel function logs for `api/templates/[id].js`

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

**Expected Behavior:**
- Click "Export" → "HTML"
- Modal opens with "Exporting HTML..."
- HTML code appears in textarea
- "Download HTML" button available
- Modal can be closed with X or outside click

**How to Test:**
1. Click "Export" dropdown button
2. Click "HTML"
3. Wait for modal
4. Check HTML content

**Success Criteria:**
- Modal opens immediately
- HTML appears within 1-2 seconds
- HTML is valid (contains `<html>`, `<body>`, etc.)
- Download button works

**If It Fails:**
- Check "No template loaded" error → Template didn't load
- Check browser console for `/v1/message/html` 404
- Verify `CS_API_TOKEN` in environment
- Check Vercel function logs for `api/v1/message/html.js`

---

### 7. Plain Text Export ✅

**Expected Behavior:**
- Click "Export" → "Plain Text"
- Modal opens
- Plain text version appears
- "Download Text" button works

**How to Test:**
1. Click "Export" → "Plain Text"
2. Check text content
3. Click download

**Success Criteria:**
- Text is readable (no HTML tags)
- Preserves content from template
- Download creates .txt file

**If It Fails:**
- Same debugging as HTML Export
- Check `api/v1/message/plain-text.js` logs

---

### 8. PDF Export (with Auto-HTML Generation) ✅

**Expected Behavior:**
- Click "Export" → "PDF"
- Modal opens with "Creating PDF..."
- HTML auto-generates in background (if needed)
- PDF link appears
- "Open PDF in New Tab" opens PDF

**How to Test:**
1. **Without HTML:** Click "Export" → "PDF" (before exporting HTML)
2. Should still work! (auto-generates HTML)
3. Wait 3-5 seconds
4. PDF link appears

**Success Criteria:**
- No error about "Convert to HTML first"
- Modal shows "Creating PDF..." during generation
- PDF link works
- PDF renders correctly

**If It Fails:**
- Check HTML auto-generation step (should see network call to `/v1/message/html`)
- Check `/v1/message/pdf` endpoint
- Verify `CS_API_TOKEN` in environment
- Check Vercel logs for both html.js and pdf.js

---

### 9. Image Export (with Auto-HTML Generation) ✅

**Expected Behavior:**
- Click "Export" → "Thumbnail Image"
- Modal opens with "Creating Thumbnail..."
- HTML auto-generates if needed
- Thumbnail image appears
- "Download Image" button works

**How to Test:**
1. **Without HTML:** Click "Export" → "Thumbnail Image"
2. Should still work! (auto-generates HTML)
3. Wait 2-4 seconds
4. Thumbnail appears in modal

**Success Criteria:**
- No error about "Convert to HTML first"
- Modal shows "Creating Thumbnail..." during generation
- Image displays correctly
- Download creates .png file

**If It Fails:**
- Check HTML auto-generation (network tab)
- Check `/v1/message/image` endpoint
- Verify image Content-Type is `image/png`
- Check Vercel logs for both html.js and image.js

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

| Operation | Time | Notes |
|-----------|------|-------|
| Initial page load | 1-2s | Includes SDK initialization |
| Authentication | 100-200ms | Cached by Vercel |
| Template list fetch | 400-600ms | 10 templates |
| Single template fetch | 400-600ms | With JSON data |
| HTML export | 1-2s | Template → HTML |
| Plain text export | 1-2s | Template → Text |
| PDF export | 3-5s | HTML generation + PDF |
| Image export | 2-4s | HTML generation + Image |
| HTML import | 3-6s | HTML → JSON conversion |

**All within acceptable ranges for Vercel free tier!** ✅

---

## 🚨 Critical Features That Must Work

### Cannot Deploy If These Fail:

1. **Builder initialization** - Core functionality
2. **HTML export** - Required for PDF/Image
3. **Template loading** - From catalog or import

### Can Deploy If These Have Issues:

1. Template Catalog - Can use HTML import instead
2. Custom CSS - Nice to have
3. PDF/Image exports - HTML export still works

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


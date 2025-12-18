# 🚀 Quick Start Guide

Get up and running in 5 minutes!

---

## 1️⃣ Clone & Install

```bash
git clone <your-repo-url>
cd playground-demo
npm install
```

---

## 2️⃣ Set Up Environment

```bash
cp env.example .env
```

Edit `.env` with your Beefree credentials from [developers.beefree.io](https://developers.beefree.io):

```bash
# REQUIRED (2 credentials only!)
BEE_CLIENT_ID=your_client_id
BEE_CLIENT_SECRET=your_client_secret

# OPTIONAL (only for HTML Import feature)
HTML_IMPORTER_API_KEY=your_importer_key
```

**⚠️ Security:** Never commit `.env` file! It's already in `.gitignore`.

**📝 Note:** This app uses **local static templates** (no Template Catalog API needed). Exports are **pre-generated files** (no Content Services API needed).

---

## 3️⃣ Start Development

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run dev:proxy
```

Open `http://localhost:5173` in your browser.

---

## ✅ Try These Features

1. **Select a template** from dropdown → Loads in editor
2. **Toggle "Apply Custom CSS"** → See mint green switch
3. **Toggle "Move Sidebar"** → Sidebar moves right/left
4. **Toggle "Group Content Tiles"** → Modules organized into groups
5. **Edit template** → Check browser console for JSON logs (onChange)
6. **Save template** → Check browser console for JSON logs (onSave)
7. **Click "Export" → "HTML"** → See export modal
8. **Click "Import HTML"** → Load sample newsletter

---

## 🎯 Next Steps

- **Architecture**: [`CONTRIBUTION-GUIDE.md`](./CONTRIBUTION-GUIDE.md)
- **Best Practices**: [`CODING-STANDARDS.md`](./CODING-STANDARDS.md)
- **Security**: [`SECURITY.md`](./SECURITY.md)
- **Deployment**: [`DEPLOYMENT-CHECKLIST.md`](./DEPLOYMENT-CHECKLIST.md)
- **Beefree Docs**: https://docs.beefree.io

---

## 🆘 Troubleshooting

**Builder doesn't load?**
- ✅ Check `BEE_CLIENT_ID` and `BEE_CLIENT_SECRET` in `.env`
- ✅ Both dev servers running? (`npm run dev` + `npm run dev:proxy`)
- ✅ Check browser console for errors

**Template dropdown empty?**
- ✅ Check that `public/templates/index.json` exists
- ✅ Check browser console for loading errors
- ✅ Templates are loaded from local files (no API needed)

**Exports not working?**
- ✅ Exports are pre-generated static files from `public/templates/exports/`
- ✅ **NOTE:** Exports show the ORIGINAL template, NOT your edits
- ✅ Check browser console for file loading errors

**Still stuck?** Check [`CONTRIBUTION-GUIDE.md`](./CONTRIBUTION-GUIDE.md) for detailed debugging tips.

---

Happy coding! 🎉


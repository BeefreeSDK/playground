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
BEE_CLIENT_ID=your_client_id
BEE_CLIENT_SECRET=your_client_secret
TEMPLATE_CATALOG_API_TOKEN=your_catalog_token
CS_API_TOKEN=your_cs_token
HTML_IMPORTER_API_KEY=your_importer_key
```

**⚠️ Security:** Never commit `.env` file! It's already in `.gitignore`.

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
- ✅ Check `TEMPLATE_CATALOG_API_TOKEN` in `.env`
- ✅ Check terminal running `npm run dev:proxy` for errors

**Exports not working?**
- ✅ Check `CS_API_TOKEN` in `.env`
- ✅ Restart `npm run dev:proxy`

**Still stuck?** Check [`CONTRIBUTION-GUIDE.md`](./CONTRIBUTION-GUIDE.md) for detailed debugging tips.

---

Happy coding! 🎉


# 📚 Documentation Overview

Welcome to the Beefree SDK Playground documentation! This guide helps you find the right document for your needs.

---

## 🚀 Getting Started

**New to the project?** Start here:

1. **`QUICK-START.md`** - Get up and running in 5 minutes
2. **`README.md`** (root) - Project overview, features, and quick reference
3. **`CONTRIBUTION-GUIDE.md`** - Detailed architecture and how everything works

---

## 📖 Core Documentation

### For Developers

- **`CONTRIBUTION-GUIDE.md`** - Complete architecture guide
  - Project structure
  - Component breakdown
  - API integration details
  - How features work together
  - Debugging tips

- **`CODING-STANDARDS.md`** - Best practices and clean code
  - TypeScript guidelines
  - React patterns
  - Error handling
  - Code style

- **`SECURITY.md`** - Security best practices
  - API key management
  - Input validation
  - XSS prevention
  - Security checklist

### For Deployment

- **`DEPLOYMENT-CHECKLIST.md`** - Vercel deployment guide
  - Pre-deployment checklist
  - Environment variables setup
  - Post-deployment testing
  - Troubleshooting
  - Vercel-specific details

### For Testing

- **`FEATURES-VERIFICATION.md`** - Complete testing guide
  - Step-by-step feature testing
  - Expected behavior
  - Success criteria
  - Debugging steps

---

## 🎯 Quick Reference

### Setup
```bash
git clone <repo-url>
cd playground-demo
npm install
cp env.example .env
# Edit .env with your credentials
npm run dev          # Terminal 1
npm run dev:proxy    # Terminal 2
```

### Key Features
- ✅ Template Catalog integration
- ✅ 4 Export types (HTML, Plain Text, PDF, Image)
- ✅ HTML Import
- ✅ 3 Configuration toggles (CSS, Sidebar, Module Groups)
- ✅ onChange/onSave callbacks with console logging
- ✅ Editable beeConfig sidebar

### Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| `README.md` (root) | Project overview | Everyone |
| `QUICK-START.md` | 5-minute setup | New developers |
| `CONTRIBUTION-GUIDE.md` | Architecture details | Contributors |
| `CODING-STANDARDS.md` | Best practices | Developers |
| `SECURITY.md` | Security guidelines | All team members |
| `DEPLOYMENT-CHECKLIST.md` | Deployment guide | DevOps/Deployers |
| `FEATURES-VERIFICATION.md` | Testing guide | QA/Testers |

---

## 🔍 Finding Information

### "How do I..."

- **...set up the project?** → `QUICK-START.md`
- **...understand the architecture?** → `CONTRIBUTION-GUIDE.md`
- **...add a new feature?** → `CONTRIBUTION-GUIDE.md` + `CODING-STANDARDS.md`
- **...deploy to Vercel?** → `DEPLOYMENT-CHECKLIST.md`
- **...handle API keys securely?** → `SECURITY.md`
- **...write clean code?** → `CODING-STANDARDS.md`
- **...test features?** → `FEATURES-VERIFICATION.md`

---

## 🗺️ Documentation Roadmap

### For Different Roles

**🆕 New Developers:**
1. Start with `QUICK-START.md`
2. Then read `README.md` (root)
3. Browse inline comments while coding
4. Reference `CONTRIBUTION-GUIDE.md` as needed

**🔧 Contributors:**
1. Read `CONTRIBUTION-GUIDE.md` thoroughly
2. Check inline comments in files you're editing
3. Follow `CODING-STANDARDS.md` guidelines
4. Reference `README.md` for API patterns

**🚀 DevOps/Deployers:**
1. Read `DEPLOYMENT-CHECKLIST.md`
2. Follow step-by-step checklist
3. Check Vercel function logs for issues

**🧪 QA/Testers:**
1. Use `FEATURES-VERIFICATION.md`
2. Follow testing checklist
3. Report issues with console logs

**👥 Project Leads:**
1. Read `README.md` (root) for feature overview
2. Skim `CONTRIBUTION-GUIDE.md` for architecture
3. Use `DEPLOYMENT-CHECKLIST.md` for deployment
4. Share `QUICK-START.md` with new team members

---

## 🎓 Learning Path

### Beginner
1. Read `QUICK-START.md` (get it running)
2. Play with the UI (try all features)
3. Read `README.md` (root) (understand what's possible)
4. Browse inline comments (see how it works)

### Intermediate
1. Read `CONTRIBUTION-GUIDE.md` sections 1-6
2. Study component files with comments
3. Make small changes (try adding a button)
4. Deploy to Vercel using `DEPLOYMENT-CHECKLIST.md`

### Advanced
1. Read entire `CONTRIBUTION-GUIDE.md`
2. Understand all patterns (window functions, auto-HTML, etc.)
3. Add new Beefree API integrations
4. Optimize performance
5. Help other contributors

---

## 📑 Code Documentation

### Inline Comments

All source files have comprehensive inline comments:

**Frontend Components:**
- `src/App.tsx` - Main application logic
- `src/components/BeefreeEditor.tsx` - SDK initialization
- `src/components/BeeConfigSidebar.tsx` - Config editor
- `src/components/TemplateTopBar.tsx` - Template selector & toggles
- `src/components/ExportDropdown.tsx` - Export menu
- `src/components/ExportResultModal.tsx` - Export results display
- `src/components/HtmlImportModal.tsx` - HTML import modal

**Backend API Functions:**
- `api/proxy/bee-auth.js` - Authentication
- `api/templates/index.js` - List templates
- `api/templates/[id].js` - Get single template
- `api/v1/html-importer.js` - HTML to JSON conversion
- `api/v1/message/*.js` - All export endpoints

---

## 🔗 External Documentation

**Beefree SDK:**
- Main Docs: https://docs.beefree.io/beefree-sdk
- API Reference: https://docs.beefree.io/beefree-sdk/reference
- SDK Configuration: https://docs.beefree.io/beefree-sdk/reference/sdk-configuration

**Beefree APIs:**
- Template Catalog: https://docs.beefree.io/beefree-sdk/apis/template-catalog-api
- Content Services: https://docs.beefree.io/beefree-sdk/apis/content-services-api
- HTML Importer: https://docs.beefree.io/beefree-sdk/apis/html-importer-api

**Vercel:**
- Serverless Functions: https://vercel.com/docs/functions
- Environment Variables: https://vercel.com/docs/environment-variables
- Deployments: https://vercel.com/docs/deployments

**React & TypeScript:**
- React Docs: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs
- Vite: https://vitejs.dev/guide

---

## 📝 Documentation Standards

All documentation follows these principles:

1. **Clear and Concise** - Easy to scan and understand
2. **Actionable** - Step-by-step instructions
3. **Up-to-Date** - Reflects current codebase
4. **Well-Organized** - Logical structure with clear headings
5. **Examples Included** - Code examples where helpful

---

## 🤝 Contributing to Documentation

When updating code:

1. **Update relevant docs** - If you change architecture, update `CONTRIBUTION-GUIDE.md`
2. **Add examples** - Show how to use new features
3. **Keep it concise** - Remove outdated information
4. **Test instructions** - Verify all commands work

---

**Need help?** Check the relevant documentation file or see `CONTRIBUTION-GUIDE.md` for debugging tips.


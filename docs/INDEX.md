# 📚 Documentation Overview

Welcome to the Beefree SDK Playground documentation! This guide helps you find the right document for your needs.

---

## 🚀 Getting Started

**New to the project?** Start here:

1. **[QUICK-START.md](QUICK-START.md)** - Get up and running in 5 minutes
2. **[README.md](../README.md)** (root) - Project overview, features, and quick reference
3. **[CONTRIBUTION-GUIDE.md](CONTRIBUTION-GUIDE.md)** - Detailed architecture and how everything works

---

## 📖 Core Documentation

### For Developers

- **[CONTRIBUTION-GUIDE.md](CONTRIBUTION-GUIDE.md)** - Complete architecture guide
  - Project structure
  - Component breakdown
  - API integration details
  - How features work together
  - Debugging tips

- **[CODING-STANDARDS.md](CODING-STANDARDS.md)** - Best practices and clean code
  - TypeScript guidelines
  - React patterns
  - Error handling
  - Code style

- **[AI_GUIDELINES.md](AI_GUIDELINES.md)** - AI/Claude Code integration guidelines
  - Beefree SDK best practices
  - Static template system
  - Export endpoints
  - Configuration patterns

- **[SECURITY.md](SECURITY.md)** - Security best practices
  - API key management
  - Input validation
  - XSS prevention
  - Security checklist

### For Testing

- **[testing/TESTING.md](testing/TESTING.md)** - Complete testing guide
  - Test structure and organization
  - Running tests (all modes)
  - Writing new tests
  - Mocking strategies
  - CI/CD integration
  - Best practices

- **[testing/QUICK_TEST_GUIDE.md](testing/QUICK_TEST_GUIDE.md)** - Quick test reference
  - Quick commands
  - Test results summary
  - Troubleshooting

- **[testing/TEST_SUMMARY.md](testing/TEST_SUMMARY.md)** - Test coverage summary
  - Detailed test breakdown
  - Coverage statistics
  - Test infrastructure

- **[FEATURES-VERIFICATION.md](FEATURES-VERIFICATION.md)** - Feature testing guide
  - Step-by-step feature testing
  - Expected behavior
  - Success criteria
  - Debugging steps

### For Deployment

- **[DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)** - Vercel deployment guide
  - Pre-deployment checklist
  - Environment variables setup
  - Post-deployment testing
  - Troubleshooting
  - Vercel-specific details

---

## 🎯 Quick Reference

### Setup
```bash
git clone <repo-url>
cd playground
npm install
cp env.example .env
# Edit .env with your credentials
npm run dev          # Terminal 1
npm run dev:proxy    # Terminal 2
```

### Testing
```bash
npm test              # Watch mode
npm run test:ui       # Visual UI
npm run test:run      # Single run
npm run test:coverage # Coverage report
```

### Key Features
- ✅ Local template system (static files)
- ✅ Pre-generated exports (HTML, Plain Text, PDF, Image)
- ✅ HTML Import (optional - requires API key)
- ✅ 3 Configuration toggles (CSS, Sidebar, Module Groups)
- ✅ onChange/onSave callbacks with console logging
- ✅ Editable beeConfig sidebar
- ✅ Comprehensive unit tests (93 tests)

**⚠️ IMPORTANT:** This app uses local static templates and pre-generated exports, NOT API-based systems!

### Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| [README.md](../README.md) | Project overview | Everyone |
| [QUICK-START.md](QUICK-START.md) | 5-minute setup | New developers |
| [CONTRIBUTION-GUIDE.md](CONTRIBUTION-GUIDE.md) | Architecture details | Contributors |
| [CODING-STANDARDS.md](CODING-STANDARDS.md) | Best practices | Developers |
| [AI_GUIDELINES.md](AI_GUIDELINES.md) | AI integration guide | AI/Developers |
| [SECURITY.md](SECURITY.md) | Security guidelines | All team members |
| [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md) | Deployment guide | DevOps/Deployers |
| [testing/TESTING.md](testing/TESTING.md) | Complete testing guide | Developers/QA |
| [testing/QUICK_TEST_GUIDE.md](testing/QUICK_TEST_GUIDE.md) | Quick test reference | Developers |
| [testing/TEST_SUMMARY.md](testing/TEST_SUMMARY.md) | Test coverage summary | Developers/QA |
| [FEATURES-VERIFICATION.md](FEATURES-VERIFICATION.md) | Feature testing | QA/Testers |

---

## 🔍 Finding Information

### "How do I..."

- **...set up the project?** → [QUICK-START.md](QUICK-START.md)
- **...understand the architecture?** → [CONTRIBUTION-GUIDE.md](CONTRIBUTION-GUIDE.md)
- **...add a new feature?** → [CONTRIBUTION-GUIDE.md](CONTRIBUTION-GUIDE.md) + [CODING-STANDARDS.md](CODING-STANDARDS.md)
- **...run tests?** → [testing/QUICK_TEST_GUIDE.md](testing/QUICK_TEST_GUIDE.md)
- **...write tests?** → [testing/TESTING.md](testing/TESTING.md)
- **...deploy to Vercel?** → [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)
- **...handle API keys securely?** → [SECURITY.md](SECURITY.md)
- **...write clean code?** → [CODING-STANDARDS.md](CODING-STANDARDS.md)
- **...test features?** → [FEATURES-VERIFICATION.md](FEATURES-VERIFICATION.md)
- **...use AI guidelines?** → [AI_GUIDELINES.md](AI_GUIDELINES.md)

---

## 🗺️ Documentation Roadmap

### For Different Roles

**🆕 New Developers:**
1. Start with [QUICK-START.md](QUICK-START.md)
2. Then read [README.md](../README.md) (root)
3. Browse inline comments while coding
4. Reference [CONTRIBUTION-GUIDE.md](CONTRIBUTION-GUIDE.md) as needed

**🔧 Contributors:**
1. Read [CONTRIBUTION-GUIDE.md](CONTRIBUTION-GUIDE.md) thoroughly
2. Check inline comments in files you're editing
3. Follow [CODING-STANDARDS.md](CODING-STANDARDS.md) guidelines
4. Reference [README.md](../README.md) for API patterns

**🧪 QA/Testers:**
1. Use [testing/QUICK_TEST_GUIDE.md](testing/QUICK_TEST_GUIDE.md) for running tests
2. Read [FEATURES-VERIFICATION.md](FEATURES-VERIFICATION.md) for manual testing
3. Check [testing/TEST_SUMMARY.md](testing/TEST_SUMMARY.md) for coverage
4. Report issues with console logs

**🚀 DevOps/Deployers:**
1. Read [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)
2. Follow step-by-step checklist
3. Check Vercel function logs for issues

**👥 Project Leads:**
1. Read [README.md](../README.md) (root) for feature overview
2. Skim [CONTRIBUTION-GUIDE.md](CONTRIBUTION-GUIDE.md) for architecture
3. Use [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md) for deployment
4. Share [QUICK-START.md](QUICK-START.md) with new team members

**🤖 AI/Claude Code:**
1. Primary reference: [AI_GUIDELINES.md](AI_GUIDELINES.md)
2. Code patterns: [CODING-STANDARDS.md](CODING-STANDARDS.md)
3. Architecture: [CONTRIBUTION-GUIDE.md](CONTRIBUTION-GUIDE.md)

---

## 🎓 Learning Path

### Beginner
1. Read [QUICK-START.md](QUICK-START.md) (get it running)
2. Play with the UI (try all features)
3. Read [README.md](../README.md) (root) (understand what's possible)
4. Browse inline comments (see how it works)

### Intermediate
1. Read [CONTRIBUTION-GUIDE.md](CONTRIBUTION-GUIDE.md) sections 1-6
2. Study component files with comments
3. Make small changes (try adding a button)
4. Run tests with [testing/QUICK_TEST_GUIDE.md](testing/QUICK_TEST_GUIDE.md)
5. Deploy to Vercel using [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)

### Advanced
1. Read entire [CONTRIBUTION-GUIDE.md](CONTRIBUTION-GUIDE.md)
2. Understand all patterns (window functions, auto-HTML, etc.)
3. Write unit tests following [testing/TESTING.md](testing/TESTING.md)
4. Add new Beefree API integrations
5. Optimize performance
6. Help other contributors

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

**Backend API Functions (Only 2!):**
- `api/proxy/bee-auth.js` - Authentication (REQUIRED)
- `api/v1/html-importer.js` - HTML to JSON conversion (OPTIONAL - for HTML Import feature)

**Static File Serving:**
- `public/templates/index.json` - Template catalog
- `public/templates/*.json` - Individual templates
- `public/templates/exports/*.html|txt|pdf|png` - Pre-generated exports

**Test Files:**
- `src/services/__tests__/` - Service tests
- `src/components/__tests__/` - Component tests
- `src/utils/__tests__/` - Utility tests
- `api/*/__tests__/` - Backend tests

---

## 🔗 External Documentation

**Beefree SDK:**
- Main Docs: https://docs.beefree.io/beefree-sdk
- API Reference: https://docs.beefree.io/beefree-sdk/reference
- SDK Configuration: https://docs.beefree.io/beefree-sdk/reference/sdk-configuration

**Beefree APIs:**
- HTML Importer: https://docs.beefree.io/beefree-sdk/apis/html-importer-api (USED - for HTML Import feature)
- Template Catalog: https://docs.beefree.io/beefree-sdk/apis/template-catalog-api (NOT USED - app uses local templates)
- Content Services: https://docs.beefree.io/beefree-sdk/apis/content-services-api (NOT USED - app uses pre-generated exports)

**Vercel:**
- Serverless Functions: https://vercel.com/docs/functions
- Environment Variables: https://vercel.com/docs/environment-variables
- Deployments: https://vercel.com/docs/deployments

**React & TypeScript:**
- React Docs: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs
- Vite: https://vitejs.dev/guide

**Testing:**
- Vitest: https://vitest.dev/
- React Testing Library: https://testing-library.com/react

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

1. **Update relevant docs** - If you change architecture, update [CONTRIBUTION-GUIDE.md](CONTRIBUTION-GUIDE.md)
2. **Add examples** - Show how to use new features
3. **Keep it concise** - Remove outdated information
4. **Test instructions** - Verify all commands work
5. **Update tests** - Write tests for new features

---

## 📁 Documentation Structure

```
docs/
├── INDEX.md                      # This file - documentation overview
├── QUICK-START.md                # 5-minute setup guide
├── CONTRIBUTION-GUIDE.md         # Complete architecture guide
├── CODING-STANDARDS.md           # Best practices and standards
├── AI_GUIDELINES.md              # AI/Claude Code integration guide
├── SECURITY.md                   # Security best practices
├── DEPLOYMENT-CHECKLIST.md       # Vercel deployment guide
├── FEATURES-VERIFICATION.md      # Feature testing guide
└── testing/
    ├── TESTING.md                # Complete testing guide
    ├── QUICK_TEST_GUIDE.md       # Quick test reference
    └── TEST_SUMMARY.md           # Test coverage summary
```

---

**Need help?** Check the relevant documentation file or see [CONTRIBUTION-GUIDE.md](CONTRIBUTION-GUIDE.md) for debugging tips.

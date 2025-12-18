# 🔐 Security Best Practices

This document outlines security best practices for the Beefree SDK Playground project.

---

## 🔑 API Key Management

### ✅ DO

- **Store all API keys in environment variables** - Never hardcode secrets
- **Use `.env` file for local development** - Add `.env` to `.gitignore`
- **Use Vercel environment variables for production** - Encrypted and secure
- **Rotate keys regularly** - Change API keys periodically
- **Use different keys for dev/staging/production** - Never reuse production keys

### ❌ DON'T

- **Never commit `.env` files** - Check `.gitignore` includes `.env`
- **Never commit real API keys** - Even in `env.example` (use placeholders)
- **Never expose keys in frontend code** - All API calls go through backend
- **Never log API keys** - Remove keys from console.log statements
- **Never share keys in chat/email** - Use secure secret management tools

---

## 🛡️ Code Security

### Input Validation

**Always validate and sanitize user input:**

```javascript
// ✅ Good: Validate and sanitize HTML before importing
const sanitizedHtml = html
  .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
  .replace(/on\w+="[^"]*"/gi, '')
  .replace(/javascript:/gi, '');

// ❌ Bad: Direct use of user input
await axios.post(API_URL, { html: userInput }); // XSS risk!
```

### API Endpoint Security

**All API endpoints should:**

1. **Validate environment variables exist** before making calls
2. **Handle errors gracefully** without exposing internal details
3. **Use proper HTTP status codes** (400, 401, 403, 500)
4. **Sanitize error messages** sent to frontend

```javascript
// ✅ Good: Secure error handling
try {
  if (!API_TOKEN) {
    return res.status(500).json({ error: 'API token not configured' });
  }
  // ... API call
} catch (error) {
  console.error('API error:', error); // Log internally
  res.status(500).json({ error: 'Operation failed' }); // Generic message to client
}

// ❌ Bad: Exposing internal errors
catch (error) {
  res.status(500).json({ error: error.message }); // May expose sensitive info
}
```

---

## 🌐 Frontend Security

### XSS Prevention

- **HTML Importer sanitizes input** - Removes scripts, iframes, event handlers
- **Never use `dangerouslySetInnerHTML`** - Use safe rendering methods
- **Validate JSON before parsing** - Catch malformed data early

### CORS

- **Serverless functions handle CORS automatically** - No additional config needed
- **No CORS issues** - All API calls go through same domain

---

## 🔒 Environment Variables

### Local Development

```bash
# Create .env file (never commit!)
cp env.example .env

# Edit .env with your real keys
# .env is in .gitignore - safe to use real keys locally
```

### Production (Vercel)

1. **Go to Vercel Dashboard → Project Settings → Environment Variables**
2. **Add all required variables**
3. **Set for all environments** (Production, Preview, Development)
4. **Never include quotes** around values
5. **Redeploy after adding variables**

### Required Variables

```
# REQUIRED (for Beefree SDK)
BEE_CLIENT_ID
BEE_CLIENT_SECRET

# OPTIONAL (only for HTML Import feature)
HTML_IMPORTER_API_KEY
```

**Note:** This app uses **local static templates** and **pre-generated exports**, so it does NOT need:
- ~~TEMPLATE_CATALOG_API_TOKEN~~ (not used)
- ~~CS_API_TOKEN~~ (not used)
- ~~BRAND_STYLE_API_TOKEN~~ (not used)

---

## 📝 Secrets in Code Review

### Before Committing

- [ ] No API keys in code files
- [ ] No secrets in `env.example` (use placeholders)
- [ ] `.env` is in `.gitignore`
- [ ] No console.log statements with API keys
- [ ] No hardcoded credentials

### Git History

If you accidentally committed secrets:

1. **Rotate the exposed keys immediately**
2. **Remove from git history** (use `git filter-branch` or BFG Repo-Cleaner)
3. **Force push** (coordinate with team)
4. **Update all environments** with new keys

---

## 🚨 Security Checklist

Before deploying:

- [ ] All API keys are in environment variables
- [ ] `.env` file is in `.gitignore`
- [ ] `env.example` has placeholders only
- [ ] No secrets in console.log statements
- [ ] HTML input is sanitized
- [ ] Error messages don't expose internal details
- [ ] Vercel environment variables are set
- [ ] Different keys for dev/prod (if applicable)

---

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Beefree Security Documentation](https://docs.beefree.io)

---

**Remember:** Security is everyone's responsibility. When in doubt, ask!


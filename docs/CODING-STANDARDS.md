# 📐 Coding Standards & Best Practices

This document outlines coding standards, best practices, and clean code principles for the Beefree SDK Playground project.

---

## 🎯 General Principles

### 1. **Readability First**
Code should be easy to read and understand. If you need to explain it in comments, consider refactoring.

### 2. **Single Responsibility**
Each function/component should do one thing well.

### 3. **DRY (Don't Repeat Yourself)**
Extract common patterns into reusable functions/components.

### 4. **Fail Fast**
Validate inputs early and handle errors gracefully.

---

## 📝 Code Style

### TypeScript

**✅ Use TypeScript for type safety:**

```typescript
// ✅ Good: Explicit types
interface TemplateTopBarProps {
  onTemplateSelect: (template: Template) => void;
  selectedTemplate: Template | null;
}

// ❌ Bad: Using 'any' everywhere
const handleSelect = (template: any) => { ... };
```

**✅ Use meaningful variable names:**

```typescript
// ✅ Good: Descriptive names
const currentTemplateRef = useRef<any>(null);
const isInitialized = useState(false);

// ❌ Bad: Abbreviations or unclear names
const tplRef = useRef(null);
const init = useState(false);
```

### React Components

**✅ Functional components with hooks:**

```typescript
// ✅ Good: Modern React patterns
const BeefreeEditor: React.FC<BeefreeEditorProps> = ({ 
  selectedTemplate, 
  onTemplateLoad 
}) => {
  const [loading, setLoading] = useState(false);
  // ...
};

// ❌ Bad: Class components (unless necessary)
class BeefreeEditor extends React.Component { ... }
```

**✅ Extract complex logic:**

```typescript
// ✅ Good: Extract handler logic
const handleTemplateSelect = async (templateId: string) => {
  try {
    setLoading(true);
    const template = await fetchTemplate(templateId);
    onTemplateSelect(template);
  } catch (error) {
    handleError(error);
  } finally {
    setLoading(false);
  }
};

// ❌ Bad: Everything inline
<select onChange={(e) => {
  setLoading(true);
  fetch(`/api/templates/${e.target.value}`).then(...).catch(...);
}}>
```

### Async/Await

**✅ Prefer async/await over promises:**

```typescript
// ✅ Good: Clean async/await
const handleExport = async () => {
  try {
    const response = await fetch('/v1/message/html', {
      method: 'POST',
      body: JSON.stringify(currentJson)
    });
    const html = await response.text();
    setExportContent(html);
  } catch (error) {
    console.error('Export failed:', error);
    alert('Failed to export');
  }
};

// ❌ Bad: Promise chains
fetch('/v1/message/html', {...})
  .then(response => response.text())
  .then(html => setExportContent(html))
  .catch(error => { ... });
```

---

## 🎨 Component Structure

### File Organization

**✅ Consistent component structure:**

```typescript
// 1. Imports (external, then internal)
import { useState, useEffect } from 'react';
import axios from 'axios';
import BeefreeSDK from '@beefree.io/sdk';

// 2. Types/Interfaces
interface ComponentProps {
  // ...
}

// 3. Component
const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // 4. State
  const [state, setState] = useState();
  
  // 5. Refs
  const ref = useRef();
  
  // 6. Effects
  useEffect(() => { ... }, []);
  
  // 7. Handlers
  const handleAction = () => { ... };
  
  // 8. Render
  return <div>...</div>;
};

// 9. Export
export default Component;
```

### Comments

**✅ Use comments for "why", not "what":**

```typescript
// ✅ Good: Explains reasoning
// Clear selectedTemplate to prevent catalog template from auto-reloading
// This allows users to edit the template without it being reset
setSelectedTemplate(null);

// ❌ Bad: States the obvious
// Set selectedTemplate to null
setSelectedTemplate(null);
```

**✅ Use JSDoc for complex functions:**

```typescript
/**
 * Export to PDF
 * Auto-generates HTML first if needed, then creates PDF
 * PDF export requires HTML (not JSON), so we convert first
 */
const handleGetPdf = async () => {
  // ...
};
```

---

## 🔧 Error Handling

### ✅ Consistent Error Handling

```typescript
// ✅ Good: Try-catch with user-friendly messages
const handleAction = async () => {
  try {
    setLoading(true);
    const result = await apiCall();
    setResult(result);
  } catch (err: any) {
    console.error('Action failed:', err); // Log for debugging
    alert('Operation failed. Please try again.'); // User-friendly message
  } finally {
    setLoading(false);
  }
};

// ❌ Bad: Silent failures or exposing errors
const handleAction = async () => {
  const result = await apiCall(); // No error handling!
  setResult(result);
};
```

### ✅ Validate Before Actions

```typescript
// ✅ Good: Validate early
const handleExport = async () => {
  if (!currentJson) {
    alert('No template loaded. Please select a template first.');
    return;
  }
  
  // Proceed with export
};

// ❌ Bad: Let API handle validation
const handleExport = async () => {
  const response = await fetch('/v1/message/html', {
    body: JSON.stringify(currentJson) // May be null!
  });
};
```

---

## 🎯 State Management

### ✅ Use Appropriate State Types

```typescript
// ✅ Good: Specific state types
const [exportType, setExportType] = useState<'html' | 'pdf' | null>(null);
const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

// ❌ Bad: Generic any
const [exportType, setExportType] = useState<any>(null);
```

### ✅ Refs vs State

**Use refs for:**
- Values that don't trigger re-renders
- Current template state (updated on every change)
- DOM references

**Use state for:**
- Values that affect rendering
- User input
- Loading states

```typescript
// ✅ Good: Ref for current template (updated frequently)
const currentTemplateRef = useRef<any>(null);

onChange: (json) => {
  currentTemplateRef.current = json; // No re-render, always current
};

// ✅ Good: State for UI updates
const [isLoading, setIsLoading] = useState(false);
```

---

## 🎨 CSS & Styling

### ✅ Use CSS Variables

```css
/* ✅ Good: CSS variables */
.button {
  background-color: var(--beefree-purple);
  color: var(--text-primary);
}

/* ❌ Bad: Hardcoded colors */
.button {
  background-color: #7747FF;
  color: #1F2937;
}
```

### ✅ Consistent Naming

```css
/* ✅ Good: BEM-like naming */
.custom-css-toggle-container { }
.toggle-switch { }
.toggle-slider { }
.toggle-label { }

/* ❌ Bad: Inconsistent naming */
.cssToggle { }
toggleSwitch { }
toggle_slider { }
```

---

## 🧪 Testing Considerations

### ✅ Testable Code

```typescript
// ✅ Good: Pure function, easy to test
const normalizeTemplateJson = (input: any): any => {
  if (!input) return input;
  if (input.json_data) return input.json_data;
  if (input.json) return input.json;
  return input;
};

// ❌ Bad: Side effects, hard to test
const normalizeTemplateJson = (input: any) => {
  setState(input.json_data); // Side effect!
  return input.json_data;
};
```

---

## 📦 Dependencies

### ✅ Keep Dependencies Updated

- Review `package.json` regularly
- Update dependencies for security patches
- Remove unused dependencies

### ✅ Use Established Libraries

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **Vite** - Build tool

---

## 🚀 Performance

### ✅ Optimize Re-renders

```typescript
// ✅ Good: Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// ✅ Good: Callback memoization
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### ✅ Lazy Loading

```typescript
// ✅ Good: Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Use Suspense wrapper
<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

---

## 📋 Code Review Checklist

Before submitting PR:

- [ ] Code follows TypeScript best practices
- [ ] No `any` types (unless absolutely necessary)
- [ ] Functions are small and focused
- [ ] Error handling is consistent
- [ ] Comments explain "why", not "what"
- [ ] CSS uses variables (no hardcoded colors)
- [ ] No console.log in production code (use console.error for errors)
- [ ] No hardcoded API keys or secrets
- [ ] Input validation before API calls
- [ ] Async/await used (not promise chains)

---

## 🔍 Linting

### ESLint Configuration

The project uses ESLint with TypeScript support. Run:

```bash
npm run lint
```

**Common rules:**
- No unused variables
- No console.log (warnings)
- TypeScript strict mode
- React hooks rules

---

## 📚 Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Best Practices](https://react.dev/learn)
- [Clean Code by Robert Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)

---

**Remember:** Code is read more often than it's written. Write for your future self and your teammates!


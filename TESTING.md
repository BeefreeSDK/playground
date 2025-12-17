# Testing Guide

This document provides comprehensive information about the testing infrastructure for this Beefree SDK integration application.

## Table of Contents

- [Overview](#overview)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Writing Tests](#writing-tests)
- [Troubleshooting](#troubleshooting)

## Overview

This application uses [Vitest](https://vitest.dev/) as the testing framework, along with:

- **@testing-library/react** - React component testing utilities
- **@testing-library/jest-dom** - Custom DOM matchers
- **@testing-library/user-event** - User interaction simulation
- **jsdom** - DOM implementation for Node.js
- **vitest/ui** - Visual test UI

## Test Structure

```
.
├── src/
│   ├── services/
│   │   ├── __tests__/
│   │   │   ├── localTemplates.test.ts
│   │   │   └── api.test.ts
│   ├── utils/
│   │   └── __tests__/
│   │       └── exportHelpers.test.ts
│   ├── components/
│   │   └── __tests__/
│   │       ├── ExportDropdown.test.tsx
│   │       ├── ExportResultModal.test.tsx
│   │       └── HtmlImportModal.test.tsx
│   └── tests/
│       ├── setup.ts          # Test setup and global mocks
│       └── mocks/
│           └── handlers.ts   # Mock data for tests
├── api/
│   ├── proxy/
│   │   └── __tests__/
│   │       └── bee-auth.test.js
│   └── v1/
│       └── __tests__/
│           └── html-importer.test.js
└── vitest.config.ts          # Vitest configuration
```

## Running Tests

### All Tests

Run all tests in watch mode:

```bash
npm test
```

### Single Run

Run all tests once (useful for CI/CD):

```bash
npm run test:run
```

### Visual UI

Run tests with the Vitest UI:

```bash
npm run test:ui
```

This will open a browser with an interactive test UI at `http://localhost:51204/__vitest__/`

### Coverage Report

Generate test coverage report:

```bash
npm run test:coverage
```

Coverage reports are generated in:
- Terminal output
- `coverage/` directory (HTML report)

## Test Coverage

### Frontend Tests

#### Services
- **localTemplates.ts** (100%)
  - ✅ loadTemplatesIndex()
  - ✅ loadTemplate()
  - ✅ URL generators (HTML, PDF, Image, Text)
  - ✅ loadTemplateHtml()
  - ✅ loadTemplatePlainText()
  - ✅ loadAllTemplates()

- **api.ts** (100%)
  - ✅ authAPI.getToken() with default uid
  - ✅ authAPI.getToken() with custom uid
  - ✅ Error handling

#### Utils
- **exportHelpers.ts** (100%)
  - ✅ getTemplateId()
  - ✅ validateTemplateId()
  - ✅ showExportWarning()
  - ✅ handleExportError()
  - ✅ getTemplateDisplayName()

#### Components
- **ExportDropdown.tsx** (95%)
  - ✅ Renders export button
  - ✅ Toggles dropdown menu
  - ✅ Calls export handlers (HTML, Text, Image, PDF)
  - ✅ Closes after selection
  - ✅ Disables during loading
  - ✅ Shows loading spinners
  - ✅ Renders documentation link
  - ✅ Closes on outside click

- **ExportResultModal.tsx** (95%)
  - ✅ HTML export modal
  - ✅ Plain text export modal
  - ✅ PDF export modal
  - ✅ Image export modal
  - ✅ Loading states
  - ✅ Download functionality
  - ✅ Modal interactions (close, overlay click)

- **HtmlImportModal.tsx** (100%)
  - ✅ Renders sample HTML preview
  - ✅ Loads sample HTML
  - ✅ Shows loading state
  - ✅ Handles errors
  - ✅ Modal interactions (close, escape key)

### Backend Tests

#### API Endpoints
- **bee-auth.js** (100%)
  - ✅ POST only (405 for other methods)
  - ✅ Authenticates with default uid
  - ✅ Authenticates with custom uid
  - ✅ Error handling
  - ✅ Uses environment variables

- **html-importer.js** (100%)
  - ✅ POST only (405 for other methods)
  - ✅ Validates API key configuration
  - ✅ Converts hardcoded sample HTML
  - ✅ Ignores user-provided HTML (security)
  - ✅ Handles errors (413, 422, timeout, general)
  - ✅ Uses custom/default API URL

## Writing Tests

### Test File Naming

- Test files should be named `*.test.ts` or `*.test.tsx`
- Place test files in `__tests__` directories next to the code they test

### Component Test Example

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Service Test Example

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { myService } from '../myService';

describe('myService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch data successfully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' }),
    });

    const result = await myService.getData();
    expect(result).toEqual({ data: 'test' });
  });

  it('should handle errors', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    await expect(myService.getData()).rejects.toThrow();
  });
});
```

### Backend Endpoint Test Example

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import handler from '../my-endpoint.js';

describe('my-endpoint', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = { method: 'POST', body: {} };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  it('should handle POST requests', async () => {
    await handler(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true });
  });
});
```

## Mocking

### Global Mocks

Global mocks are set up in [src/tests/setup.ts](src/tests/setup.ts):

```typescript
// Mock window.alert
global.alert = vi.fn();

// Mock window.BeePlugin
global.BeePlugin = {
  start: vi.fn(),
};

// Mock fetch
global.fetch = vi.fn();

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
```

### Mock Data

Reusable mock data is stored in [src/tests/mocks/handlers.ts](src/tests/mocks/handlers.ts):

```typescript
export const mockTemplate = {
  id: 'test-template-1',
  name: 'Test Template',
  json_data: { /* ... */ },
};
```

## Test Configuration

### vitest.config.ts

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
      ],
    },
  },
});
```

## Troubleshooting

### Tests Not Running

1. Ensure all dependencies are installed:
   ```bash
   npm install
   ```

2. Check that test files match the naming convention (`*.test.ts` or `*.test.tsx`)

### Import Errors

If you see module resolution errors:

1. Check the import paths in your test files
2. Ensure `vitest.config.ts` has the correct `resolve.alias` configuration

### Mock Issues

If mocks aren't working:

1. Clear mock calls with `vi.clearAllMocks()` in `beforeEach()`
2. Ensure mocks are set up before the test runs
3. Check that you're using `vi.fn()` instead of `jest.fn()`

### Coverage Not Generating

Ensure you have the coverage provider installed:

```bash
npm install --save-dev @vitest/coverage-v8
```

## CI/CD Integration

For continuous integration, use:

```bash
npm run test:run
```

This runs all tests once and exits with a status code:
- `0` = all tests passed
- `1` = one or more tests failed

### Example GitHub Actions Workflow

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm install
      - run: npm run test:run
      - run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Best Practices

1. **Write tests alongside code** - Create tests as you develop features
2. **Test behavior, not implementation** - Focus on what the code does, not how
3. **Use descriptive test names** - Make it clear what's being tested
4. **Keep tests independent** - Each test should run in isolation
5. **Mock external dependencies** - Don't rely on real APIs or databases
6. **Aim for high coverage** - Target 80%+ code coverage
7. **Test edge cases** - Include error conditions and boundary values

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Vitest API Reference](https://vitest.dev/api/)

---

For questions or issues with tests, please create an issue in the repository.

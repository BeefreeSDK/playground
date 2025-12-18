# Quick Test Guide

## Running Tests - Quick Commands

```bash
# Run all tests (watch mode)
npm test

# Run all tests once (for CI/CD)
npm run test:run

# Open visual test UI in browser
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Test Results

```
✅ 93 tests passing
✅ 8 test files
✅ Frontend: 71 tests
✅ Backend: 17 tests
✅ Duration: ~2 seconds
```

## What's Tested

### Frontend ✅
- **Services** (16 tests)
  - Local templates loading
  - Authentication API

- **Utils** (14 tests)
  - Export helpers
  - Template ID validation
  - Error handling

- **Components** (46 tests)
  - Export dropdown
  - Export result modal
  - HTML import modal

### Backend ✅
- **API Endpoints** (17 tests)
  - Beefree authentication
  - HTML importer
  - Error handling
  - Security validation

## Test File Locations

```
src/
  services/__tests__/
    ✅ localTemplates.test.ts (13 tests)
    ✅ api.test.ts (3 tests)

  utils/__tests__/
    ✅ exportHelpers.test.ts (14 tests)

  components/__tests__/
    ✅ ExportDropdown.test.tsx (12 tests)
    ✅ ExportResultModal.test.tsx (20 tests)
    ✅ HtmlImportModal.test.tsx (14 tests)

api/
  proxy/__tests__/
    ✅ bee-auth.test.js (6 tests)

  v1/__tests__/
    ✅ html-importer.test.js (11 tests)
```

## Coverage Reports

After running `npm run test:coverage`:

- **Terminal**: Shows coverage summary
- **HTML Report**: Open `coverage/index.html` in browser
- **JSON Report**: `coverage/coverage-final.json`

## Visual Test UI

Run `npm run test:ui` and open:
```
http://localhost:51204/__vitest__/
```

Features:
- 🎯 Click on tests to see details
- 📊 View test execution timeline
- 🔍 Search and filter tests
- 🐛 Debug failing tests
- 📈 See code coverage inline

## Writing New Tests

### Component Test Template
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Service Test Template
```typescript
import { describe, it, expect, vi } from 'vitest';
import { myService } from '../myService';

describe('myService', () => {
  it('should fetch data', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' })
    });

    const result = await myService.getData();
    expect(result).toEqual({ data: 'test' });
  });
});
```

## Troubleshooting

### Tests not running?
```bash
# Reinstall dependencies
npm install

# Clear cache
rm -rf node_modules .vitest
npm install
```

### Import errors?
Check that test files are in `__tests__` folders with `.test.ts` or `.test.tsx` extension.

### Mock not working?
Make sure to call `vi.clearAllMocks()` in `beforeEach()`:
```typescript
beforeEach(() => {
  vi.clearAllMocks();
});
```

## Documentation

📚 **Full documentation**: [TESTING.md](TESTING.md)
📊 **Test summary**: [TEST_SUMMARY.md](TEST_SUMMARY.md)

## Key Points

✅ All 93 tests passing
✅ Fast execution (~2 seconds)
✅ Easy to run (`npm test`)
✅ Visual UI available (`npm run test:ui`)
✅ Coverage reports (`npm run test:coverage`)
✅ Well documented (TESTING.md)

---

**Need help?** See [TESTING.md](TESTING.md) for complete guide.

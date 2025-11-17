/**
 * Mock data and handlers for tests
 */

export const mockTemplateIndex = {
  templates: [
    {
      id: 'test-template-1',
      name: 'Test Template 1',
      files: {
        json: '/templates/test-template-1.json',
        html: '/templates/exports/test-template-1.html',
        text: '/templates/exports/test-template-1.txt',
        pdf: '/templates/exports/test-template-1.pdf',
        image: '/templates/exports/test-template-1.png',
      },
    },
    {
      id: 'test-template-2',
      name: 'Test Template 2',
      files: {
        json: '/templates/test-template-2.json',
        html: '/templates/exports/test-template-2.html',
        text: '/templates/exports/test-template-2.txt',
        pdf: null,
        image: null,
      },
    },
  ],
  total: 2,
  exported_at: '2025-12-17T00:00:00Z',
};

export const mockTemplate = {
  id: 'test-template-1',
  name: 'Test Template 1',
  display_name: 'Test Display Name',
  title: 'Test Title',
  category: 'test-category',
  collection: 'test-collection',
  designer: 'test-designer',
  tags: ['test', 'mock'],
  thumbnail: '/thumbnails/test.png',
  json_data: {
    page: {
      body: {
        container: {
          style: {
            'background-color': '#fff',
          },
        },
        content: {
          computedStyle: {
            linkColor: '#0000EE',
            messageBackgroundColor: 'transparent',
            messageWidth: '650px',
          },
        },
      },
      rows: [],
    },
  },
};

export const mockHtmlContent = '<html><body><h1>Test Template</h1></body></html>';
export const mockPlainTextContent = 'Test Template\n\nThis is a test template.';

import type { BeefreeConfig } from '../types/beefree';

export const STATIC_EXPORT_WARNING =
  '⚠️ Warning: This will export the ORIGINAL template. Any changes you made in the editor will NOT be included.';

export const STATIC_EXPORT_CONSOLE_WARNING =
  '⚠️ Exported the original template. User edits are NOT included.';

export const DEFAULT_BEE_CONFIG: BeefreeConfig = {
  container: 'beefree-react-demo',
  language: 'en-US',
  sidebarPosition: 'left',
  trackChanges: true,
  rowDisplayConditions: [
    {
      type: 'Last ordered catalog',
      label: 'new',
      description: 'Only new client will see this',
      before: '{% if lastOrder.catalog == "New" %}',
      after: '{% endif %}',
    },
  ],
  rowsConfiguration: {
    externalContentURLs: [
      {
        name: 'External resource',
        value:
          'https://qa-bee-playground-backend.getbee.io/api/customrows?ids=1,2,3,4',
      },
    ],
  },
  mergeTags: [
    {
      name: 'first name',
      value: '[first-name]',
      previewValue: 'John',
    },
    {
      name: 'last name',
      value: '[last-name]',
      previewValue: 'Doe',
    },
    {
      name: 'email',
      value: '[email]',
      previewValue: 'john.doe@gmail.com',
    },
    {
      name: 'company',
      value: '[company]',
      previewValue: 'Company Srl',
    },
  ],
};

export const API_ENDPOINTS = {
  AUTH: '/proxy/bee-auth',
  HTML_IMPORTER: '/v1/html-importer',
} as const;

export const INITIAL_TEMPLATE_ID = 'beefree-sdk-demo-template';
export const MAX_PAYLOAD_SIZE = '50mb';
export const MAX_HTML_SIZE = 500000;

export const logger = {
  log: (...args: any[]) => {
    if (import.meta.env?.DEV) console.log(...args);
  },
  warn: (...args: any[]) => {
    if (import.meta.env?.DEV) console.warn(...args);
  },
  error: (...args: any[]) => {
    console.error(...args);
  },
};

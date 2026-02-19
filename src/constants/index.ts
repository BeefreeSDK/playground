import type { BeefreeConfig } from '../types/beefree';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

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
        value: `${BACKEND_URL}/api/customrows`,
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

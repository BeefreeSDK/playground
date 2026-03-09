import { IBeeConfig } from "@beefree.io/react-email-builder";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const CONTAINER_ID = 'beefree-react-demo';

export const DEFAULT_BEE_CONFIG: IBeeConfig = {
  container: CONTAINER_ID,
  language: 'en-US',
  sidebarPosition: 'left',
  uid: 'demo-user',
  rowDisplayConditions: [
    {
      type: 'Last ordered catalog',
      label: 'new',
      description: 'Only new client will see this',
      before: '{% if lastOrder.catalog == "New" %}',
      after: '{% endif %}',
      isActive: true,
    },
  ],
  rowsConfiguration: {
    externalContentURLs: [
      {
        name: 'External resource',
        handle: 'external-rows',
        isLocal: true,
      },
      {
        name: 'Public External resource',
        value: 'https://your-public-rows.endpoint',
      }
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
  AUTH: `${BACKEND_URL}/proxy/bee-auth`,
  HTML_IMPORTER: `${BACKEND_URL}/v1/html-importer`,
} as const;

export const INITIAL_TEMPLATE_ID = 'beefree-sdk-demo-template';

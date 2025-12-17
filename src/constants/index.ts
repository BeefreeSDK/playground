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
      type: 'Freemium',
      label: 'Only for Premium users',
      description: 'This row will show only for users with premium subscriptions',
      before: `<table style="width: 100%;" width="100%" border="0" cellpadding="0" cellspacing="0">
  <tbody><tr>
    <td style="padding-bottom: 20px; padding-left: 20px; padding-right: 20px; background-color: rgb(255, 255, 255);" align="center">
      <table style="width: 100%; max-width: 500px;" width="100%" border="0" cellpadding="0" cellspacing="0">
        <tbody><tr>
          <td style="color: rgb(68, 68, 68); font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 14px; line-height: 150%; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 5px;" align="center">
            <p style="padding: 0px; margin: 0px; word-break: break-word;">
              <span style="color: #FF3CAC;">This content is only available for <strong>PREMIUM</strong> users</span>
            </p>
          </td>
        </tr>
      </tbody></table>
    </td>
  </tr>
</tbody></table>`,
      after: ``,
    },
  ],
  rowsConfiguration: {
    emptyRows: true,
    externalContentURLs: [
      {
        name: 'Beefree Rows',
        value:
          'https://d1oco4z2z1fhwp.cloudfront.net/templates/default/rows/defaultrows_prod.json',
      },
    ],
  },
  mergeTags: [
    { name: 'tag 1', value: '[TAG_1]' },
    { name: 'tag 2', value: '[TAG_2]' },
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

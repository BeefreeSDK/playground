import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script to export templates from Beefree Template Catalog API
 * and generate all export formats (HTML, Plain Text, PDF, Image)
 */

const TEMPLATE_CATALOG_API_TOKEN = "7ce42633ce09fc281b0b775db559ae85df403e2f";
const CS_API_TOKEN = "9ae85df403e2f7ce42633ce09fc281b0b775db55";
const CS_AUTH = CS_API_TOKEN?.startsWith('Bearer ') ? CS_API_TOKEN : (CS_API_TOKEN ? `Bearer ${CS_API_TOKEN}` : '');

if (!TEMPLATE_CATALOG_API_TOKEN) {
  console.error('❌ TEMPLATE_CATALOG_API_TOKEN not configured');
  process.exit(1);
}

if (!CS_AUTH) {
  console.error('❌ CS_API_TOKEN not configured');
  process.exit(1);
}

async function fetchTemplates() {
  console.log('📥 Fetching templates from Template Catalog API...');

  const response = await axios.get(
    'https://api.getbee.io/v1/catalog/templates?limit=10',
    {
      headers: {
        'Authorization': `Bearer ${TEMPLATE_CATALOG_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );

  let templates = [];
  if (Array.isArray(response.data)) {
    templates = response.data;
  } else if (response.data.templates) {
    templates = response.data.templates;
  } else if (response.data.results) {
    templates = response.data.results;
  } else if (response.data.data) {
    templates = response.data.data;
  }

  console.log(`✅ Found ${templates.length} templates`);
  return templates.slice(0, 10);
}

async function fetchTemplateDetails(templateId) {
  console.log(`  📄 Fetching details for template: ${templateId}`);

  const response = await axios.get(
    `https://api.getbee.io/v1/catalog/templates/${templateId}`,
    {
      headers: {
        'Authorization': `Bearer ${TEMPLATE_CATALOG_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data;
}

async function convertToHtml(templateJson) {
  console.log('  🔄 Converting to HTML...');

  const payload = typeof templateJson === 'string' ? templateJson : JSON.stringify(templateJson);

  const response = await axios.post(
    'https://api.getbee.io/v1/message/html',
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': CS_AUTH
      }
    }
  );

  let html = response.data;
  if (typeof html === 'object' && html.body) {
    html = html.body.html || html.body.result || html.body;
  }

  return html;
}

async function convertToPlainText(templateJson) {
  console.log('  📝 Converting to Plain Text...');

  const payload = typeof templateJson === 'string' ? templateJson : JSON.stringify(templateJson);

  const response = await axios.post(
    'https://api.getbee.io/v1/message/plain-text',
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': CS_AUTH
      }
    }
  );

  return response.data;
}

async function convertToPdf(html) {
  console.log('  📄 Converting to PDF...');

  const response = await axios.post(
    'https://api.getbee.io/v1/message/pdf',
    JSON.stringify({
      html,
      page_size: 'Full',
      page_orientation: 'landscape'
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': CS_AUTH
      }
    }
  );

  // Extract URL from response
  const url = response.data?.body?.url || response.data?.url;

  if (!url) {
    throw new Error('No PDF URL in response');
  }

  // Download the PDF
  const pdfResponse = await axios.get(url, { responseType: 'arraybuffer' });
  return pdfResponse.data;
}

async function convertToImage(html) {
  console.log('  🖼️  Converting to Image...');

  const response = await axios.post(
    'https://api.getbee.io/v1/message/image',
    JSON.stringify({
      html,
      file_type: 'png',
      size: '1000'
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': CS_AUTH
      },
      responseType: 'arraybuffer'
    }
  );

  return response.data;
}

async function exportTemplates() {
  try {
    // Create output directories
    const templatesDir = path.join(__dirname, '../public/templates');
    const exportsDir = path.join(templatesDir, 'exports');

    [templatesDir, exportsDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    const exportedTemplates = [];

    // First, process the initial template.json file
    console.log('\n🔧 Processing initial template: template.json');
    try {
      const initialTemplatePath = path.join(__dirname, '../public/template.json');
      if (fs.existsSync(initialTemplatePath)) {
        const initialTemplateJson = JSON.parse(fs.readFileSync(initialTemplatePath, 'utf8'));
        const templateId = 'beefree-sdk-demo-template';

        // Convert to HTML
        const html = await convertToHtml(initialTemplateJson);

        // Convert to Plain Text
        const plainText = await convertToPlainText(initialTemplateJson);

        // Convert to PDF
        let pdfBuffer = null;
        try {
          pdfBuffer = await convertToPdf(html);
        } catch (err) {
          console.log(`  ⚠️  PDF generation failed: ${err.message}`);
        }

        // Convert to Image
        let imageBuffer = null;
        try {
          imageBuffer = await convertToImage(html);
        } catch (err) {
          console.log(`  ⚠️  Image generation failed: ${err.message}`);
        }

        // Save template metadata + json_data
        const templateData = {
          id: templateId,
          name: 'Beefree SDK Demo Template',
          display_name: 'Beefree SDK Demo Template',
          title: 'Beefree SDK Demo Template',
          json_data: initialTemplateJson
        };

        fs.writeFileSync(
          path.join(templatesDir, `${templateId}.json`),
          JSON.stringify(templateData, null, 2)
        );
        console.log(`  ✅ Saved JSON`);

        // Save HTML
        fs.writeFileSync(
          path.join(exportsDir, `${templateId}.html`),
          html
        );
        console.log(`  ✅ Saved HTML`);

        // Save Plain Text
        fs.writeFileSync(
          path.join(exportsDir, `${templateId}.txt`),
          plainText
        );
        console.log(`  ✅ Saved Plain Text`);

        // Save PDF
        if (pdfBuffer) {
          fs.writeFileSync(
            path.join(exportsDir, `${templateId}.pdf`),
            pdfBuffer
          );
          console.log(`  ✅ Saved PDF`);
        }

        // Save Image
        if (imageBuffer) {
          fs.writeFileSync(
            path.join(exportsDir, `${templateId}.png`),
            imageBuffer
          );
          console.log(`  ✅ Saved Image`);
        }

        exportedTemplates.push({
          id: templateId,
          name: templateData.name,
          files: {
            json: `${templateId}.json`,
            html: `exports/${templateId}.html`,
            text: `exports/${templateId}.txt`,
            pdf: pdfBuffer ? `exports/${templateId}.pdf` : null,
            image: imageBuffer ? `exports/${templateId}.png` : null
          }
        });

        console.log(`  ✅ Initial template exported successfully`);
      } else {
        console.log(`  ⚠️  Initial template.json not found, skipping`);
      }
    } catch (error) {
      console.error(`  ❌ Failed to export initial template:`, error.message);
    }

    // Fetch templates list from Template Catalog API
    const templates = await fetchTemplates();

    for (const template of templates) {
      const templateId = template.id || template.slug;
      console.log(`\n🔧 Processing template: ${templateId}`);

      try {
        // Fetch full template details
        const fullTemplate = await fetchTemplateDetails(templateId);
        const templateJson = fullTemplate.json_data || fullTemplate;

        if (!templateJson) {
          console.log(`  ⚠️  Skipping ${templateId} - no JSON data`);
          continue;
        }

        // Convert to HTML
        const html = await convertToHtml(templateJson);

        // Convert to Plain Text
        const plainText = await convertToPlainText(templateJson);

        // Convert to PDF
        let pdfBuffer = null;
        try {
          pdfBuffer = await convertToPdf(html);
        } catch (err) {
          console.log(`  ⚠️  PDF generation failed: ${err.message}`);
        }

        // Convert to Image
        let imageBuffer = null;
        try {
          imageBuffer = await convertToImage(html);
        } catch (err) {
          console.log(`  ⚠️  Image generation failed: ${err.message}`);
        }

        // Save JSON file (metadata + json_data)
        const templateData = {
          id: templateId,
          name: fullTemplate.title || fullTemplate.display_name || fullTemplate.name || templateId,
          display_name: fullTemplate.display_name || fullTemplate.title || fullTemplate.name,
          title: fullTemplate.title,
          category: fullTemplate.category,
          collection: fullTemplate.collection,
          designer: fullTemplate.designer,
          tags: fullTemplate.tags,
          thumbnail: fullTemplate.thumbnail,
          json_data: templateJson
        };

        fs.writeFileSync(
          path.join(templatesDir, `${templateId}.json`),
          JSON.stringify(templateData, null, 2)
        );
        console.log(`  ✅ Saved JSON`);

        // Save HTML
        fs.writeFileSync(
          path.join(exportsDir, `${templateId}.html`),
          html
        );
        console.log(`  ✅ Saved HTML`);

        // Save Plain Text
        fs.writeFileSync(
          path.join(exportsDir, `${templateId}.txt`),
          plainText
        );
        console.log(`  ✅ Saved Plain Text`);

        // Save PDF
        if (pdfBuffer) {
          fs.writeFileSync(
            path.join(exportsDir, `${templateId}.pdf`),
            pdfBuffer
          );
          console.log(`  ✅ Saved PDF`);
        }

        // Save Image
        if (imageBuffer) {
          fs.writeFileSync(
            path.join(exportsDir, `${templateId}.png`),
            imageBuffer
          );
          console.log(`  ✅ Saved Image`);
        }

        exportedTemplates.push({
          id: templateId,
          name: templateData.name,
          files: {
            json: `${templateId}.json`,
            html: `exports/${templateId}.html`,
            text: `exports/${templateId}.txt`,
            pdf: pdfBuffer ? `exports/${templateId}.pdf` : null,
            image: imageBuffer ? `exports/${templateId}.png` : null
          }
        });

      } catch (error) {
        console.error(`  ❌ Failed to export ${templateId}:`, error.message);
      }
    }

    // Create index file
    const indexPath = path.join(templatesDir, 'index.json');
    fs.writeFileSync(indexPath, JSON.stringify({
      templates: exportedTemplates,
      total: exportedTemplates.length,
      exported_at: new Date().toISOString()
    }, null, 2));

    console.log(`\n✅ Successfully exported ${exportedTemplates.length} templates`);
    console.log(`📁 Templates saved to: ${templatesDir}`);
    console.log(`📋 Index file: ${indexPath}`);

  } catch (error) {
    console.error('❌ Export failed:', error.message);
    process.exit(1);
  }
}

// Run the export
exportTemplates();

const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const { createGzip } = require('zlib');
const path = require('path');

// Base URL for your website
const BASE_URL = process.env.BASE_URL || 'https://logified.in';

// Define your website pages with metadata
const pages = [
  {
    url: '/',
    changefreq: 'weekly',
    priority: 1.0,
    lastmod: new Date().toISOString(),
    title: 'LOGIFIED SOLUTIONS - Complete Lifting Solutions',
    description: 'Complete lifting solutions for construction and industrial needs. Specializing in cranes, hoists, and lifting equipment.'
  },
  {
    url: '/about',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString(),
    title: 'About Us - LOGIFIED SOLUTIONS',
    description: 'Learn about LOGIFIED SOLUTIONS, your trusted partner for complete lifting solutions and construction equipment.'
  },
  {
    url: '/products',
    changefreq: 'weekly',
    priority: 0.9,
    lastmod: new Date().toISOString(),
    title: 'Products & Services - LOGIFIED SOLUTIONS',
    description: 'Explore our comprehensive range of lifting equipment, cranes, hoists, and construction solutions.'
  },
  {
    url: '/why-choose',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: new Date().toISOString(),
    title: 'Why Choose Us - LOGIFIED SOLUTIONS',
    description: 'Discover why LOGIFIED SOLUTIONS is the preferred choice for lifting equipment and construction solutions.'
  },
  {
    url: '/contact',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString(),
    title: 'Contact Us - LOGIFIED SOLUTIONS',
    description: 'Get in touch with LOGIFIED SOLUTIONS for all your lifting equipment and construction solution needs.'
  }
];

// Generate XML sitemap
async function generateXMLSitemap() {
  try {
    console.log('🚀 Generating XML sitemap...');
    
    const sitemap = new SitemapStream({
      hostname: BASE_URL,
      xmlns: {
        news: false,
        xhtml: true,
        image: false,
        video: false
      }
    });

    // Add each page to the sitemap
    pages.forEach(page => {
      sitemap.write({
        url: page.url,
        changefreq: page.changefreq,
        priority: page.priority,
        lastmod: page.lastmod
      });
    });

    sitemap.end();

    // Convert to buffer and save
    const buffer = await streamToPromise(sitemap);
    
    // Save uncompressed sitemap
    require('fs').writeFileSync('sitemap.xml', buffer);
    console.log('✅ XML sitemap saved as sitemap.xml');

    // Save compressed sitemap
    const gzip = createGzip();
    const writeStream = createWriteStream('sitemap.xml.gz');
    gzip.pipe(writeStream);
    gzip.write(buffer);
    gzip.end();
    
    console.log('✅ Compressed sitemap saved as sitemap.xml.gz');
    
    return buffer;
  } catch (error) {
    console.error('❌ Error generating XML sitemap:', error);
    throw error;
  }
}

// Generate HTML sitemap
function generateHTMLSitemap() {
  try {
    console.log('🚀 Generating HTML sitemap...');
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sitemap - LOGIFIED SOLUTIONS</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            padding: 40px 20px;
            text-align: center;
            margin-bottom: 40px;
            border-radius: 10px;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 600;
        }
        
        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .sitemap-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }
        
        .sitemap-card {
            background: white;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .sitemap-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .sitemap-card h3 {
            color: #007bff;
            margin-bottom: 15px;
            font-size: 1.3rem;
            font-weight: 600;
        }
        
        .sitemap-card p {
            color: #666;
            margin-bottom: 20px;
            line-height: 1.6;
        }
        
        .sitemap-card a {
            display: inline-block;
            background: #007bff;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: 500;
            transition: background 0.3s ease;
        }
        
        .sitemap-card a:hover {
            background: #0056b3;
        }
        
        .footer {
            text-align: center;
            padding: 30px 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .footer p {
            color: #666;
            margin-bottom: 10px;
        }
        
        .footer a {
            color: #007bff;
            text-decoration: none;
        }
        
        .footer a:hover {
            text-decoration: underline;
        }
        
        .meta-info {
            background: #e9ecef;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        
        .meta-info h3 {
            color: #495057;
            margin-bottom: 15px;
        }
        
        .meta-info ul {
            list-style: none;
            padding: 0;
        }
        
        .meta-info li {
            padding: 8px 0;
            border-bottom: 1px solid #dee2e6;
            color: #6c757d;
        }
        
        .meta-info li:last-child {
            border-bottom: none;
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .sitemap-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            
            .container {
                padding: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏗️ LOGIFIED SOLUTIONS</h1>
            <p>Complete Lifting Solutions - Website Sitemap</p>
        </div>
        
        <div class="meta-info">
            <h3>📊 Sitemap Information</h3>
            <ul>
                <li><strong>Total Pages:</strong> ${pages.length}</li>
                <li><strong>Last Updated:</strong> ${new Date().toLocaleString('en-IN', { 
                    timeZone: 'Asia/Kolkata',
                    dateStyle: 'full'
                })}</li>
                <li><strong>Base URL:</strong> <a href="${BASE_URL}" target="_blank">${BASE_URL}</a></li>
                <li><strong>XML Sitemap:</strong> <a href="/sitemap.xml" target="_blank">/sitemap.xml</a></li>
            </ul>
        </div>
        
        <div class="sitemap-grid">
            ${pages.map(page => `
                <div class="sitemap-card">
                    <h3>${page.title}</h3>
                    <p>${page.description}</p>
                    <a href="${page.url}" target="_blank">Visit Page</a>
                </div>
            `).join('')}
        </div>
        
        <div class="footer">
            <p>This sitemap was automatically generated for LOGIFIED SOLUTIONS</p>
            <p>For more information, visit <a href="${BASE_URL}">${BASE_URL}</a></p>
            <p>Generated on ${new Date().toLocaleString('en-IN', { 
                timeZone: 'Asia/Kolkata',
                dateStyle: 'full'
            })}</p>
        </div>
    </div>
</body>
</html>`;

    // Save HTML sitemap
    require('fs').writeFileSync('sitemap.html', html);
    console.log('✅ HTML sitemap saved as sitemap.html');
    
    return html;
  } catch (error) {
    console.error('❌ Error generating HTML sitemap:', error);
    throw error;
  }
}

// Generate robots.txt
function generateRobotsTxt() {
  try {
    console.log('🚀 Generating robots.txt...');
    
    const robotsTxt = `# LOGIFIED SOLUTIONS - Robots.txt
# Generated on ${new Date().toISOString()}

User-agent: *
Allow: /

# Sitemaps
Sitemap: ${BASE_URL}/sitemap.xml
Sitemap: ${BASE_URL}/sitemap.html

# Disallow admin or sensitive areas (if any)
# Disallow: /admin/
# Disallow: /private/

# Crawl delay (optional)
# Crawl-delay: 1

# Contact
# For questions about this robots.txt file, please contact us at kirtanskh@gmail.com`;

    require('fs').writeFileSync('robots.txt', robotsTxt);
    console.log('✅ robots.txt saved as robots.txt');
    
    return robotsTxt;
  } catch (error) {
    console.error('❌ Error generating robots.txt:', error);
    throw error;
  }
}

// Main function to generate all sitemap files
async function generateAllSitemaps() {
  try {
    console.log('🚀 Starting sitemap generation for LOGIFIED SOLUTIONS...');
    console.log(`🌐 Base URL: ${BASE_URL}`);
    console.log(`📅 Generated on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
    console.log('');
    
    // Generate all sitemap files
    await generateXMLSitemap();
    generateHTMLSitemap();
    generateRobotsTxt();
    
    console.log('');
    console.log('🎉 All sitemap files generated successfully!');
    console.log('');
    console.log('📁 Generated files:');
    console.log('   • sitemap.xml (XML sitemap)');
    console.log('   • sitemap.xml.gz (Compressed XML sitemap)');
    console.log('   • sitemap.html (HTML sitemap)');
    console.log('   • robots.txt (Search engine directives)');
    console.log('');
    console.log('🔗 Next steps:');
    console.log('   1. Upload these files to your website root directory');
    console.log('   2. Submit your sitemap to Google Search Console');
    console.log('   3. Submit your sitemap to Bing Webmaster Tools');
    console.log('   4. Add sitemap links to your website footer');
    console.log('');
    console.log('📧 For support: kirtanskh@gmail.com');
    
  } catch (error) {
    console.error('❌ Failed to generate sitemaps:', error);
    process.exit(1);
  }
}

// Export functions for use in other files
module.exports = {
  generateXMLSitemap,
  generateHTMLSitemap,
  generateRobotsTxt,
  generateAllSitemaps,
  pages
};

// Run if this file is executed directly
if (require.main === module) {
  generateAllSitemaps();
}

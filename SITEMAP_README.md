# Sitemap Generator for LOGIFIED SOLUTIONS

This project includes an automated sitemap generator that creates comprehensive sitemaps for your LOGIFIED SOLUTIONS website.

## 🚀 Quick Start

Generate all sitemap files with one command:

```bash
npm run sitemap
```

## 📁 Generated Files

The sitemap generator creates the following files:

1. **`sitemap.xml`** - Standard XML sitemap for search engines
2. **`sitemap.xml.gz`** - Compressed version of the XML sitemap
3. **`sitemap.html`** - Human-readable HTML sitemap
4. **`robots.txt`** - Search engine directives

## 🌐 Included Pages

The sitemap automatically includes all your main website pages:

- **Home** (`/`) - Priority: 1.0, Change Frequency: Weekly
- **About** (`/about`) - Priority: 0.8, Change Frequency: Monthly
- **Products** (`/products`) - Priority: 0.9, Change Frequency: Weekly
- **Why Choose Us** (`/why-choose`) - Priority: 0.7, Change Frequency: Monthly
- **Contact** (`/contact`) - Priority: 0.8, Change Frequency: Monthly

## ⚙️ Configuration

### Base URL
Set your website's base URL using the `BASE_URL` environment variable:

```bash
export BASE_URL="https://logified.in"
```

Or modify the default URL in `generate-sitemap.js`:

```javascript
const BASE_URL = process.env.BASE_URL || 'https://logified.in';
```

### Customizing Pages
To add, remove, or modify pages, edit the `pages` array in `generate-sitemap.js`:

```javascript
const pages = [
  {
    url: '/your-new-page',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString(),
    title: 'Your Page Title',
    description: 'Your page description'
  }
  // ... other pages
];
```

## 🔧 Manual Usage

You can also use the sitemap generator programmatically:

```javascript
const { generateAllSitemaps } = require('./generate-sitemap');

// Generate all sitemaps
generateAllSitemaps();

// Or generate individual sitemaps
const { generateXMLSitemap, generateHTMLSitemap, generateRobotsTxt } = require('./generate-sitemap');
```

## 📤 Deployment

1. **Upload Files**: Upload the generated sitemap files to your website's root directory
2. **Verify Access**: Ensure the files are accessible at:
   - `https://yourdomain.com/sitemap.xml`
   - `https://yourdomain.com/sitemap.html`
   - `https://yourdomain.com/robots.txt`

3. **Submit to Search Engines**:
   - **Google Search Console**: Submit your sitemap URL
   - **Bing Webmaster Tools**: Submit your sitemap URL
   - **Other Search Engines**: Check their webmaster tools

**Your sitemap URLs:**
- XML Sitemap: `https://logified.in/sitemap.xml`
- HTML Sitemap: `https://logified.in/sitemap.html`
- Robots.txt: `https://logified.in/robots.txt`

## 🔍 Testing

Test your sitemap locally:

```bash
# Start your server
npm start

# Access sitemap files
curl http://localhost:3000/sitemap.xml
curl http://localhost:3000/sitemap.html
curl http://localhost:3000/robots.txt
```

## 📊 Sitemap Validation

Validate your XML sitemap using online tools:
- [Google Sitemap Validator](https://www.google.com/webmasters/tools/)
- [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)

## 🎯 SEO Benefits

- **Better Crawling**: Helps search engines discover all your pages
- **Faster Indexing**: Provides clear page hierarchy and update frequency
- **Improved Rankings**: Shows search engines your content structure
- **User Experience**: HTML sitemap helps visitors navigate your site

## 🔄 Automation

### Scheduled Generation
Set up a cron job to regenerate sitemaps regularly:

```bash
# Regenerate sitemaps daily at 2 AM
0 2 * * * cd /path/to/your/project && npm run sitemap
```

### CI/CD Integration
Add sitemap generation to your deployment pipeline:

```yaml
# Example GitHub Actions step
- name: Generate Sitemap
  run: npm run sitemap
- name: Deploy Sitemap
  run: # your deployment commands
```

## 🛠️ Troubleshooting

### Common Issues

1. **Permission Errors**: Ensure write permissions in your project directory
2. **Missing Dependencies**: Run `npm install` to install required packages
3. **Base URL Issues**: Verify your `BASE_URL` environment variable is set correctly

### Debug Mode
Add logging to troubleshoot issues:

```javascript
// In generate-sitemap.js
console.log('Debug: Base URL:', BASE_URL);
console.log('Debug: Pages:', pages);
```

## 📞 Support

For questions or issues with the sitemap generator:
- **Email**: kirtanskh@gmail.com
- **Project**: LOGIFIED SOLUTIONS Contact Server

## 📝 License

This sitemap generator is part of the LOGIFIED SOLUTIONS project and follows the same license terms.

---

**Last Updated**: August 15, 2025  
**Version**: 1.0.0  
**Author**: LOGIFIED SOLUTIONS

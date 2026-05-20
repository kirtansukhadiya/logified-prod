require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const exphbs = require('express-handlebars');
const axios = require('axios');
const { sendContactEmail, verifyEmailConfig } = require('./email');

const app = express();
const port = process.env.PORT || 3000;

// Configure Handlebars
const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    // Helper to check if current page is active
    isActive: function(page, currentPage) {
      return page === currentPage ? 'active' : '';
    },
    // Helper to format current year
    currentYear: function() {
      return new Date().getFullYear();
    },
    // Helper for equality comparison
    eq: function(a, b) {
      return a === b;
    }
  }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files
app.use('/css', express.static(path.join(__dirname, '/css')));
app.use('/js', express.static(path.join(__dirname, '/js')));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/assets', express.static(path.join(__dirname, '/public/assets')));

const galleryDir = [path.join(__dirname, 'Gallery'), path.join(__dirname, 'gallery')]
  .find((dir) => fs.existsSync(dir));
if (galleryDir) {
  app.use('/gallery', express.static(galleryDir));
}

function getGalleryImages() {
  if (!galleryDir) return [];

  const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif']);
  return fs.readdirSync(galleryDir)
    .filter((file) => imageExtensions.has(path.extname(file).toLowerCase()))
    .sort()
    .map((file, index) => ({
      src: `/gallery/${encodeURIComponent(file)}`,
      alt: `LOGIFIED lifting equipment ${index + 1}`
    }));
}

// Serve sitemap files
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

app.get('/sitemap.html', (req, res) => {
  res.header('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, 'sitemap.html'));
});

app.get('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

app.get('/manifest.json', (req, res) => {
  res.header('Content-Type', 'application/json');
  res.sendFile(path.join(__dirname, 'public/manifest.json'));
});

// Verify email configuration at startup
verifyEmailConfig().then((status) => {
  if (status.ready) {
    console.log(`✅ Email ready (${status.provider}) → ${status.to}`);
  } else {
    console.error('❌ Email not configured:', status.reason || 'missing_credentials');
    console.error('   Set EMAIL_USER and EMAIL_PASS (Gmail App Password)');
  }
});

// Routes
app.get('/', (req, res) => {
  const galleryImages = getGalleryImages();
  res.render('home', {
    title: 'LOGIFIED SOLUTIONS - Complete Lifting Solutions | India\'s Premier Lifting Equipment Manufacturer',
    description: 'LOGIFIED SOLUTIONS is India\'s leading manufacturer of lifting equipment including EOT Cranes, Gantry Cranes, Jib Cranes, and Chain & Wire Rope Hoists. Custom engineering, fast delivery, and 24/7 support.',
    keywords: 'LOGIFIED SOLUTIONS, lifting equipment, cranes, hoists, EOT cranes, gantry cranes, jib cranes, India, manufacturer, industrial lifting, construction equipment, custom engineering',
    currentPage: 'home',
    url: req.url,
    previewImages: galleryImages.slice(0, 4)
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About LOGIFIED SOLUTIONS | Leading Lifting Equipment Manufacturer in India',
    description: 'Learn about LOGIFIED SOLUTIONS, India\'s trusted manufacturer of lifting equipment with 12,000 sq. ft. facility, custom engineering, and expert support.',
    keywords: 'LOGIFIED SOLUTIONS about, lifting equipment manufacturer India, crane manufacturer, industrial lifting company',
    currentPage: 'about',
    url: req.url
  });
});

app.get('/products', (req, res) => {
  res.render('products', {
    title: 'LOGIFIED SOLUTIONS Products & Services | EOT Cranes, Gantry Cranes, Jib Cranes',
    description: 'Explore LOGIFIED SOLUTIONS comprehensive range of lifting equipment: EOT Cranes, Gantry Cranes, Jib Cranes, Chain & Wire Rope Hoists with custom engineering.',
    keywords: 'LOGIFIED SOLUTIONS products, EOT cranes, gantry cranes, jib cranes, lifting equipment, industrial cranes',
    currentPage: 'products',
    url: req.url
  });
});

app.get('/product-gallery', (req, res) => {
  res.render('product-gallery', {
    title: 'Product Gallery | LOGIFIED SOLUTIONS Lifting Equipment',
    description: 'Browse LOGIFIED SOLUTIONS product gallery featuring EOT cranes, gantry cranes, hoists, and industrial lifting equipment installations.',
    keywords: 'LOGIFIED SOLUTIONS gallery, lifting equipment photos, crane installations, industrial cranes India',
    currentPage: 'product-gallery',
    url: req.url,
    images: getGalleryImages()
  });
});

app.get('/why-choose', (req, res) => {
  res.render('why-choose', {
    title: 'Why Choose LOGIFIED SOLUTIONS | Leading Lifting Equipment Manufacturer',
    description: 'Discover why LOGIFIED SOLUTIONS is the preferred choice for lifting equipment: custom engineering, fast delivery, 24/7 support, and 12,000 sq. ft. facility.',
    keywords: 'LOGIFIED SOLUTIONS why choose, best crane manufacturer, lifting equipment company, industrial crane supplier',
    currentPage: 'why-choose',
    url: req.url
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact LOGIFIED SOLUTIONS | Get Free Quote for Lifting Equipment',
    description: 'Contact LOGIFIED SOLUTIONS for free consultation and quotes on lifting equipment. Expert team available for EOT Cranes, Gantry Cranes, and custom solutions.',
    keywords: 'LOGIFIED SOLUTIONS contact, lifting equipment quote, crane manufacturer contact, free consultation',
    currentPage: 'contact',
    url: req.url
  });
});

// Contact form endpoint
app.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all required fields (Name, Email, and Message)' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid email address' 
      });
    }

    const result = await sendContactEmail({ name, email, phone, message });

    console.log(`📧 Email sent via ${result.provider} from ${name} (${email}) ${phone ? `- Phone: ${phone}` : ''}`);
    
    res.status(200).json({ 
      success: true, 
      message: 'Thank you for contacting LOGIFIED SOLUTIONS! Your message has been sent successfully. We\'ll get back to you within 24 hours.' 
    });

  } catch (error) {
    console.error('❌ Error sending email:', error.message || error);

    if (error.code === 'EMAIL_NOT_CONFIGURED') {
      return res.status(503).json({
        success: false,
        message: 'Contact form is temporarily unavailable. Please email us directly at info.logified@gmail.com.'
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Sorry, there was an error sending your message. Please try again or contact us directly at info.logified@gmail.com.' 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'LOGIFIED SOLUTIONS Unified Server'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).render('404', {
    title: 'Page Not Found - LOGIFIED SOLUTIONS',
    currentPage: '404'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('🚨 Server error:', error);
  res.status(500).render('error', {
    title: 'Server Error - LOGIFIED SOLUTIONS',
    currentPage: 'error',
    error: error.message
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 LOGIFIED SOLUTIONS Unified Server running on port ${port}`);
  verifyEmailConfig().then((emailStatus) => {
    console.log(`📧 Email: ${emailStatus.ready ? `ready (${emailStatus.provider})` : 'NOT configured'}`);
  });
  console.log(`🌐 Website: http://localhost:${port}`);
  console.log(`📝 Contact endpoint: http://localhost:${port}/contact`);
  console.log(`🔍 Health check: http://localhost:${port}/health`);
});

  // Self-pinging function
const SELF_URL = process.env.SELF_URL || 'https://logified.in/health';
  setInterval(async () => {
    try {
      await axios.get(SELF_URL);
      console.log(`🔄 Self-pinged: ${SELF_URL}`);
    } catch (err) {
      console.error('⚠️ Self-ping failed:', err.message);
    }
  }, 10 * 60 * 1000); // every 10 minutes
  

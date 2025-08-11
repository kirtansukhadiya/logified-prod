require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const exphbs = require('express-handlebars');

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
app.use('/assets', express.static(path.join(__dirname, '/assets')));

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
    console.error('❌ Email user:', process.env.EMAIL_USER);
    console.error('❌ Email pass length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Routes
app.get('/', (req, res) => {
  res.render('home', {
    title: 'LOGIFIED SOLUTIONS - Complete Lifting Solutions',
    currentPage: 'home'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Us - LOGIFIED SOLUTIONS',
    currentPage: 'about'
  });
});

app.get('/products', (req, res) => {
  res.render('products', {
    title: 'Products & Services - LOGIFIED SOLUTIONS',
    currentPage: 'products'
  });
});

app.get('/why-choose', (req, res) => {
  res.render('why-choose', {
    title: 'Why Choose Us - LOGIFIED SOLUTIONS',
    currentPage: 'why-choose'
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us - LOGIFIED SOLUTIONS',
    currentPage: 'contact'
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

    // Email options
    const mailOptions = {
      from: `"LOGIFIED SOLUTIONS" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `🏗️ New Inquiry from ${name} - LOGIFIED SOLUTIONS`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
          <div style="background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #007bff, #0056b3); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">
                🏗️ LOGIFIED SOLUTIONS
              </h1>
              <p style="color: #e3f2fd; margin: 10px 0 0 0; font-size: 16px;">
                New Contact Form Inquiry
              </p>
            </div>
            
            <div style="padding: 30px;">
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Contact Details</h3>
                <p style="margin: 8px 0; color: #555;">
                  <strong style="color: #333;">👤 Name:</strong> ${name}
                </p>
                <p style="margin: 8px 0; color: #555;">
                  <strong style="color: #333;">📧 Email:</strong> 
                  <a href="mailto:${email}" style="color: #007bff; text-decoration: none;">${email}</a>
                </p>
                ${phone ? `
                <p style="margin: 8px 0; color: #555;">
                  <strong style="color: #333;">📱 Phone:</strong> 
                  <a href="tel:${phone}" style="color: #007bff; text-decoration: none;">${phone}</a>
                </p>
                ` : ''}
              </div>
              
              <div style="background: #fff; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px;">
                <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">💬 Message</h3>
                <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; border-radius: 4px; line-height: 1.6; color: #555;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                <p style="color: #666; font-size: 14px; margin: 0;">
                  🕒 Received on ${new Date().toLocaleString('en-IN', { 
                    timeZone: 'Asia/Kolkata',
                    dateStyle: 'full',
                    timeStyle: 'short'
                  })}
                </p>
                <p style="color: #666; font-size: 12px; margin: 10px 0 0 0;">
                  Sent from LOGIFIED SOLUTIONS contact form
                </p>
              </div>
            </div>
          </div>
        </div>
      `,
      text: `
        LOGIFIED SOLUTIONS - New Contact Form Inquiry
        ============================================
        
        Contact Details:
        Name: ${name}
        Email: ${email}
        ${phone ? `Phone: ${phone}` : ''}
        
        Message:
        ${message}
        
        ============================================
        Received on: ${new Date().toLocaleString('en-IN', { 
          timeZone: 'Asia/Kolkata',
          dateStyle: 'full',
          timeStyle: 'short'
        })}
        Sent from LOGIFIED SOLUTIONS contact form
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    console.log(`📧 Email sent from ${name} (${email}) ${phone ? `- Phone: ${phone}` : ''}`);
    
    res.status(200).json({ 
      success: true, 
      message: 'Thank you for contacting LOGIFIED SOLUTIONS! Your message has been sent successfully. We\'ll get back to you within 24 hours.' 
    });

  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sorry, there was an error sending your message. Please try again or contact us directly at kirtanskh@gmail.com.' 
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
  console.log(`📧 Email configured for: ${process.env.EMAIL_USER}`);
  console.log(`🌐 Website: http://localhost:${port}`);
  console.log(`📝 Contact endpoint: http://localhost:${port}/contact`);
  console.log(`🔍 Health check: http://localhost:${port}/health`);
});

# LOGIFIED SOLUTIONS - Unified Server

This is a unified Node.js server that serves both the website HTML pages and handles the contact form functionality using Handlebars (HBS) templating.

## Features

- **Unified Server**: Single server handles both website serving and contact form processing
- **Handlebars Templating**: Uses HBS for dynamic HTML generation
- **Contact Form**: Email functionality for customer inquiries
- **Static File Serving**: Serves CSS, JavaScript, and image assets
- **Responsive Design**: Mobile-friendly website templates

## Project Structure

```
contact-server/
├── views/
│   ├── layouts/
│   │   └── main.hbs          # Main layout template
│   ├── home.hbs              # Home page template
│   ├── about.hbs             # About page template
│   ├── products.hbs          # Products page template
│   ├── why-choose.hbs        # Why Choose Us page template
│   ├── contact.hbs           # Contact page template
│   ├── 404.hbs              # 404 error page
│   └── error.hbs             # Server error page
├── server.js                 # Main server file
├── package.json              # Dependencies
└── README.md                 # This file
```

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the project root (see `env.example`):
   ```env
   PORT=3000
   EMAIL_USER=info.logified@gmail.com
   EMAIL_PASS=your-16-char-gmail-app-password
   SELF_URL=https://logified.in/health
   ```

3. **Start the Server**:
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## Server Routes

- `GET /` - Home page
- `GET /about` - About Us page
- `GET /products` - Products & Services page
- `GET /why-choose` - Why Choose Us page
- `GET /contact` - Contact Us page
- `POST /contact` - Contact form submission
- `GET /health` - Health check endpoint

## Static Assets

The server serves static files from the parent directory:
- `/css/*` - CSS files
- `/js/*` - JavaScript files
- `/public/assets/*` - Images and other assets

## Email Configuration

The contact form sends mail directly through **Gmail SMTP**.

1. Enable 2-factor authentication on your Gmail account
2. Create an **App Password**: Google Account → Security → App passwords
3. Set `EMAIL_USER` and `EMAIL_PASS` in `.env` (local) and in your **Render** environment variables (production)
4. Optionally set `CONTACT_TO` if inquiries should go to a different inbox than `EMAIL_USER`

On Render, add `EMAIL_USER` and `EMAIL_PASS` under Environment, then redeploy.

## Development

- **Auto-restart**: Use `npm run dev` for development with nodemon
- **Port**: Default port is 3000, configurable via environment variable
- **Templates**: All HTML templates are now Handlebars files in the `views/` directory

## Deployment

1. Ensure all dependencies are installed
2. Set up environment variables
3. Use a process manager like PM2 for production
4. Configure reverse proxy (nginx/Apache) if needed

## Notes

- All HTML files have been converted to Handlebars templates
- The server now serves the entire website, not just the contact form
- Navigation links have been updated to use relative paths
- The contact form now submits to the same server (no CORS issues)
# logified-prod

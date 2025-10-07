# Barry Rutherford Author Site

A lightweight, author-first personal website for barryrutherford.com. Single-page design featuring Barry's books & writing, Malestrum podcast, and consulting services through Rutherford Creative Media (RCM) and R&C Consulting.

## 🎯 Features

- **Framework-free**: Pure HTML, CSS, and JavaScript
- **Mobile-first responsive design** with hamburger menu
- **Accessibility-focused** with semantic HTML and ARIA labels
- **Fast performance** with optimized assets and lazy loading
- **Railway static hosting** ready with proper configuration
- **SEO optimized** with meta tags and structured content

## 📁 Project Structure

```
br-site/
├── index.html              # Main single-page site
├── assets/
│   ├── styles.css          # Responsive CSS with custom properties
│   ├── app.js             # Mobile menu & smooth scrolling functionality
│   └── images/            # Book covers and visual assets
│       ├── .gitkeep           # Placeholder - replace with actual images
│       ├── atl-cover.png      # TODO: A Tactical Life memoir cover
│       ├── elias-series.png   # TODO: Elias thriller series cover
│       ├── adams-night-cover.png  # TODO: Adam's Night novel cover
│       └── malestrum-tile.png     # TODO: Malestrum podcast logo/tile
├── static.json            # Railway static hosting config
└── README.md             # This file
```

## 🚀 Quick Start (Local Development)

1. **Clone or download** the br-site folder
2. **Open index.html** in your browser, or
3. **Run a local server** (recommended):
   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js (if you have npx)
   npx serve .

   # PHP
   php -S localhost:8000
   ```
4. **Visit** http://localhost:8000

## 📦 Deployment to Railway

### Step 1: GitHub Setup

1. **Create a new GitHub repository**:
   - Go to https://github.com/new
   - Repository name: `br-site` (or `barryrutherford-site`)
   - Make it public or private
   - Don't initialize with README (files already exist)

2. **Push your code**:
   ```bash
   cd br-site
   git init
   git add .
   git commit -m "Initial Barry Rutherford author site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/br-site.git
   git push -u origin main
   ```

### Step 2: Railway Deployment

1. **Go to Railway Dashboard**: https://railway.app/dashboard
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Choose your `br-site` repository**
5. **Railway will auto-detect** it's a static site (thanks to `static.json`)
6. **No environment variables needed** for basic deployment
7. **Domain will be** something like `br-site-production.up.railway.app`

### Step 3: Custom Domain Setup

1. **In Railway Dashboard**:
   - Go to your project → Settings → Domains
   - Click "Custom Domain"
   - Add `barryrutherford.com` and `www.barryrutherford.com`

2. **Railway will provide** CNAME/A record values

## 🌐 DNS Configuration

### Namecheap DNS (for barryrutherford.com)

1. **Login to Namecheap** → Manage domain → Advanced DNS
2. **Add these records**:
   ```
   Type    Host    Value                           TTL
   CNAME   www     your-railway-domain.railway.app   300
   ALIAS   @       your-railway-domain.railway.app   300
   ```

   *If ALIAS isn't available, use A record with Railway's IP*

3. **Redirect apex to www** (optional):
   ```
   Type         Host    Value               TTL
   URL Redirect @       https://www.barryrutherford.com   300
   ```

### GoDaddy Forwarding (R&C Domain)

If you have a separate R&C domain (like rutherfordcompany.com):

1. **Login to GoDaddy** → My Products → Domains
2. **Click your R&C domain** → Manage
3. **Forwarding** → Domain → Add Forward
4. **Forward to**: `https://barryrutherford.com/#consulting`
5. **Forward type**: Permanent (301)
6. **Settings**: Forward only

## 🖼️ Swapping Placeholder Images

### Book Covers & Assets

Replace these placeholder files in `assets/images/`:

1. **`malestrum-tile.png`**: Malestrum podcast logo/tile (300x300px recommended for the featured section)

### Image Notes

The current site design is text-focused and doesn't require many images. The main visual element needed is:
- Malestrum podcast logo/tile for the featured section (`malestrum-tile.png`)

Book covers and other imagery are referenced in the content but not displayed as images in the current design.

### Optimizing Images

- **Format**: Use WebP with JPG/PNG fallbacks for best performance
- **Size**: Compress images (try tinypng.com or squoosh.app)
- **Dimensions**: Malestrum tile: 300x300px recommended

## 🔗 Updating Social Links

The social links are already configured in the footer section:

```html
<div class="socials">
  <a href="https://linkedin.com/in/barryrutherford" target="_blank" rel="noopener noreferrer">LinkedIn</a>
  <a href="https://youtube.com/@malestrum" target="_blank" rel="noopener noreferrer">YouTube</a>
  <a href="https://substack.com/@barryrutherford" target="_blank" rel="noopener noreferrer">Substack</a>
  <a href="https://bsky.app/profile/barryrutherford.com" target="_blank" rel="noopener noreferrer">Bluesky</a>
  <a href="https://instagram.com/barryrutherford" target="_blank" rel="noopener noreferrer">Instagram</a>
</div>
```

Update these URLs as needed when the actual social profiles are confirmed.

## ✏️ Content Editing Guide

### Updating CTAs and Links

**Current working links in the site:**
```html
<!-- Malestrum link -->
<a href="https://malestrum.com" target="_blank" rel="noopener noreferrer">Visit Malestrum</a>

<!-- R&C Consulting link -->
<a href="https://rutherfordcreativemedia.com/#rutherford-company" target="_blank" rel="noopener noreferrer">Explore R&C</a>
```

**Content delivery CTAs currently point to contact form:**
Most CTAs for reading excerpts and content currently direct to the `#contact` section for email signup. Update these when actual content pages are available.

### Key Content Areas

The site features sections for:

1. **Hero**: "From 8 Million Miles in Boardrooms to Stories That Matter"
2. **About**: Barry's background and three main works (ATL, Adam's Night, Elias)
3. **Works**: Reading excerpts and book details
4. **Malestrum**: Podcast platform
5. **Consulting**: RCM umbrella and R&C consulting services
6. **Contact**: Newsletter signup form

### Newsletter Signup

The contact form is set up for basic validation but needs backend integration. Consider services like:
- Netlify Forms (for Netlify hosting)
- Formspree
- ConvertKit
- Mailchimp

### Meta Tags

The site already has optimized meta tags:
```html
<title>Barry Rutherford — Author • Podcaster • RCM</title>
<meta name="description" content="Barry Rutherford — author of fiction & nonfiction, host of Malestrum, and founder of Rutherford Creative Media (RCM). R&C is our consulting arm for AI strategy and implementation.">
```

These are ready for production.

## 🎨 Styling Customization

### Color Scheme

Colors are defined in CSS custom properties in `assets/styles.css`:

```css
:root {
  --bg: #0e0f12;        /* Dark background */
  --panel: #15171c;     /* Card backgrounds */
  --text: #e9ecf1;      /* Main text */
  --muted: #8a90a2;     /* Secondary text */
  --acc: #7cc4ff;       /* Primary accent (blue) */
  --acc2: #ffd166;      /* Secondary accent (yellow) */
}
```

### Typography

The site uses Inter font family. To change:
1. Update the Google Fonts link in `index.html`
2. Change `--font-family` in `styles.css`

### Layout Adjustments

- **Max width**: Change `--max-width: 1120px` in CSS
- **Spacing**: Modify padding/margin values in `.section`, `.container`
- **Grid layouts**: Adjust `.cols-2`, `.cols-3` breakpoints

## 🔧 Technical Notes

### Performance
- Images lazy load automatically
- CSS/JS are minified for production
- Railway CDN handles caching

### SEO
- Semantic HTML structure
- Meta tags for social sharing
- Sitemap can be added as `sitemap.xml`

### Analytics
To add Google Analytics, insert before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### Newsletter Integration
The contact form includes name and email fields with validation. To connect to a service:
1. Choose a service (ConvertKit, Mailchimp, Formspree)
2. Update the form action and method attributes
3. Add any required hidden fields for the service

## 🐛 Troubleshooting

### Railway Deployment Issues
- Check that `static.json` is in the root directory
- Verify file paths are correct (case-sensitive on Unix)
- Review Railway build logs for errors

### DNS Propagation
- DNS changes can take 24-48 hours to propagate globally
- Use `dig` or online DNS checkers to verify changes
- Clear browser cache if seeing old content

### Mobile Menu Not Working
- Check that `assets/app.js` is loading correctly
- Verify JavaScript console for errors
- Ensure viewport meta tag is present

## 📝 License

Copyright 2025 Barry Rutherford. All rights reserved.

---

**Need help?** Contact: barry@barryrutherford.com
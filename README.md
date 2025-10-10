# Rutherford Creative Media Website

A contemporary, professional website for Barry Rutherford's creative, media, and consulting umbrella brand.

## Overview

This website serves as the digital home for Rutherford Creative Media (RCM), showcasing:
- Barry Rutherford's transition from global CEO to creative media leader
- Links to key platforms: Malestrum and Rutherford & Company
- Featured creative works including fiction and memoir excerpts
- Team bios for Barry and Griffin Rutherford

## Features

### Design
- Contemporary, uncluttered design with modern typography
- Professional color palette and responsive layout
- Strong visual hero section with animated gradients
- Smooth scrolling and fade-in animations

### Content Sections
1. **Hero Section** - Brand introduction and tagline
2. **About (RCM Introduction)** - Brand positioning and philosophy
3. **Projects** - Links to external platforms (Malestrum, Rutherford & Company)
4. **Works** - Creative excerpts featuring:
   - Elias Vance thriller series
   - A Tactical Life memoir (Serendipity chapter)
5. **Team** - Bios for Barry and Griffin Rutherford

### Technical Features
- Fully responsive design (mobile-first approach)
- Optimized performance with throttled scroll events
- Intersection Observer for efficient animations
- Modern CSS with Grid and Flexbox
- Progressive enhancement with JavaScript
- Accessibility-focused design

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # All CSS styles and responsive design
├── script.js           # JavaScript functionality and interactions
└── README.md           # This documentation file
```

## Typography

- **Headers**: Playfair Display (serif) - elegant, literary feel
- **Body Text**: Inter (sans-serif) - clean, modern readability
- Professional color scheme with blue accent (#3498db)

## Editable Content Blocks

### Key Content Sections (easily editable in index.html):

1. **Hero Content** (lines 42-44)
   - Main title, tagline, and description

2. **RCM Introduction** (lines 54-62)
   - Brand positioning and philosophy

3. **Elias Vance Fiction** (lines 108-119)
   - Hook line, genre, and teaser copy
   - Specific content: "Haunted by injuries that never healed and secrets that refuse to stay buried..."

4. **A Tactical Life Memoir** (lines 122-130)
   - Chapter title and excerpt
   - Specific content: "Looking back across five decades of business and life..."

5. **Barry Rutherford Bio** (lines 150-152)
   - Professional background and current focus

6. **Griffin Rutherford Bio** (lines 167-169)
   - Gen Z perspective and current projects

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive enhancement for older browsers

## Performance

- Optimized images and assets
- Throttled scroll events for smooth performance
- Efficient CSS animations
- Minimal JavaScript footprint

## Deployment

This is a static website that can be deployed to any web server or hosting platform:
- Upload all files to web server
- Ensure proper MIME types for CSS and JS files
- No server-side dependencies required

## Customization

### Colors
Primary blue: `#3498db`
Text colors: `#2c3e50`, `#5a6c7d`, `#34495e`
Background: `#ffffff`, `#f8f9fa`

### Fonts
Import from Google Fonts (already included):
- Inter: 300, 400, 500, 600, 700
- Playfair Display: 400, 500, 600, 700

### Animation Timing
- Fade-in duration: 0.6s
- Hover transitions: 0.3s
- Parallax scroll rate: -0.3

## Content Guidelines

- Maintain consistent tone balancing creative authority with approachability
- Keep section descriptions concise but compelling
- Ensure all external links open in new tabs
- Update bio content as projects evolve

## Chatbot Diagnostics (Express)
1. Railway → Project → **Variables** → set **OPENAI_API_KEY** (no quotes). Save and redeploy.
2. Visit `/diagnostics.html`:
   - **GET /api/health** → check `hasKey: true`.
   - **POST /api/chat** → expect `{ "reply": "..." }`.
3. If POST returns `{ "error": "upstream_error", "detail": "..." }`:
   - 401 / Invalid API key → fix OPENAI_API_KEY in Railway.
   - model not found → update model in server.js (`gpt-4o-mini` is default).
   - `messages: Unexpected role "system"` → indicates an older code path hitting the Responses API; confirm server.js calls **/v1/chat/completions**.
4. Contact form uses `mailto:`; set your device default mail account to Gmail so "From" is your Gmail address.

## Future Enhancements

- Add actual chapter/excerpt content pages
- Implement contact form functionality
- Add blog/news section if needed
- Consider CMS integration for easier content updates
# Rutherford Creative Media Website - Development Notes

## Platform Migration: Netlify → Railway

### Overview
The website has been migrated from a static Netlify deployment to a Node.js Express application hosted on Railway. This change enables server-side functionality while maintaining the existing design and user experience.

### Key Changes

#### 1. Backend Infrastructure
- **Server**: Express.js application (`server.js`)
- **Static Files**: Served from root directory (`./`)
- **Port**: Uses `process.env.PORT` (Railway) or defaults to 3000
- **Health Check**: `/health` endpoint for monitoring

#### 2. Contact Form Enhancement
- **Previous**: `mailto:` action (client-side email)
- **Current**: `/api/contact` POST endpoint with server-side email sending
- **Email Service**: SendGrid integration
- **Features**:
  - Server-side validation
  - Rate limiting (5 requests/10 minutes per IP)
  - Honeypot spam protection
  - Async form submission with loading states

#### 3. AI Chatbot Integration
- **Endpoint**: `/api/chat` POST with streaming responses
- **Provider**: Claude 3.5 Sonnet via Anthropic API
- **Features**:
  - Real-time streaming responses
  - RCM-specific knowledge and branding
  - Fixed position widget on all pages
  - Responsive chat interface
- **UI**: Floating chat bubble in bottom-right corner

#### 4. Environment Configuration
Required environment variables for Railway deployment:
```
SENDGRID_API_KEY=your_sendgrid_api_key
CONTACT_TO=info@rutherfordcreativemedia.com
CONTACT_FROM=no-reply@rutherfordcreativemedia.com
ANTHROPIC_API_KEY=sk-ant-your_anthropic_api_key
```

#### 5. Dependencies
- `express`: Web framework
- `@sendgrid/mail`: Email service
- `dotenv`: Environment variable management
- Native `fetch`: Used for Anthropic API calls (no additional dependencies)

## Development Workflow

### Local Development
```bash
npm install
cp .env.example .env
# Edit .env with your SendGrid credentials
npm run dev
```

### Railway Deployment
1. Connect GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on git push to main branch

### Testing Contact Form
- Test rate limiting: Submit >5 forms within 10 minutes
- Test validation: Try invalid email formats, empty fields
- Test honeypot: Fill the hidden "website" field (should succeed but not send email)

### Testing Chatbot
- Click the 💬 Chat button in bottom-right corner
- Test streaming responses with various queries about RCM
- Verify error handling when API key is missing
- Test conversation memory within the same session

## File Structure Changes

### New Files
- `server.js` - Express backend
- `package.json` - Node.js dependencies and scripts
- `.env.example` - Environment variable template
- `CLAUDE.md` - This documentation file

### Modified Files
- `contact.html` - Updated form to use API endpoint
- `styles.css` - Added error alert styling
- `index.html` - Added Contact navigation links

## Important Notes for Future Development

### 1. Static File Serving
- All existing HTML, CSS, JS, and image files are served directly
- No build process required for static assets
- Maintains existing URL structure

### 2. Form Validation
Server-side validation rules:
- Name: 1-120 characters
- Email: Basic regex validation
- Message: 10-5000 characters
- Honeypot: If filled, returns success but doesn't send email

### 3. Rate Limiting
- In-memory storage (resets on server restart)
- Consider Redis for production scaling
- Currently per-IP, could extend to per-email for better UX

### 4. Email Templates
- Both plain text and HTML versions sent
- Templates are inline in server.js
- Consider moving to separate template files for complex emails

### 5. Error Handling
- Client-side: Shows inline error messages
- Server-side: Logs SendGrid errors to console
- Consider adding structured logging for production

## Security Considerations

### 1. CORS
- Express serves static files from same origin
- API endpoints only accept same-origin requests
- No CORS headers configured (same-origin only)

### 2. Rate Limiting
- Prevents spam and abuse
- In-memory implementation suitable for single-instance deployments
- Monitor for potential bypasses via proxy/VPN

### 3. Input Sanitization
- Basic validation implemented
- HTML in email templates uses simple text replacement
- Consider additional sanitization for XSS prevention

### 4. Environment Variables
- Never commit real API keys
- Use Railway's secure environment variable storage
- Rotate SendGrid API keys periodically

## Monitoring and Maintenance

### 1. Health Checks
- `/health` endpoint for uptime monitoring
- Returns JSON status response
- Can be extended with database connectivity checks

### 2. Logging
- Console logs for SendGrid errors
- Consider structured logging (Winston, Pino)
- Monitor error rates and response times

### 3. Performance
- Static file caching handled by Express
- Consider CDN for images if traffic increases
- Monitor server resource usage on Railway

## Future Enhancement Opportunities

### 1. Database Integration
- Store contact form submissions
- Admin interface for viewing messages
- Analytics and reporting

### 2. Advanced Email Features
- Email templates with better styling
- Auto-responder emails to form submitters
- Email delivery tracking

### 3. Form Enhancements
- File upload capability
- Multi-step forms
- Better client-side validation

### 4. Security Improvements
- CSRF protection
- Input sanitization library
- Request logging and monitoring

### 5. Performance Optimizations
- Redis for rate limiting and caching
- CDN integration
- Image optimization

## Testing Commands

### Lint and Type Check
Currently no linting/type checking configured. Consider adding:
```bash
npm run lint     # ESLint for JavaScript
npm run test     # Jest for unit tests
npm run typecheck # TypeScript if migrating
```

### Build Process
No build process currently required. Static files served directly.

## Git Workflow
- Main branch deploys automatically to Railway
- Create feature branches for new development
- Ensure environment variables are set in Railway before merging

---

**Last Updated**: October 2025
**Railway Deployment**: Active (Node.js 18 with nixpacks.toml configuration)
**Contact Form**: Functional with SendGrid (optional configuration)
**Chatbot**: Active with Claude 3.5 Sonnet claude are there?
claude are there?

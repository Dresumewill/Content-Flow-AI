# ContentFlow AI - AI Content Repurposer for Creators

## Project Overview
- **Name**: ContentFlow AI
- **Goal**: Transform YouTube videos and podcasts into viral social media content with AI
- **Target Users**: Content creators, podcasters, YouTubers, marketing agencies

## 🚀 Live Demo
- **Sandbox URL**: [Access App](https://3000-ima7g7k9x2k1yv4aw8irw-c81df28e.sandbox.novita.ai)
- **GitHub**: [https://github.com/Dresumewill/Content-Flow-AI](https://github.com/Dresumewill/Content-Flow-AI)

## ✅ Completed Features

### Core Functionality
- **Content Input**: Paste YouTube URLs, Podcast URLs, or raw text/transcripts
- **Multi-Format Output**: Generate 8 different content types in one click:
  - TikTok Scripts (30-60 sec with hooks, main content, CTA)
  - Twitter/X Threads (5-7 tweet viral threads)
  - LinkedIn Posts (professional thought leadership)
  - Instagram Captions (with emojis and hashtags)
  - Viral Hooks (10 attention-grabbing hooks)
  - Smart Hashtags (30 strategic hashtags organized by reach)
  - Blog Outlines (SEO-optimized structure)
  - Email Newsletters (subject lines, preview text, full email)

### User Authentication
- Email/password signup and login
- Secure session management with cookies
- Password hashing with SHA-256

### Monetization System
- **Free Plan**: 5 generations/month ($0)
- **Starter Plan**: 50 generations/month ($9/month)
- **Pro Plan**: 200 generations/month ($19/month) - Most Popular
- **Agency Plan**: 1,000 generations/month ($49/month)

### Usage Tracking
- Credit-based system with plan limits
- Real-time credit display
- Usage analytics and history
- Monthly credit reset

### Dashboard
- User stats (total generations, this month)
- Plan information and upgrade prompts
- Content history with all generations
- Quick actions to create new content

### Landing Page
- Modern, conversion-optimized design
- Feature showcase
- How it works section
- Testimonials
- Pricing comparison
- FAQ section

## 📁 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out

### Content Generation
- `POST /api/generate` - Generate content from source
  - Body: `{ sourceUrl?, sourceText?, sourceType, outputTypes[] }`
  - Returns: Generated content for each selected format

### User Data
- `GET /api/user/stats` - Get user statistics and credit info
- `GET /api/generations` - Get user's content history

### Payments (Placeholder)
- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

## 🗄️ Data Architecture

### Database: Cloudflare D1 (SQLite)
- **users**: User accounts with plans and credits
- **sessions**: Authentication sessions
- **generations**: Source content records
- **outputs**: Generated content for each format
- **usage_logs**: Analytics and usage tracking

### Storage Services
- Cloudflare D1 for relational data
- Session data stored in D1

## 🛠️ Tech Stack
- **Framework**: Hono (TypeScript)
- **Runtime**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Frontend**: Tailwind CSS (CDN), Font Awesome
- **Build**: Vite
- **Deployment**: Cloudflare Pages

## 📦 Project Structure
```
webapp/
├── src/
│   ├── index.tsx           # Main app with routes & API
│   └── components/
│       ├── Layout.tsx      # Shared layout component
│       ├── LandingPage.tsx # Homepage
│       ├── AuthPage.tsx    # Login/Signup
│       ├── AppPage.tsx     # Content generator
│       ├── DashboardPage.tsx # User dashboard
│       └── PricingPage.tsx # Pricing plans
├── migrations/
│   └── 0001_initial_schema.sql
├── public/static/
│   └── style.css
├── ecosystem.config.cjs    # PM2 config
├── wrangler.jsonc          # Cloudflare config
├── package.json
└── vite.config.ts
```

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run database migrations
npm run db:migrate:local

# Start development server
npm run dev:sandbox
# or with PM2:
pm2 start ecosystem.config.cjs

# Access at http://localhost:3000
```

## 📤 Deployment to Cloudflare

```bash
# 1. Create D1 database
npx wrangler d1 create content-repurposer-db

# 2. Update wrangler.jsonc with database_id

# 3. Run production migrations
npm run db:migrate:prod

# 4. Deploy
npm run deploy:prod
```

## 🔑 Environment Variables

### Required for Production
- `OPENAI_API_KEY` - For real AI generation (optional, uses mock without)
- `APP_SECRET` - For password hashing
- `STRIPE_SECRET_KEY` - For payments (optional)
- `STRIPE_WEBHOOK_SECRET` - For webhook verification (optional)

### Setting Secrets
```bash
npx wrangler pages secret put OPENAI_API_KEY
npx wrangler pages secret put APP_SECRET
npx wrangler pages secret put STRIPE_SECRET_KEY
```

## 🎯 Features Not Yet Implemented
- [ ] Real YouTube transcript extraction (API integration needed)
- [ ] Podcast audio transcription
- [ ] Stripe payment processing (webhook handlers ready)
- [ ] Email verification
- [ ] Password reset
- [ ] Team collaboration (Agency plan)
- [ ] Custom brand voice settings
- [ ] API access for developers
- [ ] White-label exports

## 📈 Recommended Next Steps

1. **Add OpenAI API Key** - Enable real AI-powered content generation
2. **Integrate Stripe** - Complete payment flow for subscriptions
3. **YouTube API** - Auto-extract video transcripts
4. **Whisper API** - Transcribe podcast audio
5. **Email Service** - Add welcome emails and notifications
6. **Analytics** - Add Plausible or similar for usage insights
7. **Rate Limiting** - Protect API from abuse

## 💰 Monetization Model
- **Freemium Model**: 5 free generations to hook users
- **Subscription Tiers**: $9/$19/$49 monthly
- **Value Proposition**: Clear ROI - saves 10+ hours/week
- **Target ARPU**: $15-25/month

## 📄 License
Proprietary - All rights reserved

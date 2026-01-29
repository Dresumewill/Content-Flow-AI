import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { LandingPage } from './components/LandingPage'
import { AppPage } from './components/AppPage'
import { DashboardPage } from './components/DashboardPage'
import { AuthPage } from './components/AuthPage'
import { PricingPage } from './components/PricingPage'

type Bindings = {
  DB: D1Database
  OPENAI_API_KEY: string
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  APP_SECRET: string
}

type Variables = {
  user: { id: string; email: string; name: string; plan: string; credits_used: number } | null
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// CORS for API routes
app.use('/api/*', cors())

// Session middleware
app.use('*', async (c, next) => {
  const sessionId = getCookie(c, 'session')
  if (sessionId && c.env.DB) {
    try {
      const result = await c.env.DB.prepare(`
        SELECT u.id, u.email, u.name, u.plan, u.credits_used 
        FROM users u 
        JOIN sessions s ON u.id = s.user_id 
        WHERE s.id = ? AND s.expires_at > datetime('now')
      `).bind(sessionId).first()
      
      if (result) {
        c.set('user', result as any)
      }
    } catch (e) {
      // DB not initialized yet
    }
  }
  await next()
})

// ============ PAGES ============

// Landing page
app.get('/', (c) => {
  const user = c.get('user')
  return c.html(<LandingPage user={user} />)
})

// Pricing page
app.get('/pricing', (c) => {
  const user = c.get('user')
  return c.html(<PricingPage user={user} />)
})

// Auth pages
app.get('/login', (c) => {
  const user = c.get('user')
  if (user) return c.redirect('/app')
  return c.html(<AuthPage mode="login" />)
})

app.get('/signup', (c) => {
  const user = c.get('user')
  if (user) return c.redirect('/app')
  return c.html(<AuthPage mode="signup" />)
})

// App page (requires auth)
app.get('/app', (c) => {
  const user = c.get('user')
  if (!user) return c.redirect('/login')
  return c.html(<AppPage user={user} />)
})

// Dashboard page
app.get('/dashboard', (c) => {
  const user = c.get('user')
  if (!user) return c.redirect('/login')
  return c.html(<DashboardPage user={user} />)
})

// ============ AUTH API ============

// Sign up
app.post('/api/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json()
    
    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400)
    }

    // Check if user exists
    const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
    if (existing) {
      return c.json({ error: 'Email already registered' }, 400)
    }

    // Hash password (simple hash for demo - use bcrypt in production)
    const encoder = new TextEncoder()
    const data = encoder.encode(password + (c.env.APP_SECRET || 'secret'))
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // Create user
    const userId = crypto.randomUUID()
    await c.env.DB.prepare(`
      INSERT INTO users (id, email, name, password_hash, plan, credits_used)
      VALUES (?, ?, ?, ?, 'free', 0)
    `).bind(userId, email, name || email.split('@')[0], passwordHash).run()

    // Create session
    const sessionId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    await c.env.DB.prepare(`
      INSERT INTO sessions (id, user_id, expires_at)
      VALUES (?, ?, ?)
    `).bind(sessionId, userId, expiresAt).run()

    setCookie(c, 'session', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/'
    })

    return c.json({ success: true, redirect: '/app' })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// Login
app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    
    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400)
    }

    // Hash password
    const encoder = new TextEncoder()
    const data = encoder.encode(password + (c.env.APP_SECRET || 'secret'))
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // Find user
    const user = await c.env.DB.prepare(`
      SELECT id, email, name, plan FROM users WHERE email = ? AND password_hash = ?
    `).bind(email, passwordHash).first()

    if (!user) {
      return c.json({ error: 'Invalid email or password' }, 401)
    }

    // Create session
    const sessionId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    await c.env.DB.prepare(`
      INSERT INTO sessions (id, user_id, expires_at)
      VALUES (?, ?, ?)
    `).bind(sessionId, user.id, expiresAt).run()

    setCookie(c, 'session', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/'
    })

    return c.json({ success: true, redirect: '/app' })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// Logout
app.post('/api/auth/logout', async (c) => {
  const sessionId = getCookie(c, 'session')
  if (sessionId) {
    try {
      await c.env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run()
    } catch (e) {}
  }
  deleteCookie(c, 'session', { path: '/' })
  return c.json({ success: true, redirect: '/' })
})

// ============ CONTENT GENERATION API ============

// Plan limits
const PLAN_LIMITS = {
  free: { credits: 5, name: 'Free' },
  starter: { credits: 50, name: 'Starter' },
  pro: { credits: 200, name: 'Pro' },
  agency: { credits: 1000, name: 'Agency' }
}

// Check credits
async function checkCredits(c: any, creditsNeeded: number = 1): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const user = c.get('user')
  if (!user) return { allowed: false, remaining: 0, limit: 0 }
  
  const plan = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free
  const remaining = plan.credits - user.credits_used
  
  return {
    allowed: remaining >= creditsNeeded,
    remaining,
    limit: plan.credits
  }
}

// Generate content
app.post('/api/generate', async (c) => {
  const user = c.get('user')
  if (!user) {
    return c.json({ error: 'Authentication required' }, 401)
  }

  const creditCheck = await checkCredits(c, 1)
  if (!creditCheck.allowed) {
    return c.json({ 
      error: 'Credit limit reached. Upgrade your plan for more generations.',
      remaining: creditCheck.remaining,
      limit: creditCheck.limit
    }, 403)
  }

  try {
    const { sourceText, sourceUrl, sourceType, outputTypes } = await c.req.json()
    
    if (!sourceText && !sourceUrl) {
      return c.json({ error: 'Source content or URL required' }, 400)
    }

    if (!outputTypes || outputTypes.length === 0) {
      return c.json({ error: 'At least one output type required' }, 400)
    }

    // For demo, we'll use mock generation if no API key
    // In production, this would call OpenAI/Claude API
    const transcript = sourceText || `Content from: ${sourceUrl}`
    
    // Create generation record
    const generationId = crypto.randomUUID()
    await c.env.DB.prepare(`
      INSERT INTO generations (id, user_id, source_type, source_url, source_title, source_transcript)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(generationId, user.id, sourceType || 'text', sourceUrl || null, 'Generated Content', transcript).run()

    // Generate outputs
    const outputs: Record<string, string> = {}
    
    for (const outputType of outputTypes) {
      let content = ''
      
      // Check if we have OpenAI key for real generation
      if (c.env.OPENAI_API_KEY) {
        content = await generateWithAI(c.env.OPENAI_API_KEY, transcript, outputType)
      } else {
        // Mock generation for demo
        content = generateMockContent(transcript, outputType)
      }
      
      outputs[outputType] = content
      
      // Save output
      const outputId = crypto.randomUUID()
      await c.env.DB.prepare(`
        INSERT INTO outputs (id, generation_id, output_type, content)
        VALUES (?, ?, ?, ?)
      `).bind(outputId, generationId, outputType, content).run()
    }

    // Update credits
    await c.env.DB.prepare(`
      UPDATE users SET credits_used = credits_used + 1 WHERE id = ?
    `).bind(user.id).run()

    // Log usage
    await c.env.DB.prepare(`
      INSERT INTO usage_logs (user_id, action, credits_used, metadata)
      VALUES (?, 'generate', 1, ?)
    `).bind(user.id, JSON.stringify({ outputTypes, sourceType })).run()

    return c.json({
      success: true,
      generationId,
      outputs,
      creditsRemaining: creditCheck.remaining - 1
    })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// AI generation function
async function generateWithAI(apiKey: string, transcript: string, outputType: string): Promise<string> {
  const prompts: Record<string, string> = {
    tiktok_script: `Create an engaging TikTok script (30-60 seconds) based on this content. Include hook, main points, and call-to-action. Format with [HOOK], [MAIN], [CTA] sections:\n\n${transcript}`,
    twitter_thread: `Create a viral Twitter/X thread (5-7 tweets) based on this content. Start with a hook, include value bombs, and end with engagement. Number each tweet:\n\n${transcript}`,
    linkedin_post: `Create a professional LinkedIn post based on this content. Include a hook, storytelling element, key insights, and call-to-action:\n\n${transcript}`,
    instagram_caption: `Create an engaging Instagram caption based on this content. Include emojis, line breaks for readability, and relevant hashtags at the end:\n\n${transcript}`,
    hooks: `Generate 10 attention-grabbing hooks/headlines based on this content. Make them curiosity-driven, benefit-focused, or controversy-invoking:\n\n${transcript}`,
    hashtags: `Generate 30 relevant hashtags for this content, organized by: 10 popular (high volume), 10 niche (medium volume), 10 specific (low competition):\n\n${transcript}`,
    blog_outline: `Create a detailed blog post outline based on this content. Include title options, introduction, H2/H3 sections, key points, and conclusion:\n\n${transcript}`,
    email_newsletter: `Create an email newsletter based on this content. Include subject line options, preview text, greeting, main content sections, and CTA:\n\n${transcript}`
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert content creator and social media strategist. Create engaging, platform-optimized content.' },
        { role: 'user', content: prompts[outputType] || `Repurpose this content: ${transcript}` }
      ],
      max_tokens: 1500,
      temperature: 0.7
    })
  })

  const data = await response.json() as any
  return data.choices?.[0]?.message?.content || 'Generation failed'
}

// Mock generation for demo
function generateMockContent(transcript: string, outputType: string): string {
  const shortText = transcript.substring(0, 100)
  
  const mockOutputs: Record<string, string> = {
    tiktok_script: `[HOOK]\nStop scrolling! Here's something that'll change how you think about this...\n\n[MAIN]\nBased on: "${shortText}..."\n\nKey insight #1: This changes everything\nKey insight #2: Most people don't know this\nKey insight #3: Here's the game-changer\n\n[CTA]\nFollow for more insights like this! Drop a comment if this resonated with you.`,
    
    twitter_thread: `1/ Thread: Here's what nobody tells you about this topic\n\nBased on: "${shortText}..."\n\n2/ First, let's break down the key insight...\n\nThis alone can transform your approach.\n\n3/ Second, most people miss this crucial point...\n\nBut top performers know it well.\n\n4/ Third, here's the actionable takeaway...\n\nImplement this today.\n\n5/ To summarize:\n• Key point 1\n• Key point 2\n• Key point 3\n\nLike + RT if this was valuable! Follow for more.`,
    
    linkedin_post: `I used to think I knew everything about this topic.\n\nThen I discovered something that changed my perspective entirely.\n\nBased on: "${shortText}..."\n\nHere's what I learned:\n\n→ Insight 1: The fundamentals matter more than tactics\n→ Insight 2: Consistency beats perfection\n→ Insight 3: Community amplifies impact\n\nThe biggest takeaway?\n\nSuccess isn't about working harder—it's about working smarter.\n\nWhat's your experience with this? Share in the comments 👇\n\n#ContentCreation #SocialMedia #Growth #Marketing`,
    
    instagram_caption: `✨ This changed everything for me ✨\n\nBased on: "${shortText}..."\n\nHere's the breakdown:\n\n📌 Key insight that shifts perspective\n📌 Actionable step you can take today  \n📌 Result you can expect\n\nSave this for later! 🔖\n\nDouble tap if this resonates ❤️\n\n.\n.\n.\n#contentcreator #socialmediatips #growthmindset #creatoreconomy #digitalmarketing #contentmarketing #instagramtips #tiktokmarketing #creatortips #socialmediamarketing`,
    
    hooks: `🎯 10 Attention-Grabbing Hooks:\n\n1. "Nobody talks about this, but..."\n2. "I was today years old when I learned..."\n3. "Stop doing [X] if you want [result]"\n4. "The #1 mistake killing your [goal]"\n5. "Here's what $10M creators know that you don't"\n6. "Unpopular opinion: [controversial take]"\n7. "POV: You finally figured out [topic]"\n8. "This hack saved me 10+ hours per week"\n9. "Why 99% of people fail at [topic]"\n10. "The truth about [topic] that experts hide"`,
    
    hashtags: `📊 30 Strategic Hashtags:\n\n🔥 POPULAR (High Volume):\n#content #creator #socialmedia #marketing #business #entrepreneur #growth #success #motivation #viral\n\n🎯 NICHE (Medium Volume):\n#contentcreator #contentmarketing #creatortips #socialmediastrategy #digitalcreator #contentcreation #growthhacking #marketingtips #businesstips #onlinebusiness\n\n💎 SPECIFIC (Low Competition):\n#contentrepurposing #creatortoolkit #socialmediahacks #contentworkflow #creatoreconomy #contentautomation #repurposecontent #contentscaling #creatorgrowth #contentstrategy`,
    
    blog_outline: `📝 Blog Post Outline\n\n**Title Options:**\n1. "The Complete Guide to [Topic]: Everything You Need to Know"\n2. "How to [Achieve Result]: A Step-by-Step Framework"\n3. "[Number] Proven Strategies for [Desired Outcome]"\n\n**Introduction:**\n- Hook: Start with surprising statistic or question\n- Problem: What readers are struggling with\n- Promise: What they'll learn\n\n**H2: Understanding the Fundamentals**\n- H3: Key concept 1\n- H3: Key concept 2\n- H3: Common misconceptions\n\n**H2: Step-by-Step Process**\n- H3: Step 1 - Foundation\n- H3: Step 2 - Implementation  \n- H3: Step 3 - Optimization\n\n**H2: Advanced Strategies**\n- H3: Pro tip 1\n- H3: Pro tip 2\n\n**Conclusion:**\n- Recap key points\n- Call-to-action\n- Next steps`,
    
    email_newsletter: `📧 Email Newsletter\n\n**Subject Line Options:**\n1. "This changed everything for me (and it will for you too)"\n2. "[First Name], here's what you've been missing"\n3. "The one thing top creators do differently"\n\n**Preview Text:** "Plus: exclusive insights you won't find anywhere else"\n\n---\n\nHey [First Name],\n\nQuick question: Have you ever felt like you're creating content into the void?\n\nI used to feel the same way. Until I discovered this...\n\nBased on: "${shortText}..."\n\n**Here's the breakdown:**\n\n✅ Key insight #1\n✅ Key insight #2  \n✅ Key insight #3\n\n**Your action step for this week:**\nTry implementing just ONE of these strategies and reply to tell me how it goes.\n\nTalk soon,\n[Your Name]\n\nP.S. If you found this valuable, forward it to a creator friend who needs to see this!`
  }
  
  return mockOutputs[outputType] || `Generated content for ${outputType} based on your input.`
}

// Get user's generations
app.get('/api/generations', async (c) => {
  const user = c.get('user')
  if (!user) {
    return c.json({ error: 'Authentication required' }, 401)
  }

  try {
    const generations = await c.env.DB.prepare(`
      SELECT g.*, 
        (SELECT json_group_array(json_object('id', o.id, 'type', o.output_type, 'content', o.content))
         FROM outputs o WHERE o.generation_id = g.id) as outputs
      FROM generations g 
      WHERE g.user_id = ?
      ORDER BY g.created_at DESC
      LIMIT 50
    `).bind(user.id).all()

    return c.json({ generations: generations.results })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// Get user stats
app.get('/api/user/stats', async (c) => {
  const user = c.get('user')
  if (!user) {
    return c.json({ error: 'Authentication required' }, 401)
  }

  try {
    const plan = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free
    
    const totalGenerations = await c.env.DB.prepare(`
      SELECT COUNT(*) as count FROM generations WHERE user_id = ?
    `).bind(user.id).first()

    const thisMonth = await c.env.DB.prepare(`
      SELECT COUNT(*) as count FROM usage_logs 
      WHERE user_id = ? AND created_at >= datetime('now', 'start of month')
    `).bind(user.id).first()

    return c.json({
      user: {
        email: user.email,
        name: user.name,
        plan: user.plan,
        planName: plan.name
      },
      credits: {
        used: user.credits_used,
        limit: plan.credits,
        remaining: plan.credits - user.credits_used
      },
      stats: {
        totalGenerations: (totalGenerations as any)?.count || 0,
        thisMonth: (thisMonth as any)?.count || 0
      }
    })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// ============ STRIPE WEBHOOKS (placeholder) ============

app.post('/api/webhooks/stripe', async (c) => {
  // In production, verify Stripe signature and handle events
  // subscription.created, subscription.updated, subscription.deleted, etc.
  return c.json({ received: true })
})

// Create checkout session (placeholder)
app.post('/api/checkout', async (c) => {
  const user = c.get('user')
  if (!user) {
    return c.json({ error: 'Authentication required' }, 401)
  }

  const { plan } = await c.req.json()
  
  // In production, create Stripe checkout session
  // For demo, just return a mock URL
  return c.json({
    url: `/pricing?demo=true&plan=${plan}`,
    message: 'Stripe integration ready - add STRIPE_SECRET_KEY to enable payments'
  })
})

export default app

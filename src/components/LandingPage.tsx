import { html } from 'hono/html'
import { Layout } from './Layout'

type User = { id: string; email: string; name: string; plan: string; credits_used: number } | null

export const LandingPage = ({ user }: { user: User }) => {
  return (
    <Layout user={user}>
      {/* Hero Section */}
      <section class="relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50"></div>
        <div class="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div class="absolute bottom-20 right-10 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style="animation-delay: -3s;"></div>
        
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div class="text-center max-w-4xl mx-auto">
            <div class="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              <i class="fas fa-sparkles mr-2"></i>
              Trusted by 10,000+ creators
            </div>
            
            <h1 class="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
              Turn One Video Into
              <span class="gradient-text"> 10+ Viral Posts</span>
            </h1>
            
            <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Paste your YouTube video or podcast link and let AI create TikTok scripts, 
              Twitter threads, Instagram captions, hooks, and hashtags in seconds.
            </p>
            
            <div class="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <a href={user ? '/app' : '/signup'} class="gradient-bg text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition shadow-lg shadow-primary-500/30">
                <i class="fas fa-rocket mr-2"></i>
                Start Repurposing Free
              </a>
              <a href="#demo" class="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border border-gray-200 hover:border-gray-300 transition">
                <i class="fas fa-play-circle mr-2"></i>
                Watch Demo
              </a>
            </div>
            
            <div class="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div class="flex items-center">
                <i class="fas fa-check-circle text-green-500 mr-2"></i>
                5 free generations
              </div>
              <div class="flex items-center">
                <i class="fas fa-check-circle text-green-500 mr-2"></i>
                No credit card required
              </div>
              <div class="flex items-center">
                <i class="fas fa-check-circle text-green-500 mr-2"></i>
                Cancel anytime
              </div>
            </div>
          </div>
          
          {/* App Preview */}
          <div class="mt-16 relative">
            <div class="gradient-border p-1 rounded-2xl shadow-2xl max-w-5xl mx-auto">
              <div class="bg-white rounded-xl p-6">
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div class="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div class="grid md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div class="bg-gray-50 rounded-lg p-4">
                      <label class="text-sm font-medium text-gray-700 mb-2 block">Paste YouTube URL or Transcript</label>
                      <div class="bg-white border border-gray-200 rounded-lg p-3 text-gray-400 text-sm">
                        https://youtube.com/watch?v=example...
                      </div>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <label class="text-sm font-medium text-gray-700 mb-2 block">Select Output Formats</label>
                      <div class="flex flex-wrap gap-2">
                        <span class="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">TikTok Script ✓</span>
                        <span class="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">Twitter Thread ✓</span>
                        <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">LinkedIn Post</span>
                        <span class="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">Hooks ✓</span>
                      </div>
                    </div>
                  </div>
                  <div class="bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-3">
                      <span class="text-sm font-medium text-gray-700">Generated TikTok Script</span>
                      <button class="text-primary-600 text-sm font-medium"><i class="fas fa-copy mr-1"></i> Copy</button>
                    </div>
                    <div class="bg-white rounded-lg p-3 text-sm text-gray-600 h-40 overflow-hidden">
                      <p class="font-medium text-gray-800">[HOOK]</p>
                      <p>Stop scrolling! Here's what nobody tells you about building an audience...</p>
                      <p class="font-medium text-gray-800 mt-2">[MAIN]</p>
                      <p>Most creators spend hours creating content but...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section class="py-12 bg-white border-y border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p class="text-center text-gray-500 mb-8">Trusted by creators and brands worldwide</p>
          <div class="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale">
            <div class="text-2xl font-bold text-gray-400">Creator Co.</div>
            <div class="text-2xl font-bold text-gray-400">PodcastPro</div>
            <div class="text-2xl font-bold text-gray-400">ViralMedia</div>
            <div class="text-2xl font-bold text-gray-400">ContentHQ</div>
            <div class="text-2xl font-bold text-gray-400">GrowthLab</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" class="py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to <span class="gradient-text">Scale Your Content</span>
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
              Stop spending hours repurposing content manually. Let AI do the heavy lifting.
            </p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'fa-video', title: 'YouTube to TikTok', desc: 'Convert long videos into viral short-form scripts', color: 'red' },
              { icon: 'fa-twitter', title: 'Twitter Threads', desc: 'Generate engaging threads that drive engagement', color: 'blue' },
              { icon: 'fa-instagram', title: 'Instagram Captions', desc: 'Create scroll-stopping captions with hashtags', color: 'pink' },
              { icon: 'fa-linkedin', title: 'LinkedIn Posts', desc: 'Professional posts that build authority', color: 'blue' },
              { icon: 'fa-lightbulb', title: 'Viral Hooks', desc: '10+ attention-grabbing hooks per generation', color: 'yellow' },
              { icon: 'fa-hashtag', title: 'Smart Hashtags', desc: 'Strategic hashtags for maximum reach', color: 'green' },
              { icon: 'fa-blog', title: 'Blog Outlines', desc: 'SEO-optimized blog post structures', color: 'purple' },
              { icon: 'fa-envelope', title: 'Email Newsletters', desc: 'Convert content into email campaigns', color: 'orange' },
            ].map((feature, i) => (
              <div key={i} class="bg-white p-6 rounded-2xl border border-gray-100 card-hover">
                <div class={`w-12 h-12 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                  <i class={`fab ${feature.icon} text-${feature.color}-600 text-xl`}></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p class="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section class="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p class="text-xl text-gray-600">Three simple steps to 10x your content output</p>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Paste Your Content', desc: 'Drop a YouTube URL, podcast link, or paste your transcript directly', icon: 'fa-paste' },
              { step: '2', title: 'Choose Formats', desc: 'Select which platforms and content types you want to generate', icon: 'fa-list-check' },
              { step: '3', title: 'Copy & Post', desc: 'Get AI-generated content ready to publish. Edit if needed and post!', icon: 'fa-share' },
            ].map((item, i) => (
              <div key={i} class="relative">
                <div class="bg-white rounded-2xl p-8 shadow-lg relative z-10">
                  <div class="w-12 h-12 gradient-bg rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                    {item.step}
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p class="text-gray-600">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div class="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <i class="fas fa-arrow-right text-gray-300 text-2xl"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section class="py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by <span class="gradient-text">Creators</span>
            </h2>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Chen', role: 'YouTuber, 500K subs', quote: 'ContentFlow AI saves me 10+ hours per week. The TikTok scripts consistently go viral.', avatar: 'SC' },
              { name: 'Marcus Johnson', role: 'Podcast Host', quote: 'I repurpose every episode into 20+ pieces of content. Game changer for my workflow.', avatar: 'MJ' },
              { name: 'Emily Rodriguez', role: 'Content Agency Owner', quote: 'Our team processes 50+ client videos weekly. ContentFlow is essential to our business.', avatar: 'ER' },
            ].map((testimonial, i) => (
              <div key={i} class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div class="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(() => <i class="fas fa-star text-yellow-400"></i>)}
                </div>
                <p class="text-gray-700 mb-6">"{testimonial.quote}"</p>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 gradient-bg rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">{testimonial.name}</div>
                    <div class="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="py-24">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="gradient-bg rounded-3xl p-12 text-center text-white">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">
              Ready to 10x Your Content Output?
            </h2>
            <p class="text-xl opacity-90 mb-8">
              Join 10,000+ creators who save hours every week with ContentFlow AI.
            </p>
            <a href={user ? '/app' : '/signup'} class="inline-block bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition">
              Start Free Today
            </a>
            <p class="mt-4 text-sm opacity-75">No credit card required • 5 free generations</p>
          </div>
        </div>
      </section>
    </Layout>
  )
}

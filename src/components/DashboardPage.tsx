import { html } from 'hono/html'
import { Layout } from './Layout'

type User = { id: string; email: string; name: string; plan: string; credits_used: number }

const PLAN_LIMITS: Record<string, { credits: number; name: string; price: string }> = {
  free: { credits: 5, name: 'Free', price: '$0' },
  starter: { credits: 50, name: 'Starter', price: '$9' },
  pro: { credits: 200, name: 'Pro', price: '$19' },
  agency: { credits: 1000, name: 'Agency', price: '$49' }
}

export const DashboardPage = ({ user }: { user: User }) => {
  const planInfo = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free
  const creditsRemaining = planInfo.credits - user.credits_used
  const usagePercent = Math.round((user.credits_used / planInfo.credits) * 100)

  return (
    <Layout title="Dashboard" user={user}>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p class="text-gray-600 mt-1">Welcome back, {user.name || user.email}</p>
        </div>

        {/* Stats Grid */}
        <div class="grid md:grid-cols-4 gap-6 mb-8">
          {/* Plan Card */}
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm text-gray-500">Current Plan</span>
              <span class="gradient-bg text-white text-xs px-2 py-1 rounded-full">{planInfo.name}</span>
            </div>
            <div class="text-2xl font-bold text-gray-900">{planInfo.price}<span class="text-sm font-normal text-gray-500">/month</span></div>
            {user.plan !== 'agency' && (
              <a href="/pricing" class="text-sm text-primary-600 hover:text-primary-700 font-medium mt-2 inline-block">
                Upgrade Plan →
              </a>
            )}
          </div>

          {/* Credits Card */}
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm text-gray-500">Credits Remaining</span>
              <i class="fas fa-coins text-yellow-500"></i>
            </div>
            <div class="text-2xl font-bold text-gray-900">
              <span id="creditsDisplay">{creditsRemaining}</span>
              <span class="text-sm font-normal text-gray-500"> / {planInfo.credits}</span>
            </div>
            <div class="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                class="h-full gradient-bg rounded-full transition-all duration-500" 
                style={`width: ${usagePercent}%`}
              ></div>
            </div>
          </div>

          {/* Generations Card */}
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm text-gray-500">Total Generations</span>
              <i class="fas fa-wand-magic-sparkles text-accent-500"></i>
            </div>
            <div class="text-2xl font-bold text-gray-900" id="totalGenerations">-</div>
            <span class="text-sm text-gray-500">All time</span>
          </div>

          {/* This Month Card */}
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm text-gray-500">This Month</span>
              <i class="fas fa-calendar text-primary-500"></i>
            </div>
            <div class="text-2xl font-bold text-gray-900" id="thisMonth">-</div>
            <span class="text-sm text-gray-500">Generations</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div class="grid md:grid-cols-2 gap-6 mb-8">
          <a href="/app" class="bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl p-6 text-white hover:opacity-90 transition">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <i class="fas fa-plus text-xl"></i>
              </div>
              <div>
                <h3 class="font-semibold text-lg">Create New Content</h3>
                <p class="text-white/80 text-sm">Repurpose your latest video or podcast</p>
              </div>
            </div>
          </a>

          <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <i class="fas fa-book text-gray-500 text-xl"></i>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 text-lg">Content Library</h3>
                <p class="text-gray-500 text-sm">View all your generated content below</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Generations */}
        <div class="bg-white rounded-xl shadow-sm border border-gray-100">
          <div class="p-6 border-b border-gray-100">
            <h2 class="font-semibold text-gray-900 text-lg">
              <i class="fas fa-history mr-2 text-gray-400"></i>
              Recent Generations
            </h2>
          </div>

          <div id="generationsLoading" class="p-8 text-center">
            <i class="fas fa-spinner fa-spin text-2xl text-gray-400 mb-4"></i>
            <p class="text-gray-500">Loading your content...</p>
          </div>

          <div id="generationsEmpty" class="hidden p-8 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-folder-open text-gray-400 text-2xl"></i>
            </div>
            <h3 class="font-medium text-gray-900 mb-2">No content yet</h3>
            <p class="text-gray-500 mb-4">Start by repurposing your first piece of content</p>
            <a href="/app" class="inline-block gradient-bg text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition">
              Create Content
            </a>
          </div>

          <div id="generationsList" class="hidden divide-y divide-gray-100">
            {/* Generations will be loaded here */}
          </div>
        </div>
      </div>

      {html`
        <script>
          // Load user stats and generations on page load
          document.addEventListener('DOMContentLoaded', async () => {
            // Load stats
            try {
              const statsResponse = await fetch('/api/user/stats');
              const stats = await statsResponse.json();
              
              if (!stats.error) {
                document.getElementById('totalGenerations').textContent = stats.stats.totalGenerations;
                document.getElementById('thisMonth').textContent = stats.stats.thisMonth;
                document.getElementById('creditsDisplay').textContent = stats.credits.remaining;
              }
            } catch (e) {
              console.error('Failed to load stats', e);
            }
            
            // Load generations
            try {
              const genResponse = await fetch('/api/generations');
              const genData = await genResponse.json();
              
              const loadingDiv = document.getElementById('generationsLoading');
              const emptyDiv = document.getElementById('generationsEmpty');
              const listDiv = document.getElementById('generationsList');
              
              loadingDiv.classList.add('hidden');
              
              if (!genData.generations || genData.generations.length === 0) {
                emptyDiv.classList.remove('hidden');
                return;
              }
              
              listDiv.classList.remove('hidden');
              listDiv.innerHTML = genData.generations.map(gen => {
                const outputs = JSON.parse(gen.outputs || '[]');
                const date = new Date(gen.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });
                
                const typeIcons = {
                  youtube: 'fa-brands fa-youtube text-red-500',
                  podcast: 'fas fa-podcast text-purple-500',
                  text: 'fas fa-file-lines text-blue-500'
                };
                
                const formatBadges = outputs.map(o => {
                  const names = {
                    tiktok_script: 'TikTok',
                    twitter_thread: 'Twitter',
                    linkedin_post: 'LinkedIn',
                    instagram_caption: 'Instagram',
                    hooks: 'Hooks',
                    hashtags: 'Hashtags',
                    blog_outline: 'Blog',
                    email_newsletter: 'Email'
                  };
                  return \`<span class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">\${names[o.type] || o.type}</span>\`;
                }).join('');
                
                return \`
                  <div class="p-4 hover:bg-gray-50 transition">
                    <div class="flex items-start justify-between">
                      <div class="flex items-start gap-3">
                        <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i class="\${typeIcons[gen.source_type] || 'fas fa-file'} text-lg"></i>
                        </div>
                        <div>
                          <h4 class="font-medium text-gray-900 text-sm">\${gen.source_title || 'Content Generation'}</h4>
                          <p class="text-xs text-gray-500 mt-1">\${date}</p>
                          <div class="flex flex-wrap gap-1 mt-2">
                            \${formatBadges}
                          </div>
                        </div>
                      </div>
                      <button 
                        onclick="viewGeneration('\${gen.id}')"
                        class="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        View
                      </button>
                    </div>
                  </div>
                \`;
              }).join('');
              
            } catch (e) {
              console.error('Failed to load generations', e);
              document.getElementById('generationsLoading').innerHTML = \`
                <p class="text-red-500">Failed to load content. Please refresh the page.</p>
              \`;
            }
          });
          
          function viewGeneration(id) {
            // For now, just alert. Could open a modal or redirect
            alert('Generation ID: ' + id + '\\n\\nFull view modal coming soon!');
          }
        </script>
      `}
    </Layout>
  )
}

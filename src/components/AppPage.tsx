import { html } from 'hono/html'
import { Layout } from './Layout'

type User = { id: string; email: string; name: string; plan: string; credits_used: number }

const PLAN_LIMITS: Record<string, number> = {
  free: 5,
  starter: 50,
  pro: 200,
  agency: 1000
}

export const AppPage = ({ user }: { user: User }) => {
  const creditsLimit = PLAN_LIMITS[user.plan] || 5
  const creditsRemaining = creditsLimit - user.credits_used

  return (
    <Layout title="Create Content" user={user}>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Content Repurposer</h1>
            <p class="text-gray-600 mt-1">Transform your content into multiple formats</p>
          </div>
          <div class="mt-4 md:mt-0 flex items-center gap-4">
            <div class="bg-white px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2">
              <i class="fas fa-coins text-yellow-500"></i>
              <span class="font-medium">
                <span id="creditsRemaining">{creditsRemaining}</span> / {creditsLimit} credits
              </span>
            </div>
            {user.plan === 'free' && (
              <a href="/pricing" class="gradient-bg text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition text-sm">
                Upgrade
              </a>
            )}
          </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div class="space-y-6">
            {/* Source Type Tabs */}
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 class="font-semibold text-gray-900 mb-4">
                <i class="fas fa-upload mr-2 text-primary-500"></i>
                Input Source
              </h2>
              
              <div class="flex gap-2 mb-4">
                {['YouTube URL', 'Podcast URL', 'Paste Text'].map((tab, i) => (
                  <button 
                    key={i}
                    data-tab={['youtube', 'podcast', 'text'][i]}
                    class={`source-tab px-4 py-2 rounded-lg text-sm font-medium transition ${i === 0 ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    onclick={`selectTab('${['youtube', 'podcast', 'text'][i]}')`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div id="input-youtube" class="tab-content">
                <input 
                  type="url" 
                  id="youtubeUrl"
                  placeholder="https://www.youtube.com/watch?v=..."
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                />
                <p class="text-xs text-gray-500 mt-2">
                  <i class="fas fa-info-circle mr-1"></i>
                  We'll extract the transcript from the video
                </p>
              </div>

              <div id="input-podcast" class="tab-content hidden">
                <input 
                  type="url" 
                  id="podcastUrl"
                  placeholder="https://podcasts.example.com/episode/..."
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                />
                <p class="text-xs text-gray-500 mt-2">
                  <i class="fas fa-info-circle mr-1"></i>
                  Supports Spotify, Apple Podcasts, and direct RSS links
                </p>
              </div>

              <div id="input-text" class="tab-content hidden">
                <textarea 
                  id="sourceText"
                  rows="6"
                  placeholder="Paste your transcript, article, or any text content here..."
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-none"
                ></textarea>
                <p class="text-xs text-gray-500 mt-2">
                  <i class="fas fa-info-circle mr-1"></i>
                  Minimum 100 characters for best results
                </p>
              </div>
            </div>

            {/* Output Formats */}
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 class="font-semibold text-gray-900 mb-4">
                <i class="fas fa-wand-magic-sparkles mr-2 text-accent-500"></i>
                Output Formats
              </h2>
              
              <div class="grid grid-cols-2 gap-3">
                {[
                  { id: 'tiktok_script', name: 'TikTok Script', icon: 'fa-brands fa-tiktok', desc: '30-60 sec video script' },
                  { id: 'twitter_thread', name: 'Twitter Thread', icon: 'fa-brands fa-twitter', desc: '5-7 tweet thread' },
                  { id: 'linkedin_post', name: 'LinkedIn Post', icon: 'fa-brands fa-linkedin', desc: 'Professional post' },
                  { id: 'instagram_caption', name: 'Instagram Caption', icon: 'fa-brands fa-instagram', desc: 'Caption + hashtags' },
                  { id: 'hooks', name: 'Viral Hooks', icon: 'fas fa-lightbulb', desc: '10 attention grabbers' },
                  { id: 'hashtags', name: 'Smart Hashtags', icon: 'fas fa-hashtag', desc: '30 strategic tags' },
                  { id: 'blog_outline', name: 'Blog Outline', icon: 'fas fa-blog', desc: 'SEO-optimized structure' },
                  { id: 'email_newsletter', name: 'Email Newsletter', icon: 'fas fa-envelope', desc: 'Email campaign' },
                ].map((format) => (
                  <label 
                    key={format.id}
                    class="output-format flex items-start gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-primary-300 hover:bg-primary-50/50 transition"
                  >
                    <input 
                      type="checkbox" 
                      name="outputType" 
                      value={format.id}
                      class="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <i class={`${format.icon} text-gray-400 text-sm`}></i>
                        <span class="font-medium text-gray-800 text-sm">{format.name}</span>
                      </div>
                      <span class="text-xs text-gray-500">{format.desc}</span>
                    </div>
                  </label>
                ))}
              </div>

              <div class="mt-4 flex items-center gap-3">
                <button 
                  onclick="selectAll()"
                  class="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Select All
                </button>
                <span class="text-gray-300">|</span>
                <button 
                  onclick="clearAll()"
                  class="text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <button 
              id="generateBtn"
              onclick="generateContent()"
              class="w-full gradient-bg text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <i class="fas fa-sparkles"></i>
              <span id="generateText">Generate Content</span>
              <span id="generateLoader" class="hidden">
                <i class="fas fa-spinner fa-spin ml-2"></i>
              </span>
            </button>

            <div id="errorAlert" class="hidden bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
              <i class="fas fa-exclamation-circle mr-2"></i>
              <span id="errorText"></span>
            </div>
          </div>

          {/* Output Section */}
          <div class="space-y-6">
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-h-[600px]">
              <div class="flex items-center justify-between mb-4">
                <h2 class="font-semibold text-gray-900">
                  <i class="fas fa-file-lines mr-2 text-primary-500"></i>
                  Generated Content
                </h2>
                <button 
                  id="copyAllBtn"
                  onclick="copyAllContent()"
                  class="hidden text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  <i class="fas fa-copy mr-1"></i>
                  Copy All
                </button>
              </div>

              <div id="outputPlaceholder" class="flex flex-col items-center justify-center h-96 text-gray-400">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <i class="fas fa-wand-magic-sparkles text-2xl"></i>
                </div>
                <p class="text-center">
                  Your generated content will appear here.<br />
                  Select formats and click Generate!
                </p>
              </div>

              <div id="outputContent" class="hidden space-y-4">
                {/* Generated content will be inserted here */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {html`
        <script>
          let currentTab = 'youtube';
          
          function selectTab(tab) {
            currentTab = tab;
            
            // Update tab buttons
            document.querySelectorAll('.source-tab').forEach(btn => {
              if (btn.dataset.tab === tab) {
                btn.className = 'source-tab px-4 py-2 rounded-lg text-sm font-medium transition bg-primary-100 text-primary-700';
              } else {
                btn.className = 'source-tab px-4 py-2 rounded-lg text-sm font-medium transition bg-gray-100 text-gray-600 hover:bg-gray-200';
              }
            });
            
            // Show/hide content
            document.querySelectorAll('.tab-content').forEach(content => {
              content.classList.add('hidden');
            });
            document.getElementById('input-' + tab).classList.remove('hidden');
          }
          
          function selectAll() {
            document.querySelectorAll('input[name="outputType"]').forEach(cb => cb.checked = true);
          }
          
          function clearAll() {
            document.querySelectorAll('input[name="outputType"]').forEach(cb => cb.checked = false);
          }
          
          async function generateContent() {
            const generateBtn = document.getElementById('generateBtn');
            const generateText = document.getElementById('generateText');
            const generateLoader = document.getElementById('generateLoader');
            const errorAlert = document.getElementById('errorAlert');
            const errorText = document.getElementById('errorText');
            
            // Get input
            let sourceUrl = '';
            let sourceText = '';
            let sourceType = currentTab;
            
            if (currentTab === 'youtube') {
              sourceUrl = document.getElementById('youtubeUrl').value;
            } else if (currentTab === 'podcast') {
              sourceUrl = document.getElementById('podcastUrl').value;
            } else {
              sourceText = document.getElementById('sourceText').value;
            }
            
            // Get selected outputs
            const outputTypes = [];
            document.querySelectorAll('input[name="outputType"]:checked').forEach(cb => {
              outputTypes.push(cb.value);
            });
            
            // Validate
            if (!sourceUrl && !sourceText) {
              errorAlert.classList.remove('hidden');
              errorText.textContent = 'Please provide a URL or paste your content.';
              return;
            }
            
            if (outputTypes.length === 0) {
              errorAlert.classList.remove('hidden');
              errorText.textContent = 'Please select at least one output format.';
              return;
            }
            
            // Show loading
            generateText.textContent = 'Generating...';
            generateLoader.classList.remove('hidden');
            generateBtn.disabled = true;
            errorAlert.classList.add('hidden');
            
            try {
              const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  sourceUrl,
                  sourceText: sourceText || sourceUrl, // Use URL as placeholder text for demo
                  sourceType,
                  outputTypes
                })
              });
              
              const result = await response.json();
              
              if (result.error) {
                throw new Error(result.error);
              }
              
              // Update credits
              document.getElementById('creditsRemaining').textContent = result.creditsRemaining;
              
              // Display outputs
              displayOutputs(result.outputs);
              
            } catch (error) {
              errorAlert.classList.remove('hidden');
              errorText.textContent = error.message || 'Something went wrong. Please try again.';
            } finally {
              generateText.textContent = 'Generate Content';
              generateLoader.classList.add('hidden');
              generateBtn.disabled = false;
            }
          }
          
          function displayOutputs(outputs) {
            const placeholder = document.getElementById('outputPlaceholder');
            const content = document.getElementById('outputContent');
            const copyAllBtn = document.getElementById('copyAllBtn');
            
            placeholder.classList.add('hidden');
            content.classList.remove('hidden');
            copyAllBtn.classList.remove('hidden');
            
            const formatNames = {
              tiktok_script: 'TikTok Script',
              twitter_thread: 'Twitter Thread',
              linkedin_post: 'LinkedIn Post',
              instagram_caption: 'Instagram Caption',
              hooks: 'Viral Hooks',
              hashtags: 'Smart Hashtags',
              blog_outline: 'Blog Outline',
              email_newsletter: 'Email Newsletter'
            };
            
            const formatIcons = {
              tiktok_script: 'fa-brands fa-tiktok',
              twitter_thread: 'fa-brands fa-twitter',
              linkedin_post: 'fa-brands fa-linkedin',
              instagram_caption: 'fa-brands fa-instagram',
              hooks: 'fas fa-lightbulb',
              hashtags: 'fas fa-hashtag',
              blog_outline: 'fas fa-blog',
              email_newsletter: 'fas fa-envelope'
            };
            
            content.innerHTML = Object.entries(outputs).map(([type, text]) => \`
              <div class="border border-gray-200 rounded-xl overflow-hidden">
                <div class="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
                  <div class="flex items-center gap-2">
                    <i class="\${formatIcons[type]} text-gray-500"></i>
                    <span class="font-medium text-gray-800">\${formatNames[type]}</span>
                  </div>
                  <button 
                    onclick="copyContent(this, '\${type}')"
                    class="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <i class="fas fa-copy mr-1"></i>
                    Copy
                  </button>
                </div>
                <div class="p-4 max-h-80 overflow-y-auto">
                  <pre class="text-sm text-gray-700 whitespace-pre-wrap font-sans" data-type="\${type}">\${escapeHtml(text)}</pre>
                </div>
              </div>
            \`).join('');
          }
          
          function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
          }
          
          function copyContent(btn, type) {
            const text = document.querySelector(\`pre[data-type="\${type}"]\`).textContent;
            navigator.clipboard.writeText(text).then(() => {
              const originalText = btn.innerHTML;
              btn.innerHTML = '<i class="fas fa-check mr-1"></i> Copied!';
              btn.classList.add('text-green-600');
              setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('text-green-600');
              }, 2000);
            });
          }
          
          function copyAllContent() {
            const allContent = [];
            document.querySelectorAll('#outputContent pre').forEach(pre => {
              allContent.push(pre.textContent);
            });
            navigator.clipboard.writeText(allContent.join('\\n\\n---\\n\\n')).then(() => {
              const btn = document.getElementById('copyAllBtn');
              const originalText = btn.innerHTML;
              btn.innerHTML = '<i class="fas fa-check mr-1"></i> All Copied!';
              btn.classList.add('text-green-600');
              setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('text-green-600');
              }, 2000);
            });
          }
        </script>
      `}
    </Layout>
  )
}

import { html } from 'hono/html'

type User = { id: string; email: string; name: string; plan: string; credits_used: number } | null

export const Layout = ({ children, title, user }: { children: any; title?: string; user?: User }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'ContentFlow AI'} - Repurpose Content Instantly</title>
        <meta name="description" content="Transform your YouTube videos and podcasts into viral TikTok scripts, Twitter threads, Instagram captions, and more with AI." />
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        {html`
          <script>
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    primary: {
                      50: '#f0f9ff',
                      100: '#e0f2fe',
                      200: '#bae6fd',
                      300: '#7dd3fc',
                      400: '#38bdf8',
                      500: '#0ea5e9',
                      600: '#0284c7',
                      700: '#0369a1',
                      800: '#075985',
                      900: '#0c4a6e',
                    },
                    accent: {
                      50: '#fdf4ff',
                      100: '#fae8ff',
                      200: '#f5d0fe',
                      300: '#f0abfc',
                      400: '#e879f9',
                      500: '#d946ef',
                      600: '#c026d3',
                      700: '#a21caf',
                      800: '#86198f',
                      900: '#701a75',
                    }
                  }
                }
              }
            }
          </script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            body { font-family: 'Inter', sans-serif; }
            .gradient-text {
              background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            .gradient-bg {
              background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%);
            }
            .gradient-border {
              background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%);
              padding: 2px;
              border-radius: 12px;
            }
            .gradient-border > * {
              background: white;
              border-radius: 10px;
            }
            .animate-float {
              animation: float 6s ease-in-out infinite;
            }
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-20px); }
            }
            .card-hover {
              transition: all 0.3s ease;
            }
            .card-hover:hover {
              transform: translateY(-5px);
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
          </style>
        `}
      </head>
      <body class="bg-gray-50 min-h-screen">
        {/* Navigation */}
        <nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
              <a href="/" class="flex items-center space-x-2">
                <div class="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                  <i class="fas fa-bolt text-white text-lg"></i>
                </div>
                <span class="text-xl font-bold gradient-text">ContentFlow AI</span>
              </a>
              
              <div class="hidden md:flex items-center space-x-8">
                <a href="/#features" class="text-gray-600 hover:text-gray-900 transition">Features</a>
                <a href="/pricing" class="text-gray-600 hover:text-gray-900 transition">Pricing</a>
                {user ? (
                  <>
                    <a href="/app" class="text-gray-600 hover:text-gray-900 transition">App</a>
                    <a href="/dashboard" class="text-gray-600 hover:text-gray-900 transition">Dashboard</a>
                    <div class="flex items-center space-x-4">
                      <span class="text-sm text-gray-500">
                        <i class="fas fa-coins text-yellow-500 mr-1"></i>
                        {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                      </span>
                      <button 
                        onclick="logout()" 
                        class="text-gray-600 hover:text-gray-900 transition"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <a href="/login" class="text-gray-600 hover:text-gray-900 transition">Login</a>
                    <a href="/signup" class="gradient-bg text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition">
                      Start Free
                    </a>
                  </>
                )}
              </div>
              
              <button class="md:hidden text-gray-600" onclick="toggleMobileMenu()">
                <i class="fas fa-bars text-xl"></i>
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          <div id="mobileMenu" class="hidden md:hidden bg-white border-t border-gray-100 px-4 py-4">
            <a href="/#features" class="block py-2 text-gray-600">Features</a>
            <a href="/pricing" class="block py-2 text-gray-600">Pricing</a>
            {user ? (
              <>
                <a href="/app" class="block py-2 text-gray-600">App</a>
                <a href="/dashboard" class="block py-2 text-gray-600">Dashboard</a>
                <button onclick="logout()" class="block py-2 text-gray-600 w-full text-left">Logout</button>
              </>
            ) : (
              <>
                <a href="/login" class="block py-2 text-gray-600">Login</a>
                <a href="/signup" class="block py-2 text-primary-600 font-medium">Start Free</a>
              </>
            )}
          </div>
        </nav>

        <main>
          {children}
        </main>

        {/* Footer */}
        <footer class="bg-gray-900 text-white py-12 mt-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-4 gap-8">
              <div>
                <div class="flex items-center space-x-2 mb-4">
                  <div class="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                    <i class="fas fa-bolt text-white text-sm"></i>
                  </div>
                  <span class="text-lg font-bold">ContentFlow AI</span>
                </div>
                <p class="text-gray-400 text-sm">
                  Transform your long-form content into viral social media posts with AI.
                </p>
              </div>
              <div>
                <h4 class="font-semibold mb-4">Product</h4>
                <ul class="space-y-2 text-gray-400 text-sm">
                  <li><a href="/#features" class="hover:text-white transition">Features</a></li>
                  <li><a href="/pricing" class="hover:text-white transition">Pricing</a></li>
                  <li><a href="/app" class="hover:text-white transition">App</a></li>
                </ul>
              </div>
              <div>
                <h4 class="font-semibold mb-4">Resources</h4>
                <ul class="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" class="hover:text-white transition">Blog</a></li>
                  <li><a href="#" class="hover:text-white transition">Help Center</a></li>
                  <li><a href="#" class="hover:text-white transition">API Docs</a></li>
                </ul>
              </div>
              <div>
                <h4 class="font-semibold mb-4">Legal</h4>
                <ul class="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" class="hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="#" class="hover:text-white transition">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
              © 2025 ContentFlow AI. All rights reserved.
            </div>
          </div>
        </footer>

        {html`
          <script>
            function toggleMobileMenu() {
              const menu = document.getElementById('mobileMenu');
              menu.classList.toggle('hidden');
            }
            
            async function logout() {
              await fetch('/api/auth/logout', { method: 'POST' });
              window.location.href = '/';
            }
          </script>
        `}
      </body>
    </html>
  )
}

import { html } from 'hono/html'
import { Layout } from './Layout'

export const AuthPage = ({ mode }: { mode: 'login' | 'signup' }) => {
  const isLogin = mode === 'login'
  
  return (
    <Layout title={isLogin ? 'Login' : 'Sign Up'}>
      <div class="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div class="max-w-md w-full">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p class="text-gray-600">
              {isLogin 
                ? 'Sign in to continue repurposing your content' 
                : 'Start creating viral content in minutes'}
            </p>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-8">
            <form id="authForm" class="space-y-6">
              {!isLogin && (
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="John Doe"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  />
                </div>
              )}

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input 
                  type="email" 
                  name="email" 
                  required
                  placeholder="you@example.com"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input 
                  type="password" 
                  name="password" 
                  required
                  minlength="6"
                  placeholder="••••••••"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div id="errorMessage" class="hidden text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              </div>

              <button 
                type="submit" 
                class="w-full gradient-bg text-white py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center"
              >
                <span id="btnText">{isLogin ? 'Sign In' : 'Create Account'}</span>
                <span id="btnLoader" class="hidden ml-2">
                  <i class="fas fa-spinner fa-spin"></i>
                </span>
              </button>
            </form>

            <div class="mt-6 text-center">
              <p class="text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <a 
                  href={isLogin ? '/signup' : '/login'} 
                  class="text-primary-600 font-medium hover:text-primary-700"
                >
                  {isLogin ? 'Sign up free' : 'Sign in'}
                </a>
              </p>
            </div>

            {!isLogin && (
              <div class="mt-6 pt-6 border-t border-gray-100">
                <p class="text-xs text-gray-500 text-center">
                  By creating an account, you agree to our{' '}
                  <a href="#" class="text-primary-600">Terms of Service</a> and{' '}
                  <a href="#" class="text-primary-600">Privacy Policy</a>.
                </p>
              </div>
            )}
          </div>

          {!isLogin && (
            <div class="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
              <div class="flex items-center">
                <i class="fas fa-check-circle text-green-500 mr-2"></i>
                5 free generations
              </div>
              <div class="flex items-center">
                <i class="fas fa-check-circle text-green-500 mr-2"></i>
                No credit card
              </div>
            </div>
          )}
        </div>
      </div>

      {html`
        <script>
          const isLogin = ${isLogin ? 'true' : 'false'};
          
          document.getElementById('authForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const form = e.target;
            const errorDiv = document.getElementById('errorMessage');
            const btnText = document.getElementById('btnText');
            const btnLoader = document.getElementById('btnLoader');
            
            // Show loading
            btnText.textContent = isLogin ? 'Signing in...' : 'Creating account...';
            btnLoader.classList.remove('hidden');
            errorDiv.classList.add('hidden');
            
            try {
              const formData = new FormData(form);
              const data = {
                email: formData.get('email'),
                password: formData.get('password'),
                name: formData.get('name')
              };
              
              const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
              const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
              });
              
              const result = await response.json();
              
              if (result.error) {
                throw new Error(result.error);
              }
              
              // Redirect on success
              window.location.href = result.redirect || '/app';
              
            } catch (error) {
              errorDiv.textContent = error.message || 'Something went wrong. Please try again.';
              errorDiv.classList.remove('hidden');
              btnText.textContent = isLogin ? 'Sign In' : 'Create Account';
              btnLoader.classList.add('hidden');
            }
          });
        </script>
      `}
    </Layout>
  )
}

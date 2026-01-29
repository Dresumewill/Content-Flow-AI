import { html } from 'hono/html'
import { Layout } from './Layout'

type User = { id: string; email: string; name: string; plan: string; credits_used: number } | null

export const PricingPage = ({ user }: { user: User }) => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out the platform',
      credits: 5,
      features: [
        '5 generations per month',
        'All output formats',
        'Basic support',
        'Export to clipboard'
      ],
      cta: user ? (user.plan === 'free' ? 'Current Plan' : 'Downgrade') : 'Get Started',
      highlighted: false,
      disabled: user?.plan === 'free'
    },
    {
      id: 'starter',
      name: 'Starter',
      price: '$9',
      period: '/month',
      description: 'For individual creators getting started',
      credits: 50,
      features: [
        '50 generations per month',
        'All output formats',
        'Priority support',
        'Export to clipboard',
        'Content history (30 days)'
      ],
      cta: user?.plan === 'starter' ? 'Current Plan' : 'Start Starter',
      highlighted: false,
      disabled: user?.plan === 'starter'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$19',
      period: '/month',
      description: 'For serious content creators',
      credits: 200,
      features: [
        '200 generations per month',
        'All output formats',
        'Priority support',
        'Export to clipboard',
        'Unlimited content history',
        'API access',
        'Custom brand voice (coming soon)'
      ],
      cta: user?.plan === 'pro' ? 'Current Plan' : 'Start Pro',
      highlighted: true,
      popular: true,
      disabled: user?.plan === 'pro'
    },
    {
      id: 'agency',
      name: 'Agency',
      price: '$49',
      period: '/month',
      description: 'For teams and agencies',
      credits: 1000,
      features: [
        '1,000 generations per month',
        'All output formats',
        'Dedicated support',
        'Export to clipboard',
        'Unlimited content history',
        'API access',
        'Custom brand voice',
        'Team collaboration (coming soon)',
        'White-label exports'
      ],
      cta: user?.plan === 'agency' ? 'Current Plan' : 'Start Agency',
      highlighted: false,
      disabled: user?.plan === 'agency'
    }
  ]

  return (
    <Layout title="Pricing" user={user}>
      {/* Pricing Header */}
      <section class="py-16 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent <span class="gradient-text">Pricing</span>
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees, cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section class="py-16 -mt-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                class={`relative bg-white rounded-2xl shadow-lg border-2 transition-all ${
                  plan.highlighted 
                    ? 'border-primary-500 scale-105 shadow-xl' 
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div class="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span class="gradient-bg text-white text-sm font-medium px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div class="p-6">
                  <h3 class="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p class="text-gray-500 text-sm mb-4">{plan.description}</p>
                  
                  <div class="mb-6">
                    <span class="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span class="text-gray-500">{plan.period}</span>
                  </div>

                  <div class="mb-6">
                    <div class="flex items-center gap-2 text-primary-600 font-medium">
                      <i class="fas fa-coins text-yellow-500"></i>
                      {plan.credits} generations/month
                    </div>
                  </div>

                  <button 
                    onclick={plan.disabled ? '' : `selectPlan('${plan.id}')`}
                    disabled={plan.disabled}
                    class={`w-full py-3 rounded-xl font-semibold transition ${
                      plan.disabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : plan.highlighted
                          ? 'gradient-bg text-white hover:opacity-90'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </button>

                  <ul class="mt-6 space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} class="flex items-start gap-2 text-sm text-gray-600">
                        <i class="fas fa-check text-green-500 mt-0.5"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section class="py-16 bg-gray-50">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div class="space-y-4">
            {[
              {
                q: 'What counts as one generation?',
                a: 'One generation is when you convert one piece of content (video, podcast, or text) into multiple output formats. You can select as many output formats as you want per generation - it still counts as one credit.'
              },
              {
                q: 'Do unused credits roll over?',
                a: 'Credits reset at the beginning of each billing cycle and do not roll over. We encourage you to use all your credits each month!'
              },
              {
                q: 'Can I upgrade or downgrade anytime?',
                a: 'Yes! You can change your plan at any time. When upgrading, you\'ll get immediate access to the new features. When downgrading, the change takes effect at the end of your billing cycle.'
              },
              {
                q: 'Is there a free trial?',
                a: 'Our Free plan gives you 5 generations per month forever - no credit card required. This lets you try out all features before committing to a paid plan.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe.'
              },
              {
                q: 'Can I get a refund?',
                a: 'We offer a 14-day money-back guarantee on all paid plans. If you\'re not satisfied, contact us within 14 days of your purchase for a full refund.'
              }
            ].map((faq, i) => (
              <div key={i} class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <button 
                  onclick={`toggleFaq(${i})`}
                  class="w-full flex items-center justify-between text-left"
                >
                  <h3 class="font-semibold text-gray-900">{faq.q}</h3>
                  <i class={`fas fa-chevron-down text-gray-400 transition-transform faq-icon-${i}`}></i>
                </button>
                <div class={`faq-content-${i} hidden mt-4 text-gray-600`}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="py-16">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Ready to 10x Your Content?
          </h2>
          <p class="text-xl text-gray-600 mb-8">
            Join thousands of creators who save hours every week.
          </p>
          <a 
            href={user ? '/app' : '/signup'} 
            class="inline-block gradient-bg text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition"
          >
            {user ? 'Start Creating' : 'Start Free Today'}
          </a>
        </div>
      </section>

      {html`
        <script>
          const isLoggedIn = ${user ? 'true' : 'false'};
          
          function toggleFaq(index) {
            const content = document.querySelector('.faq-content-' + index);
            const icon = document.querySelector('.faq-icon-' + index);
            
            content.classList.toggle('hidden');
            icon.classList.toggle('rotate-180');
          }
          
          async function selectPlan(planId) {
            if (!isLoggedIn) {
              window.location.href = '/signup?plan=' + planId;
              return;
            }
            
            if (planId === 'free') {
              // Handle downgrade
              if (confirm('Are you sure you want to downgrade to the Free plan? You will lose access to premium features at the end of your billing cycle.')) {
                // In production, call API to cancel subscription
                alert('Subscription management coming soon! Contact support for changes.');
              }
              return;
            }
            
            // Create checkout session
            try {
              const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: planId })
              });
              
              const data = await response.json();
              
              if (data.url) {
                // In production, this would redirect to Stripe Checkout
                alert(data.message || 'Redirecting to checkout...');
                // window.location.href = data.url;
              }
            } catch (error) {
              alert('Something went wrong. Please try again.');
            }
          }
        </script>
      `}
    </Layout>
  )
}

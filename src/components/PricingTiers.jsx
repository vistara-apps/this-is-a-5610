import React from 'react'
import { Check, Star, Zap, Crown } from 'lucide-react'

const PricingTiers = ({ currentTier, onSelectTier }) => {
  const tiers = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      icon: Zap,
      description: 'Perfect for getting started',
      features: [
        '3 interactive elements per month',
        'Basic AI summaries',
        'Standard embed widgets',
        'Community support'
      ],
      limitations: [
        'Limited to 3 elements/month',
        'Basic analytics only'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$15',
      period: 'month',
      icon: Star,
      description: 'Ideal for content creators',
      features: [
        'Unlimited interactive elements',
        'Advanced AI summaries',
        'Custom embed styling',
        'Basic analytics dashboard',
        'Email support',
        'Export functionality'
      ],
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$30',
      period: 'month',
      icon: Crown,
      description: 'For power users and teams',
      features: [
        'Everything in Pro',
        'Advanced analytics & insights',
        'A/B testing for elements',
        'Custom branding removal',
        'Priority support',
        'API access',
        'Team collaboration',
        'White-label solutions'
      ]
    }
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600">Start free and scale as you grow</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier) => {
          const Icon = tier.icon
          const isSelected = currentTier === tier.id
          
          return (
            <div 
              key={tier.id}
              className={`relative card transition-all duration-200 hover:shadow-lg ${
                tier.popular ? 'ring-2 ring-primary' : ''
              } ${isSelected ? 'ring-2 ring-accent' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <Icon className={`w-12 h-12 mx-auto mb-4 ${
                  tier.id === 'free' ? 'text-gray-500' :
                  tier.id === 'pro' ? 'text-primary' : 'text-accent'
                }`} />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-gray-600 mb-4">{tier.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                  <span className="text-gray-600">/{tier.period}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
                
                {tier.limitations && (
                  <div className="pt-3 border-t">
                    {tier.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-start space-x-3 text-sm text-gray-500">
                        <span>•</span>
                        <span>{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => onSelectTier(tier.id)}
                className={`w-full py-3 px-6 rounded-md font-semibold transition-colors ${
                  isSelected
                    ? 'bg-accent text-white'
                    : tier.popular
                    ? 'bg-primary text-white hover:bg-blue-600'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {isSelected ? 'Current Plan' : 
                 tier.id === 'free' ? 'Get Started' : 'Upgrade Now'}
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          Need a custom solution? <a href="#" className="text-primary hover:underline">Contact us</a> for enterprise pricing.
        </p>
        <div className="flex justify-center space-x-8 text-sm text-gray-500">
          <span>✓ 30-day money-back guarantee</span>
          <span>✓ Cancel anytime</span>
          <span>✓ No setup fees</span>
        </div>
      </div>
    </div>
  )
}

export default PricingTiers
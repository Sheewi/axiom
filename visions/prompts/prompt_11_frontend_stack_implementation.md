# Frontend Technology Stack Implementation Guide

## Technology Stack Clarification & Implementation

### Primary Frontend Architecture: Next.js + React + TypeScript

Based on the environment feedback, the frontend implementation uses **Next.js with React and TypeScript**, not Python. This guide provides comprehensive implementation for the subscription-based platform across web, desktop, and mobile applications.

## Web Platform Implementation (Next.js + React + TypeScript)

### Project Structure

```
axiom-platform/
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── verify/
│   │   ├── (dashboard)/
│   │   │   ├── overview/
│   │   │   ├── bots/
│   │   │   ├── analytics/
│   │   │   ├── settings/
│   │   │   └── billing/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── bots/
│   │   │   ├── payments/
│   │   │   └── analytics/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── auth/              # Authentication components
│   │   └── bots/              # Bot management components
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── database.ts
│   │   ├── payments.ts
│   │   └── utils.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── bots.ts
│   │   └── payments.ts
│   └── styles/
├── public/
├── prisma/
├── .env.local
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

### Color Scheme Implementation (globals.css)

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Primary Colors */
  --primary-50: #f0f9ff;
  --primary-100: #e0f2fe;
  --primary-200: #bae6fd;
  --primary-300: #7dd3fc;
  --primary-400: #38bdf8;
  --primary-500: #0ea5e9;    /* Main primary */
  --primary-600: #0284c7;
  --primary-700: #0369a1;
  --primary-800: #075985;
  --primary-900: #0c4a6e;

  /* Background Colors */
  --background-primary: #ffffff;
  --background-secondary: #f8fafc;
  --background-tertiary: #f1f5f9;
  --background-dark: #0f172a;
  --background-dark-secondary: #1e293b;

  /* Accent Colors */
  --accent-purple: #8b5cf6;
  --accent-green: #10b981;
  --accent-orange: #f59e0b;
  --accent-red: #ef4444;

  /* Text Colors */
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  --text-white: #ffffff;

  /* Border Colors */
  --border-light: #e2e8f0;
  --border-medium: #cbd5e1;
  --border-dark: #475569;
}

[data-theme="dark"] {
  --background-primary: #0f172a;
  --background-secondary: #1e293b;
  --background-tertiary: #334155;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
}

.bg-primary {
  background-color: var(--primary-500);
}

.bg-background {
  background-color: var(--background-primary);
}

.bg-background-secondary {
  background-color: var(--background-secondary);
}

.text-primary {
  color: var(--text-primary);
}

.text-secondary {
  color: var(--text-secondary);
}

.border-light {
  border-color: var(--border-light);
}

/* Custom component styles */
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.gradient-primary {
  background: linear-gradient(135deg, var(--primary-500), var(--accent-purple));
}

.gradient-accent {
  background: linear-gradient(135deg, var(--accent-purple), var(--accent-green));
}

.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
```

### Tailwind Configuration

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
        },
        background: {
          primary: 'var(--background-primary)',
          secondary: 'var(--background-secondary)',
          tertiary: 'var(--background-tertiary)',
          dark: 'var(--background-dark)',
          'dark-secondary': 'var(--background-dark-secondary)',
        },
        accent: {
          purple: 'var(--accent-purple)',
          green: 'var(--accent-green)',
          orange: 'var(--accent-orange)',
          red: 'var(--accent-red)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          white: 'var(--text-white)',
        },
        border: {
          light: 'var(--border-light)',
          medium: 'var(--border-medium)',
          dark: 'var(--border-dark)',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### Authentication & Identity Management

```typescript
// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './database'
import bcrypt from 'bcrypt'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { subscription: true }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        
        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscriptionStatus: user.subscription?.status,
          isEmailVerified: user.emailVerified !== null
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role
        token.subscriptionStatus = user.subscriptionStatus
        token.isEmailVerified = user.isEmailVerified
      }

      if (trigger === 'update' && session) {
        token = { ...token, ...session }
      }

      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role,
          subscriptionStatus: token.subscriptionStatus,
          isEmailVerified: token.isEmailVerified
        }
      }
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  pages: {
    signIn: '/login',
    signUp: '/signup',
    verifyRequest: '/verify-email',
    error: '/auth/error'
  }
}
```

### Subscription Management System

```typescript
// src/lib/payments.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  stripePriceId: string
  popular?: boolean
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individuals getting started',
    price: 29,
    interval: 'month',
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID!,
    features: [
      '3 Active Bots',
      'Basic Analytics',
      'Email Support',
      '50 API Calls/day',
      'Community Access'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For serious entrepreneurs and businesses',
    price: 79,
    interval: 'month',
    stripePriceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID!,
    popular: true,
    features: [
      '10 Active Bots',
      'Advanced Analytics',
      'Priority Support',
      '500 API Calls/day',
      'Custom Integrations',
      'Tax Compliance Tools',
      'Revenue Optimization'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Unlimited potential for large organizations',
    price: 199,
    interval: 'month',
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    features: [
      'Unlimited Bots',
      'Real-time Analytics',
      '24/7 Dedicated Support',
      'Unlimited API Calls',
      'White-label Solutions',
      'Advanced Compliance',
      'Custom Bot Development',
      'Enterprise SLA'
    ]
  }
]

export async function createCheckoutSession(
  priceId: string,
  userId: string,
  userEmail: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      billing_address_collection: 'required',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
      metadata: {
        userId,
      },
      subscription_data: {
        metadata: {
          userId,
        },
      },
      tax_id_collection: {
        enabled: true,
      },
      automatic_tax: {
        enabled: true,
      },
    })

    return { sessionId: session.id, url: session.url }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw new Error('Failed to create checkout session')
  }
}

export async function createBillingPortalSession(customerId: string) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXTAUTH_URL}/dashboard/billing`,
    })

    return { url: session.url }
  } catch (error) {
    console.error('Error creating billing portal session:', error)
    throw new Error('Failed to create billing portal session')
  }
}
```

### Tax Compliance Integration

```typescript
// src/lib/tax-compliance.ts
import { TaxJar } from 'taxjar'

const taxjar = new TaxJar({
  apiKey: process.env.TAXJAR_API_KEY!,
  apiUrl: process.env.NODE_ENV === 'production' 
    ? TaxJar.DEFAULT_API_URL 
    : TaxJar.SANDBOX_API_URL
})

export interface TaxInfo {
  userId: string
  taxId?: string
  businessType: 'individual' | 'business'
  country: string
  state?: string
  address: {
    line1: string
    line2?: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export interface TaxCalculation {
  subtotal: number
  taxAmount: number
  total: number
  taxRate: number
  breakdown: {
    stateTax: number
    localTax: number
    gst?: number
    vat?: number
  }
}

export async function calculateTax(
  amount: number,
  userAddress: TaxInfo['address'],
  productType: 'subscription' | 'service' = 'subscription'
): Promise<TaxCalculation> {
  try {
    const taxCalculation = await taxjar.taxForOrder({
      from_country: 'US',
      from_zip: '94107',
      from_state: 'CA',
      from_city: 'San Francisco',
      from_street: '600 Montgomery St',
      to_country: userAddress.country,
      to_zip: userAddress.zipCode,
      to_state: userAddress.state,
      to_city: userAddress.city,
      to_street: userAddress.line1,
      amount: amount,
      shipping: 0,
      line_items: [
        {
          id: '1',
          quantity: 1,
          product_tax_code: productType === 'subscription' ? '30070' : '10010',
          unit_price: amount,
          discount: 0
        }
      ]
    })

    return {
      subtotal: amount,
      taxAmount: taxCalculation.tax.amount_to_collect,
      total: amount + taxCalculation.tax.amount_to_collect,
      taxRate: taxCalculation.tax.rate,
      breakdown: {
        stateTax: taxCalculation.tax.breakdown?.state_tax_rate || 0,
        localTax: taxCalculation.tax.breakdown?.county_tax_rate || 0,
        gst: taxCalculation.tax.breakdown?.gst || 0,
        vat: taxCalculation.tax.breakdown?.vat || 0
      }
    }
  } catch (error) {
    console.error('Tax calculation error:', error)
    // Fallback to basic calculation
    return {
      subtotal: amount,
      taxAmount: 0,
      total: amount,
      taxRate: 0,
      breakdown: {
        stateTax: 0,
        localTax: 0
      }
    }
  }
}

export async function createTaxRecord(
  transactionId: string,
  userId: string,
  amount: number,
  taxAmount: number,
  userAddress: TaxInfo['address']
) {
  try {
    const order = await taxjar.createOrder({
      transaction_id: transactionId,
      transaction_date: new Date().toISOString().split('T')[0],
      from_country: 'US',
      from_zip: '94107',
      from_state: 'CA',
      from_city: 'San Francisco',
      from_street: '600 Montgomery St',
      to_country: userAddress.country,
      to_zip: userAddress.zipCode,
      to_state: userAddress.state,
      to_city: userAddress.city,
      to_street: userAddress.line1,
      amount: amount,
      shipping: 0,
      sales_tax: taxAmount,
      line_items: [
        {
          id: '1',
          quantity: 1,
          product_identifier: 'axiom-subscription',
          description: 'Axiom Bot Platform Subscription',
          unit_price: amount,
          discount: 0,
          sales_tax: taxAmount
        }
      ]
    })

    return order
  } catch (error) {
    console.error('Tax record creation error:', error)
    throw error
  }
}
```

### Dashboard Components

```typescript
// src/components/dashboard/BotCard.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { Bot, TrendingUp, DollarSign, Activity } from 'lucide-react'

interface BotCardProps {
  bot: {
    id: string
    name: string
    type: string
    status: 'active' | 'inactive' | 'error'
    dailyRevenue: number
    totalRevenue: number
    tasksCompleted: number
    efficiency: number
  }
  onManage: (botId: string) => void
}

export const BotCard: React.FC<BotCardProps> = ({ bot, onManage }) => {
  const statusColors = {
    active: 'bg-accent-green text-white',
    inactive: 'bg-text-muted text-white',
    error: 'bg-accent-red text-white'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background-primary border border-border-light rounded-xl p-6 card-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Bot className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{bot.name}</h3>
            <p className="text-sm text-text-secondary">{bot.type}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[bot.status]}`}>
          {bot.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-accent-green" />
          <div>
            <p className="text-xs text-text-secondary">Daily Revenue</p>
            <p className="text-sm font-semibold text-text-primary">${bot.dailyRevenue}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-primary-500" />
          <div>
            <p className="text-xs text-text-secondary">Total Revenue</p>
            <p className="text-sm font-semibold text-text-primary">${bot.totalRevenue}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-accent-purple" />
          <div>
            <p className="text-xs text-text-secondary">Tasks</p>
            <p className="text-sm font-semibold text-text-primary">{bot.tasksCompleted}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 rounded-full bg-primary-500"></div>
          <div>
            <p className="text-xs text-text-secondary">Efficiency</p>
            <p className="text-sm font-semibold text-text-primary">{bot.efficiency}%</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => onManage(bot.id)}
        className="w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200"
      >
        Manage Bot
      </button>
    </motion.div>
  )
}
```

### API Routes

```typescript
// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/database'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  businessType: z.enum(['individual', 'business']),
  country: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Must accept terms and conditions'
  })
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        businessType: validatedData.businessType,
        country: validatedData.country,
        role: 'user'
      }
    })

    // Send verification email
    await sendVerificationEmail(user.email, user.id)

    return NextResponse.json({
      message: 'User created successfully. Please check your email for verification.',
      userId: user.id
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function sendVerificationEmail(email: string, userId: string) {
  // Implementation for sending verification email
  // Using services like SendGrid, Resend, or AWS SES
}
```

This comprehensive frontend implementation provides a modern, scalable, and compliant subscription-based platform using Next.js, React, and TypeScript with proper authentication, tax compliance, and subscription management.

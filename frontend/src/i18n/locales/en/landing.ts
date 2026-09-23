export default {
  batchImageGuide: {
    title: 'Batch Image Generation',
    description: 'Submit multiple prompts in one job and download the generated images when complete'
  },
  // Home Page
  home: {
    viewOnGithub: 'View on GitHub',
    viewDocs: 'View Documentation',
    docs: 'Docs',
    switchToLight: 'Switch to Light Mode',
    switchToDark: 'Switch to Dark Mode',
    dashboard: 'Dashboard',
    login: 'Login',
    getStarted: 'Get Started',
    goToDashboard: 'Go to Dashboard',
    // User-focused value proposition
    heroSubtitle: 'One Key, All AI Models',
    heroDescription: 'No need to manage multiple subscriptions. Access Claude, GPT, Gemini and more with a single API key',
    tags: {
      subscriptionToApi: 'Subscription to API',
      stickySession: 'Session Persistence',
      realtimeBilling: 'Pay As You Go'
    },
    // Pain points section
    painPoints: {
      title: 'Sound Familiar?',
      items: {
        expensive: {
          title: 'High Subscription Costs',
          desc: 'Paying for multiple AI subscriptions that add up every month'
        },
        complex: {
          title: 'Account Chaos',
          desc: 'Managing scattered accounts and API keys across different platforms'
        },
        unstable: {
          title: 'Service Interruptions',
          desc: 'Single accounts hitting rate limits and disrupting your workflow'
        },
        noControl: {
          title: 'No Usage Control',
          desc: "Can't track where your money goes or limit team member usage"
        }
      }
    },
    // Solutions section
    solutions: {
      title: 'We Solve These Problems',
      subtitle: 'Three simple steps to stress-free AI access'
    },
    features: {
      unifiedGateway: 'One-Click Access',
      unifiedGatewayDesc: 'Get a single API key to call all connected AI models. No separate applications needed.',
      multiAccount: 'Always Reliable',
      multiAccountDesc: 'Smart routing across multiple upstream accounts with automatic failover. Say goodbye to errors.',
      balanceQuota: 'Pay What You Use',
      balanceQuotaDesc: 'Usage-based billing with quota limits. Full visibility into team consumption.'
    },
    // Comparison section
    comparison: {
      title: 'Why Choose Us?',
      headers: {
        feature: 'Comparison',
        official: 'Official Subscriptions',
        us: 'Our Platform'
      },
      items: {
        pricing: {
          feature: 'Pricing',
          official: 'Fixed monthly fee, pay even if unused',
          us: 'Pay only for what you use'
        },
        models: {
          feature: 'Model Selection',
          official: 'Single provider only',
          us: 'Switch between models freely'
        },
        management: {
          feature: 'Account Management',
          official: 'Manage each service separately',
          us: 'Unified key, one dashboard'
        },
        stability: {
          feature: 'Stability',
          official: 'Single account rate limits',
          us: 'Multi-account pool, auto-failover'
        },
        control: {
          feature: 'Usage Control',
          official: 'Not available',
          us: 'Quotas & detailed analytics'
        }
      }
    },
    providers: {
      title: 'Supported AI Models',
      description: 'One API, Multiple Choices',
      supported: 'Supported',
      soon: 'Soon',
      claude: 'Claude',
      gemini: 'Gemini',
      antigravity: 'Antigravity',
      more: 'More'
    },
    // CTA section
    cta: {
      title: 'Ready to Get Started?',
      description: 'Sign up now and get free trial credits to experience seamless AI access',
      button: 'Sign Up Free'
    },
    storefront: {
      register: 'Create account',
      viewPrices: 'See prices',
      headline: 'One API key for Claude, GPT, and Gemini.',
      subhead: 'Call the models this site has open. Pay from a balance, a subscription, or a redeem code.',
      nav: {
        models: 'Models',
        offers: 'Ways to pay',
        connect: 'Connect'
      },
      trust: {
        openai: 'OpenAI-compatible',
        anthropic: 'Anthropic-compatible',
        billing: 'Billed by token, request, or image',
        logs: 'A log for every request'
      },
      offers: {
        title: 'Ways to pay',
        walletEyebrow: 'Balance',
        walletTitle: 'Pay per call',
        walletBody: 'Add balance and spend it as you call models. Fits work that comes and goes.',
        walletCta: 'Add balance',
        subscriptionEyebrow: 'Subscription',
        subscriptionTitle: 'A quota for the month',
        subscriptionBody: 'A group quota for steady use, beside the running balance.',
        subscriptionCta: 'View plans',
        redeemEyebrow: 'Redeem code',
        redeemTitle: 'Use a code you already have',
        redeemBody: 'A code can add balance or open a model group. It applies as soon as you redeem it.',
        redeemCta: 'Redeem a code'
      },
      shelf: {
        title: 'Models and standard prices',
        description: 'Standard rates from the model catalog. Peak hours and long-context tiers are on the full price list.',
        viewAll: 'View all models',
        model: 'Model',
        platform: 'Platform',
        input: 'Input',
        output: 'Output',
        price: 'Price',
        pricesUnavailable: 'Prices are not published on this page yet.',
        perMillion: '/ 1M tokens'
      },
      connect: {
        title: 'Connect in four steps',
        step1Title: 'Create an account',
        step1Body: 'Use the button in the header to sign up or sign in.',
        step2Title: 'Add a way to pay',
        step2Body: 'Add balance, buy a subscription, or redeem a code.',
        step3Title: 'Create an API key',
        step3Body: 'On the Keys page, create a key and choose the model group it can call.',
        step4Title: 'Point your client at this site',
        step4Body: 'Paste the base URL and the key into Claude Code, Codex, Gemini CLI, or any OpenAI or Anthropic client.',
        snippetLabel: 'Example request',
        copy: 'Copy',
        copied: 'Copied'
      },
      assurance: {
        title: 'You can see the spend',
        priceTitle: 'Prices before you call',
        priceBody: 'The catalog lists the rate for each model.',
        usageTitle: 'Usage by key and by day',
        usageBody: 'The Usage page records each request, the model, and the cost.',
        limitsTitle: 'Limits on each key',
        limitsBody: 'A key can carry a balance cap, a request rate, and a daily or weekly limit.',
        failoverTitle: 'Another channel when one fails',
        failoverBody: 'A failed channel hands the request to another open channel.',
        monitor: 'Channel status'
      },
      compare: {
        title: 'What this site includes',
        feature: 'Item',
        value: 'On this site',
        priceFeature: 'Price',
        priceValue: 'The published rate for each call',
        modelsFeature: 'Models',
        modelsValue: 'One key for every model this site publishes',
        dashboardFeature: 'Dashboard',
        dashboardValue: 'Balance, keys, and usage on one page',
        limitsFeature: 'Limits',
        limitsValue: 'A cap, a request rate, and a daily or weekly limit on each key'
      },
      faq: {
        title: 'Questions',
        billingQ: 'When is the balance charged?',
        billingA: 'Each call is charged at the model rate in the catalog. This page shows the standard rate. The model list shows peak hours and long-context tiers.',
        expiryQ: 'When does a key expire?',
        expiryA: 'You set the expiry when you create the key. A key with no expiry stays until you delete it.',
        clientsQ: 'Which clients can connect?',
        clientsA: 'Any client that accepts an OpenAI or Anthropic base URL, including Claude Code, Codex, and Gemini CLI.',
        logsQ: 'Where are the request logs?',
        logsA: 'The Usage page lists requests by key, model, and day.',
        contactQ: 'How do I reach someone?',
        contactA: 'Use the contact line below when the operator has published one, or the documentation link in the footer.'
      },
      stage: {
        listLabel: 'Models on the routing stage',
        decorativeHint: 'Prices appear here once the model catalog is open.',
        input: 'Input',
        output: 'Output'
      },
      footer: {
        models: 'Models',
        login: 'Log in'
      }
    },
    footer: {
      allRightsReserved: 'All rights reserved.'
    }
  },

  // Key Usage Query Page
  keyUsage: {
    title: 'API Key Usage',
    subtitle: 'Enter your API Key to view real-time spending and usage status',
    placeholder: 'sk-ant-mirror-xxxxxxxxxxxx',
    query: 'Query',
    querying: 'Querying...',
    privacyNote: 'Your Key is processed locally in the browser and will not be stored',
    dateRange: 'Date Range:',
    dateRangeToday: 'Today',
    dateRange7d: '7 Days',
    dateRange30d: '30 Days',
    dateRange90d: '90 Days',
    dateRangeCustom: 'Custom',
    apply: 'Apply',
    used: 'Used',
    detailInfo: 'Detail Information',
    tokenStats: 'Token Statistics',
    dailyDetail: 'Daily Detail',
    modelStats: 'Model Usage Statistics',
    // Table headers
    date: 'Date',
    model: 'Model',
    requests: 'Requests',
    inputTokens: 'Input Tokens',
    outputTokens: 'Output Tokens',
    cacheCreationTokens: 'Cache Creation',
    cacheReadTokens: 'Cache Read',
    cacheWriteTokens: 'Cache Write',
    totalTokens: 'Total Tokens',
    cost: 'Cost',
    // Status
    quotaMode: 'Key Quota Mode',
    walletBalance: 'Wallet Balance',
    // Ring card titles
    totalQuota: 'Total Quota',
    limit5h: '5-Hour Limit',
    limitDaily: 'Daily Limit',
    limit7d: '7-Day Limit',
    limitWeekly: 'Weekly Limit',
    limitMonthly: 'Monthly Limit',
    // Detail rows
    remainingQuota: 'Remaining Quota',
    expiresAt: 'Expires At',
    todayExpires: '(expires today)',
    daysLeft: '({days} days)',
    usedQuota: 'Used Quota',
    resetNow: 'Resetting soon',
    subscriptionType: 'Subscription Type',
    billingType: 'Billing Type',
    subscriptionExpires: 'Subscription Expires',
    // Usage stat cells
    todayRequests: 'Today Requests',
    todayInputTokens: 'Today Input',
    todayOutputTokens: 'Today Output',
    todayTokens: 'Today Tokens',
    todayCacheCreation: 'Today Cache Creation',
    todayCacheRead: 'Today Cache Read',
    todayCost: 'Today Cost',
    rpmTpm: 'RPM / TPM',
    totalRequests: 'Total Requests',
    totalInputTokens: 'Total Input',
    totalOutputTokens: 'Total Output',
    totalTokensLabel: 'Total Tokens',
    totalCacheCreation: 'Total Cache Creation',
    totalCacheRead: 'Total Cache Read',
    totalCost: 'Total Cost',
    avgDuration: 'Avg Duration',
    // Messages
    enterApiKey: 'Please enter an API Key',
    querySuccess: 'Query successful',
    queryFailed: 'Query failed',
    queryFailedRetry: 'Query failed, please try again later',
    noDailyUsage: 'No daily usage data',
  },

  // Setup Wizard
  setup: {
    title: 'Sub2API Setup',
    description: 'Configure your Sub2API instance',
    database: {
      title: 'Database Configuration',
      description: 'Connect to your PostgreSQL database',
      host: 'Host',
      port: 'Port',
      username: 'Username',
      password: 'Password',
      databaseName: 'Database Name',
      sslMode: 'SSL Mode',
      passwordPlaceholder: 'Password',
      ssl: {
        disable: 'Disable',
        require: 'Require',
        verifyCa: 'Verify CA',
        verifyFull: 'Verify Full'
      }
    },
    redis: {
      title: 'Redis Configuration',
      description: 'Connect to your Redis server',
      host: 'Host',
      port: 'Port',
      username: 'Username (optional)',
      password: 'Password (optional)',
      database: 'Database',
      usernamePlaceholder: 'Leave empty for default user',
      passwordPlaceholder: 'Password',
      enableTls: 'Enable TLS',
      enableTlsHint: 'Use TLS when connecting to Redis (public CA certs)'
    },
    admin: {
      title: 'Admin Account',
      description: 'Create your administrator account',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      passwordPlaceholder: 'Min 8 characters',
      confirmPasswordPlaceholder: 'Confirm password',
      passwordMismatch: 'Passwords do not match'
    },
    ready: {
      title: 'Ready to Install',
      description: 'Review your configuration and complete setup',
      database: 'Database',
      redis: 'Redis',
      adminEmail: 'Admin Email'
    },
    status: {
      testing: 'Testing...',
      success: 'Connection Successful',
      testConnection: 'Test Connection',
      installing: 'Installing...',
      completeInstallation: 'Complete Installation',
      completed: 'Installation completed!',
      redirecting: 'Redirecting to login page...',
      restarting: 'Service is restarting, please wait...',
      timeout: 'Service restart is taking longer than expected. Please refresh the page manually.'
    }
  },

  // Common
}

const en = {
  common: {
    requestDemo: 'Request demo',
    signIn: 'Sign in',
    signOut: 'Sign out',
    email: 'Email',
    password: 'Password',
    rememberMe: 'Remember me',
    or: 'or',
    cancel: 'Cancel',
    save: 'Save',
    create: 'Create',
    update: 'Update',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    back: 'Back',
    name: 'Name',
    search: 'Search',
    filters: 'Filters',
    status: 'Status',
    actions: 'Actions',
    loading: 'Loading...',
    upload: 'Upload',
    apply: 'Apply',
    reset: 'Reset',
    total: 'Total',
    description: 'Description',
    language: 'Language',
    phone: 'Phone',
    createdAt: 'Created at',
    continue: 'Continue',
    accept: 'Accept & save',
    open: 'Open',
    error: 'Error',
    success: 'Success'
  },
  navigation: {
    overview: 'Overview',
    merchants: 'Merchants',
    whatsappLines: 'WhatsApp lines',
    settings: 'Settings',
    orders: 'Orders',
    sessions: 'Sessions',
    menu: 'Menu',
    menuImport: 'Menu import',
    demo: 'Demo'
  },
  landing: {
    heroTitle: 'Automate your WhatsApp orders with AI',
    heroSubtitle: 'An AI assistant replies instantly, captures every detail, and updates your dashboard without extra staff.',
    primaryCta: 'Request demo',
    secondaryCta: 'Sign in',
    chatCustomer: 'Can I order 2 margarita pizzas for delivery?',
    chatAssistant: 'Of course! Confirming 2 margarita pizzas to your saved address. Pay on delivery?',
    stepsTitle: 'How it works',
    steps: [
      {
        title: 'Customer writes on WhatsApp',
        description: 'They text your existing number—no new app or friction.'
      },
      { title: 'AI assistant handles the order', description: 'Understands intent, validates address and payment.' },
      { title: 'Order appears on your dashboard', description: 'Live updates, status changes, and ticket details.' },
      { title: 'Restaurant prepares & delivers', description: 'Your team just cooks—AI handles the chat.' }
    ],
    featuresTitle: 'Built for modern restaurants',
    features: [
      { title: 'AI-powered ordering', description: 'Trained on hospitality flows to answer quickly and upsell.' },
      { title: 'Menu import from photos', description: 'Upload pictures of your menu; AI structures items automatically.' },
      { title: 'Real-time order dashboard', description: 'Filter, search, and update statuses with live events.' },
      { title: 'Multi-store support', description: 'Manage several locations with roles and separate lines.' }
    ],
    merchantsTitle: 'For merchants',
    merchantsBullets: [
      'Connect your WhatsApp line with Meta Embedded Signup directly in the dashboard.',
      'AI starts answering in minutes with your menu and policies.',
      'Monitor sessions, orders, and menu availability from one place.'
    ],
    pricingTitle: 'Pricing',
    pricingSubtitle: 'Simple plans that grow with you.',
    plans: [
      { name: 'Starter', price: '$49', description: 'Single store, AI chat, live dashboard.' },
      { name: 'Growth', price: '$99', description: 'Multiple stores, priority AI, menu import.' },
      { name: 'Scale', price: 'Let’s talk', description: 'Custom onboarding and SLAs.' }
    ],
    faqTitle: 'FAQ',
    faq: [
      { q: 'How fast can we go live?', a: 'Most merchants launch the same day after connecting WhatsApp and importing the menu.' },
      { q: 'Can we use our existing number?', a: 'Yes. Connect through Meta Embedded Signup to keep your phone number.' },
      { q: 'Is there a dashboard for staff?', a: 'Yes. Orders, sessions, and menu updates are all available with real-time refresh.' }
    ],
    footer: {
      terms: 'Terms',
      privacy: 'Privacy',
      contact: 'Contact'
    }
  },
  auth: {
    title: 'Sign in to libi',
    subtitle: 'Access your AI ordering workspace.',
    submit: 'Sign in',
    demoTitle: 'Request a demo',
    demoSubtitle: 'We will reach out to show you how libi can automate your WhatsApp orders.',
    request: 'Request demo'
  },
  admin: {
    overviewTitle: 'Platform overview',
    merchants: 'Merchants',
    totalOrders: 'Total orders',
    totalLines: 'WhatsApp lines',
    dailyOrders: 'Daily orders',
    merchantsListTitle: 'Manage merchants',
    merchantFormTitle: 'Merchant details',
    whatsappLinesTitle: 'WhatsApp lines',
    whatsappLineDetail: 'Line detail'
  },
  merchant: {
    overviewTitle: 'Merchant overview',
    quickLinks: 'Quick links',
    orders: 'Orders',
    sessions: 'Sessions',
    ordersToday: 'Orders today',
    ordersWeek: 'Orders this week',
    ordersByStatus: 'Orders by status',
    lastSevenDays: 'Orders last 7 days'
  },
  orders: {
    title: 'Orders',
    orderId: 'Order ID',
    customer: 'Customer',
    total: 'Total',
    status: 'Status',
    createdAt: 'Created at',
    detail: 'Order detail',
    deliveryType: 'Delivery type',
    address: 'Address',
    paymentMethod: 'Payment method',
    notes: 'Notes',
    items: 'Items',
    statusTimeline: 'Status timeline',
    advanceStatus: 'Advance status',
    newOrder: 'New order',
    paymentProof: 'Payment proof',
    paymentStatus: {
      awaitingProof: 'Awaiting payment proof',
      proofReceived: 'Proof received',
      verified: 'Payment verified',
      rejected: 'Payment rejected'
    },
    paymentStatusLabel: 'Payment status',
    verifyPayment: 'Verify payment',
    rejectPayment: 'Reject payment',
    awaitingPaymentProofFilter: 'Awaiting payment proof',
    paymentVerificationSuccess: 'Payment verification updated.',
    paymentProofReceived: 'Payment proof received.',
    paymentProofMissing: 'Payment proof is required before verifying.',
    filters: {
      status: 'Status',
      dateRange: 'Date range',
      search: 'Phone or order ID'
    },
    liveBoard: {
      pulse: 'Live feed',
      title: 'Active orders',
      subtitle: 'Only what needs attention: pending, in prep, ready or delivering.',
      activeCount: 'Active: {count}',
      newCount: 'New: {count}',
      refresh: 'Refresh',
      emptyStatus: 'No orders in this column',
      newLabel: 'New',
      open: 'Open order'
    }
  },
  paymentAccounts: {
    title: 'Payment accounts',
    description: 'Accounts used for customer transfers. Only active accounts are shown in confirmation messages.',
    add: 'Add account',
    edit: 'Edit account',
    deleteConfirm: 'Are you sure you want to delete this payment account?',
    empty: 'No payment accounts configured yet.',
    type: 'Type',
    accountNumber: 'Account number',
    accountHolder: 'Account holder',
    bankName: 'Bank name',
    descriptionLabel: 'Description',
    isActive: 'Active',
    activeHint: 'Show this account in the transfer instructions sent to customers.',
    actions: 'Actions',
    form: {
      createTitle: 'Add payment account',
      editTitle: 'Edit payment account'
    },
    types: {
      NEQUI: 'Nequi',
      BANCOLOMBIA: 'Bancolombia',
      DAVIPLATA: 'Daviplata',
      BANK_ACCOUNT: 'Bank account',
      OTHER: 'Other'
    }
  },
  sessions: {
    title: 'Sessions',
    sessionId: 'Session ID',
    lastInteraction: 'Last interaction',
    linkedOrder: 'Linked order',
    status: 'Status',
    conversation: 'Conversation',
    metadata: 'Session metadata',
    manualMode: 'Manual mode',
    autoMode: 'Auto mode',
    respondingManually: 'You are responding manually',
    botResponding: 'Bot is responding automatically',
    takeControl: 'Take control',
    releaseChat: 'Release chat',
    typeMessage: 'Type your message...',
    send: 'Send',
    noMessages: 'No messages yet',
    errorTogglingMode: 'Error changing mode. Please try again.',
    errorSendingMessage: 'Error sending message. Please try again.',
    liveBoard: {
      pulse: 'Live inbox',
      title: 'Active sessions',
      subtitle: 'Chats still needing attention (new, collecting items, reviewing).',
      activeCount: 'Active: {count}',
      refresh: 'Refresh',
      emptyStatus: 'No sessions here',
      open: 'Open session'
    }
  },
  menu: {
    title: 'Menu',
    availability: 'Availability',
    markAvailable: 'Mark available',
    markUnavailable: 'Mark unavailable',
    menuImport: 'Menu import',
    uploadHint: 'Drag & drop images or browse files.',
    processing: 'Processing menu with AI...',
    previewTitle: 'Imported preview',
    accept: 'Accept & save',
    reload: 'Reload current menu'
  },
  whatsapp: {
    lines: 'WhatsApp lines',
    addLine: 'Add WhatsApp line',
    embeddedTitle: 'Connect with Meta Embedded Signup',
    embeddedSubtitle: 'Authorize with Meta to activate your AI assistant.',
    signupCta: 'Start signup',
    success: 'WhatsApp line connected successfully.',
    botStatus: 'Bot Status',
    botEnabled: 'Active',
    botDisabled: 'Inactive',
    enableBot: 'Enable Bot',
    disableBot: 'Disable Bot',
    businessHours: 'Business Hours',
    businessHoursDescription: 'Configure the hours when the bot should respond to customers. Outside these hours, an automatic message will be sent.',
    businessHoursDescriptionMerchant: 'Configure your business hours. These hours apply to all WhatsApp lines.',
    openTime: 'Open',
    closeTime: 'Close',
    noService: 'No service',
    copyToAll: 'Copy to all days',
    crossesMidnightWarning: 'This schedule crosses midnight (e.g., 20:00 to 01:00 next day)',
    tips: 'Tips',
    tip1: 'Uncheck a day to indicate no service that day.',
    tip2: 'For hours that cross midnight (e.g., Saturday 20:00 to 01:00 Sunday), the system will handle it automatically.',
    tip3: 'When the bot is disabled or outside business hours, customers will receive an automatic message with your schedule.',
    tip4: 'Business hours are configured at the merchant level and apply to all your WhatsApp lines.'
  },
  notifications: {
    loginSuccess: 'Welcome back!',
    logoutSuccess: 'You have been signed out.',
    updateSuccess: 'Updated successfully.',
    updateError: 'Something went wrong, please try again.'
  },
  settings: {
    manageBusinessHours: 'Manage business hours',
    notifications: {
      title: 'Order Notifications',
      description: 'Configure how you want to receive alerts for new orders and payments.',
      soundEnabled: 'Enable notification sound',
      soundEnabledDescription: 'Play a sound when new orders or payment proofs arrive.',
      volume: 'Sound volume',
      testSound: 'Test sound',
      info: {
        title: 'Notification types',
        orderCreated: 'New order created',
        paymentProof: 'Payment proof received',
        paymentVerified: 'Payment verified'
      }
    }
  },
  statuses: {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    PENDING_CONFIG: 'Pending config',
    PENDING: 'Pending',
    IN_PREPARATION: 'In preparation',
    READY: 'Ready',
    DELIVERING: 'Out for delivery',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    NEW: 'New',
    COLLECTING_ITEMS: 'Collecting items',
    REVIEWING: 'Reviewing',
    CONFIRMED: 'Confirmed',
    SUPPORT: 'Support',
    EXPIRED: 'Expired'
  }
}

export default en

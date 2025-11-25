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
    filters: {
      status: 'Status',
      dateRange: 'Date range',
      search: 'Phone or order ID'
    }
  },
  sessions: {
    title: 'Sessions',
    sessionId: 'Session ID',
    lastInteraction: 'Last interaction',
    linkedOrder: 'Linked order',
    status: 'Status',
    conversation: 'Conversation',
    metadata: 'Session metadata'
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
    success: 'WhatsApp line connected successfully.'
  },
  notifications: {
    loginSuccess: 'Welcome back!',
    logoutSuccess: 'You have been signed out.',
    updateSuccess: 'Updated successfully.',
    updateError: 'Something went wrong, please try again.'
  },
  statuses: {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    PENDING_CONFIG: 'Pending config',
    PENDING: 'Pending',
    IN_PREPARATION: 'In preparation',
    READY: 'Ready',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    NEW: 'New',
    COLLECTING_ITEMS: 'Collecting items',
    REVIEWING: 'Reviewing',
    CONFIRMED: 'Confirmed',
    EXPIRED: 'Expired'
  }
}

export default en

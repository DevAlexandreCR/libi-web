const es = {
  common: {
    requestDemo: 'Solicitar demo',
    signIn: 'Ingresar',
    signOut: 'Cerrar sesión',
    email: 'Correo',
    password: 'Contraseña',
    rememberMe: 'Recordarme',
    or: 'o',
    cancel: 'Cancelar',
    save: 'Guardar',
    create: 'Crear',
    update: 'Actualizar',
    delete: 'Eliminar',
    edit: 'Editar',
    view: 'Ver',
    back: 'Volver',
    name: 'Nombre',
    role: 'Rol',
    merchant: 'Comercio',
    search: 'Buscar',
    filters: 'Filtros',
    status: 'Estado',
    actions: 'Acciones',
    loading: 'Cargando...',
    upload: 'Subir',
    apply: 'Aplicar',
    reset: 'Restablecer',
    total: 'Total',
    description: 'Descripción',
    language: 'Idioma',
    phone: 'Teléfono',
    createdAt: 'Creado',
    continue: 'Continuar',
    accept: 'Aceptar y guardar',
    open: 'Abrir',
    error: 'Error',
    success: 'Éxito'
  },
  navigation: {
    overview: 'Resumen',
    users: 'Usuarios',
    merchants: 'Comercios',
    whatsappLines: 'Líneas WhatsApp',
    demoRequests: 'Solicitudes demo',
    settings: 'Configuración',
    orders: 'Pedidos',
    sessions: 'Sesiones',
    menu: 'Menú',
    menuImport: 'Importar menú',
    demo: 'Demo'
  },
  landing: {
    heroTitle: 'Automatiza tus pedidos de WhatsApp con IA',
    heroSubtitle: 'Un asistente responde al instante, toma pedidos y actualiza tu dashboard sin contratar más personal.',
    primaryCta: 'Solicitar demo',
    secondaryCta: 'Ingresar',
    chatCustomer: '¿Puedo pedir 2 pizzas margarita para envío?',
    chatAssistant: '¡Claro! Confirmo 2 pizzas margarita a tu dirección guardada. ¿Pagas al recibir?',
    stepsTitle: 'Cómo funciona',
    steps: [
      {
        title: 'El cliente escribe por WhatsApp',
        description: 'Usa tu número actual, sin fricción ni apps nuevas.'
      },
      { title: 'La IA gestiona el pedido', description: 'Entiende la intención, valida dirección y pago.' },
      { title: 'El pedido llega al dashboard', description: 'Actualizaciones en vivo y cambios de estado.' },
      { title: 'El restaurante cocina y entrega', description: 'Tu equipo cocina, la IA atiende el chat.' }
    ],
    featuresTitle: 'Pensado para restaurantes modernos',
    features: [
      { title: 'Pedidos con IA', description: 'Entrenado para hospitalidad, responde rápido y hace upsell.' },
      { title: 'Importar menú desde fotos', description: 'Sube tus fotos y la IA estructura los ítems.' },
      { title: 'Dashboard en tiempo real', description: 'Filtra, busca y actualiza estados con eventos en vivo.' },
      { title: 'Multi-sucursal', description: 'Administra varias ubicaciones y líneas separadas.' }
    ],
    merchantsTitle: 'Para comercios',
    merchantsBullets: [
      'Conecta tu línea de WhatsApp con Meta Embedded Signup directo en el dashboard.',
      'La IA responde en minutos con tu menú y políticas.',
      'Monitorea sesiones, pedidos y disponibilidad desde un solo lugar.'
    ],
    demoForm: {
      title: 'Solicita una demo',
      subtitle: 'Deja tus datos y coordinamos una llamada breve para activar tus pedidos con IA.',
      nameLabel: 'Nombre y apellido',
      emailLabel: 'Correo',
      phoneLabel: 'Teléfono',
      companyLabel: 'Restaurante o marca',
      notesLabel: '¿Qué necesitas automatizar?',
      notesPlaceholder: 'Horarios, número de locales, integraciones...',
      submit: 'Enviar solicitud',
      success: 'Recibimos tus datos. Te contactaremos en breve.',
      errors: {
        name: 'Ingresa tu nombre',
        email: 'Agrega un correo válido',
        phone: 'Agrega un teléfono'
      }
    },
    faqTitle: 'Preguntas frecuentes',
    faq: [
      { q: '¿Qué tan rápido podemos salir en vivo?', a: 'La mayoría lanza el mismo día conectando WhatsApp e importando el menú.' },
      { q: '¿Podemos usar nuestro número?', a: 'Sí. Conéctalo con Meta Embedded Signup y mantén tu número.' },
      { q: '¿Hay dashboard para el equipo?', a: 'Sí. Pedidos, sesiones y menú con actualizaciones en tiempo real.' }
    ],
    footer: {
      terms: 'Términos',
      privacy: 'Privacidad',
      contact: 'Contacto'
    }
  },
  auth: {
    title: 'Ingresa a libi',
    subtitle: 'Accede a tu espacio de pedidos con IA.',
    submit: 'Ingresar',
    demoTitle: 'Solicitar demo',
    demoSubtitle: 'Te contactaremos para mostrar cómo automatizar tus pedidos de WhatsApp.',
    request: 'Solicitar demo'
  },
  admin: {
    overviewTitle: 'Resumen de la plataforma',
    merchants: 'Comercios',
    totalOrders: 'Pedidos totales',
    totalLines: 'Líneas de WhatsApp',
    dailyOrders: 'Pedidos diarios',
    merchantsListTitle: 'Administrar comercios',
    merchantFormTitle: 'Datos del comercio',
    whatsappLinesTitle: 'Líneas de WhatsApp',
    whatsappLineDetail: 'Detalle de línea'
  },
  users: {
    title: 'Usuarios y accesos',
    subtitle: 'Crea credenciales para comercios o para el equipo de admin.',
    listTitle: 'Usuarios creados',
    createTitle: 'Crear usuario',
    merchantPlaceholder: 'Selecciona un comercio',
    merchantRequired: 'Selecciona un comercio para asignarlo a este usuario.',
    noMerchant: 'Sin comercio asignado',
    empty: 'Aún no hay usuarios creados.',
    roles: {
      SUPER_ADMIN: 'Super admin',
      MERCHANT_ADMIN: 'Admin de comercio'
    }
  },
  demoRequests: {
    title: 'Solicitudes de demo',
    subtitle: 'Leads capturados en la landing para hacer seguimiento.',
    source: 'Origen',
    status: {
      NEW: 'Nuevo',
      CONTACTED: 'Contactado',
      QUALIFIED: 'Calificado',
      DISCARDED: 'Descartado'
    },
    updateSuccess: 'Estado actualizado'
  },
  merchant: {
    overviewTitle: 'Resumen del comercio',
    quickLinks: 'Accesos rápidos',
    orders: 'Pedidos',
    sessions: 'Sesiones',
    ordersToday: 'Pedidos hoy',
    ordersWeek: 'Pedidos esta semana',
    ordersByStatus: 'Pedidos por estado',
    lastSevenDays: 'Pedidos últimos 7 días'
  },
  orders: {
    title: 'Pedidos',
    orderId: 'ID de pedido',
    customer: 'Cliente',
    total: 'Total',
    status: 'Estado',
    createdAt: 'Creado',
    detail: 'Detalle del pedido',
    deliveryType: 'Tipo de entrega',
    address: 'Dirección',
    paymentMethod: 'Método de pago',
    notes: 'Notas',
    items: 'Ítems',
    statusTimeline: 'Línea de estado',
    advanceStatus: 'Avanzar estado',
    newOrder: 'Nuevo pedido',
    paymentProof: 'Comprobante de pago',
    paymentStatus: {
      awaitingProof: 'Esperando comprobante',
      proofReceived: 'Comprobante recibido',
      verified: 'Pago verificado',
      rejected: 'Pago rechazado'
    },
    paymentStatusLabel: 'Estado de pago',
    verifyPayment: 'Verificar pago',
    rejectPayment: 'Rechazar pago',
    awaitingPaymentProofFilter: 'Esperando comprobante',
    paymentVerificationSuccess: 'Estado de pago actualizado.',
    paymentProofReceived: 'Comprobante recibido.',
    paymentProofMissing: 'Se requiere el comprobante antes de verificar.',
    filters: {
      status: 'Estado',
      dateRange: 'Rango de fechas',
      search: 'Teléfono o ID de pedido'
    },
    liveBoard: {
      pulse: 'Monitor en vivo',
      title: 'Pedidos activos',
      subtitle: 'Solo los que requieren intervención: pendientes, preparando, listos o en entrega.',
      activeCount: 'Activos: {count}',
      newCount: 'Nuevos: {count}',
      refresh: 'Refrescar',
      emptyStatus: 'Sin pedidos en esta columna',
      newLabel: 'Nuevo',
      open: 'Abrir pedido'
    }
  },
  paymentAccounts: {
    title: 'Cuentas de pago',
    description:
      'Administra las cuentas para recibir transferencias. Solo las cuentas activas se mostrarán en la confirmación.',
    add: 'Agregar cuenta',
    edit: 'Editar cuenta',
    deleteConfirm: '¿Seguro deseas eliminar esta cuenta de pago?',
    empty: 'Aún no tienes cuentas de pago configuradas.',
    type: 'Tipo',
    accountNumber: 'Número de cuenta',
    accountHolder: 'Titular',
    bankName: 'Banco',
    descriptionLabel: 'Descripción',
    isActive: 'Activa',
    activeHint: 'Mostrar esta cuenta en las instrucciones de transferencia que ve el cliente.',
    actions: 'Acciones',
    form: {
      createTitle: 'Agregar cuenta de pago',
      editTitle: 'Editar cuenta de pago'
    },
    types: {
      NEQUI: 'Nequi',
      BANCOLOMBIA: 'Bancolombia',
      DAVIPLATA: 'Daviplata',
      BANK_ACCOUNT: 'Cuenta bancaria',
      OTHER: 'Otro'
    }
  },
  sessions: {
    title: 'Sesiones',
    sessionId: 'ID de sesión',
    lastInteraction: 'Última interacción',
    linkedOrder: 'Pedido vinculado',
    status: 'Estado',
    conversation: 'Conversación',
    metadata: 'Metadatos de la sesión',
    manualMode: 'Modo manual',
    autoMode: 'Modo automático',
    respondingManually: 'Estás respondiendo manualmente',
    botResponding: 'El bot está respondiendo automáticamente',
    takeControl: 'Tomar control',
    releaseChat: 'Liberar chat',
    typeMessage: 'Escribe tu mensaje...',
    send: 'Enviar',
    noMessages: 'Aún no hay mensajes',
    errorTogglingMode: 'Error al cambiar modo. Intenta de nuevo.',
    errorSendingMessage: 'Error al enviar mensaje. Intenta de nuevo.',
    liveBoard: {
      pulse: 'Sesiones en curso',
      title: 'Sesiones activas',
      subtitle: 'Chats que aún requieren atención (nuevas, armando pedido o en revisión).',
      activeCount: 'Activas: {count}',
      refresh: 'Refrescar',
      emptyStatus: 'Sin sesiones aquí',
      open: 'Abrir sesión'
    }
  },
  menu: {
    title: 'Menú',
    availability: 'Disponibilidad',
    markAvailable: 'Marcar disponible',
    markUnavailable: 'Marcar no disponible',
    menuImport: 'Importar menú',
    uploadHint: 'Arrastra imágenes o busca archivos.',
    processing: 'Procesando menú con IA...',
    previewTitle: 'Vista previa importada',
    accept: 'Aceptar y guardar',
    reload: 'Recargar menú actual'
  },
  whatsapp: {
    lines: 'Líneas de WhatsApp',
    lineSettings: 'Configuración de Línea',
    addLine: 'Agregar línea de WhatsApp',
    embeddedTitle: 'Conectar con Meta Embedded Signup',
    embeddedSubtitle: 'Autoriza con Meta para activar tu asistente.',
    signupCta: 'Iniciar conexión',
    success: 'Línea conectada correctamente.',
    botStatus: 'Estado del Bot',
    botEnabled: 'Activo',
    botDisabled: 'Inactivo',
    enableBot: 'Activar Bot',
    disableBot: 'Desactivar Bot',
    businessHours: 'Horarios de Atención',
    businessHoursDescription: 'Configura los horarios en los que el bot debe responder a los clientes. Fuera de estos horarios, se enviará un mensaje automático.',
    businessHoursDescriptionMerchant: 'Configura los horarios de atención del comercio. Estos horarios aplican a todas las líneas de WhatsApp.',
    openTime: 'Apertura',
    closeTime: 'Cierre',
    noService: 'Sin servicio',
    copyToAll: 'Copiar a todos los días',
    crossesMidnightWarning: 'Este horario cruza medianoche (ej: 20:00 a 01:00 del día siguiente)',
    tips: 'Consejos',
    tip1: 'Desmarca un día para indicar que no hay servicio ese día.',
    tip2: 'Para horarios que cruzan medianoche (ej: sábado 20:00 a 01:00 domingo), el sistema lo manejará automáticamente.',
    tip3: 'Cuando el bot está desactivado o fuera del horario de atención, los clientes recibirán un mensaje automático con tu horario.',
    tip4: 'Los horarios se configuran a nivel de comercio y aplican a todas tus líneas de WhatsApp.'
  },
  notifications: {
    loginSuccess: '¡Bienvenido de nuevo!',
    logoutSuccess: 'Sesión cerrada.',
    updateSuccess: 'Actualizado correctamente.',
    updateError: 'Algo falló, intenta nuevamente.'
  },
  settings: {
    manageBusinessHours: 'Configurar horarios de atención',
    notifications: {
      title: 'Notificaciones de Pedidos',
      description: 'Configura cómo quieres recibir alertas de nuevos pedidos y pagos.',
      soundEnabled: 'Activar sonido de notificación',
      soundEnabledDescription: 'Reproduce un sonido cuando lleguen nuevos pedidos o comprobantes de pago.',
      volume: 'Volumen del sonido',
      testSound: 'Probar sonido',
      info: {
        title: 'Tipos de notificaciones',
        orderCreated: 'Nuevo pedido creado',
        paymentProof: 'Comprobante de pago recibido',
        paymentVerified: 'Pago verificado'
      }
    }
  },
  statuses: {
    ACTIVE: 'Activo',
    INACTIVE: 'Inactivo',
    PENDING_CONFIG: 'Pendiente de configuración',
    PENDING: 'Pendiente',
    IN_PREPARATION: 'En preparación',
    READY: 'Listo',
    DELIVERING: 'En camino',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
    NEW: 'Nueva',
    COLLECTING_ITEMS: 'Recolectando ítems',
    REVIEWING: 'En revisión',
    CONFIRMED: 'Confirmada',
    SUPPORT: 'Soporte',
    EXPIRED: 'Expirada'
  }
}

export default es

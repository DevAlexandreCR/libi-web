/**
 * Servicio de notificaciones de audio para eventos de pedidos
 */

export type NotificationSoundType =
  | 'order_created'
  | 'payment_proof_uploaded'
  | 'payment_verified'
  | 'session_created'
  | 'message_received'

interface NotificationSoundConfig {
  enabled: boolean
  volume: number
}

class NotificationSoundService {
  private audioContext: AudioContext | null = null
  private config: NotificationSoundConfig = {
    enabled: true,
    volume: 0.7
  }
  private isAudioContextReady: boolean = false
  private userInteractionListener: (() => void) | null = null

  /**
   * Inicializa el servicio con la configuración del merchant
   */
  initialize(enabled: boolean = true, volume: number = 0.7) {
    this.config.enabled = enabled
    this.config.volume = Math.max(0, Math.min(1, volume))

    // Preparar AudioContext con la primera interacción del usuario
    this.setupUserInteractionListener()
  }

  /**
   * Configura un listener para inicializar el AudioContext con la primera interacción
   */
  private setupUserInteractionListener() {
    if (this.isAudioContextReady || this.userInteractionListener) return

    this.userInteractionListener = () => {
      this.initializeAudioContext()
      // Remover listeners después de la primera interacción
      document.removeEventListener('click', this.userInteractionListener!)
      document.removeEventListener('touchstart', this.userInteractionListener!)
      document.removeEventListener('keydown', this.userInteractionListener!)
      this.userInteractionListener = null
    }

    document.addEventListener('click', this.userInteractionListener, { once: false })
    document.addEventListener('touchstart', this.userInteractionListener, { once: false })
    document.addEventListener('keydown', this.userInteractionListener, { once: false })

    console.log('[NotificationSound] Waiting for user interaction to enable audio')
  }

  /**
   * Inicializa el AudioContext
   */
  private initializeAudioContext() {
    if (this.isAudioContextReady) return

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Reanudar el contexto si está suspendido
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume().then(() => {
          this.isAudioContextReady = true
          console.log('[NotificationSound] AudioContext resumed and ready')
        })
      } else {
        this.isAudioContextReady = true
        console.log('[NotificationSound] AudioContext initialized and ready')
      }
    } catch (error) {
      console.error('[NotificationSound] Failed to initialize AudioContext:', error)
    }
  }

  /**
   * Reproduce un sonido de notificación
   */
  async play(type: NotificationSoundType = 'order_created'): Promise<void> {
    if (!this.config.enabled) {
      console.log('[NotificationSound] Sound disabled in config')
      return
    }

    try {
      // Inicializar audio context si es necesario
      if (!this.audioContext) {
        this.initializeAudioContext()
      }

      // Verificar si el AudioContext está listo
      if (!this.isAudioContextReady || !this.audioContext) {
        console.warn('[NotificationSound] AudioContext not ready yet. Waiting for user interaction.')
        this.showAutoplayWarning()
        return
      }

      // Reanudar el contexto si está suspendido
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }

      // Generar sonido según el tipo
      await this.playTone(type)
      console.log(`[NotificationSound] Played sound for: ${type}`)
    } catch (error) {
      console.error('[NotificationSound] Failed to play sound:', error)
      // Si falla por permisos de autoplay, intentar mostrar instrucciones al usuario
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        console.warn('[NotificationSound] Autoplay blocked. User interaction needed.')
        this.showAutoplayWarning()
      }
    }
  }

  /**
   * Genera y reproduce un tono de notificación usando Web Audio API
   */
  private async playTone(type: NotificationSoundType): Promise<void> {
    if (!this.audioContext) return

    const ctx = this.audioContext
    const now = ctx.currentTime

    // Crear oscilador y ganancia
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Configurar sonido según el tipo
    const config = this.getSoundConfig(type)

    oscillator.type = 'sine'
    oscillator.frequency.value = config.frequency1

    // Configurar envolvente de volumen
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(this.config.volume * 0.3, now + 0.01)
    gainNode.gain.linearRampToValueAtTime(this.config.volume * 0.15, now + config.duration / 2)
    gainNode.gain.linearRampToValueAtTime(0, now + config.duration)

    // Iniciar y detener
    oscillator.start(now)
    oscillator.stop(now + config.duration)

    // Si el sonido tiene dos tonos, reproducir el segundo
    if (config.frequency2) {
      setTimeout(() => {
        this.playSecondTone(config.frequency2!, config.duration / 2)
      }, (config.duration * 1000) / 2)
    }

    return new Promise((resolve) => {
      setTimeout(resolve, config.duration * 1000)
    })
  }

  /**
   * Reproduce un segundo tono (para sonidos más complejos)
   */
  private playSecondTone(frequency: number, duration: number): void {
    if (!this.audioContext) return

    const ctx = this.audioContext
    const now = ctx.currentTime

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = 'sine'
    oscillator.frequency.value = frequency

    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(this.config.volume * 0.25, now + 0.01)
    gainNode.gain.linearRampToValueAtTime(0, now + duration)

    oscillator.start(now)
    oscillator.stop(now + duration)
  }

  /**
   * Obtiene la configuración del sonido según el tipo de evento
   */
  private getSoundConfig(type: NotificationSoundType): {
    frequency1: number
    frequency2?: number
    duration: number
  } {
    const configs = {
      order_created: {
        frequency1: 800,
        frequency2: 1000,
        duration: 0.3
      },
      payment_proof_uploaded: {
        frequency1: 600,
        duration: 0.2
      },
      payment_verified: {
        frequency1: 900,
        frequency2: 1200,
        duration: 0.35
      },
      session_created: {
        frequency1: 700,
        frequency2: 850,
        duration: 0.25
      },
      message_received: {
        frequency1: 650,
        duration: 0.15
      }
    }
    return configs[type]
  }

  /**
   * Habilita o deshabilita el sonido
   */
  setEnabled(enabled: boolean) {
    this.config.enabled = enabled
    console.log(`[NotificationSound] Sound ${enabled ? 'enabled' : 'disabled'}`)
  }

  /**
   * Configura el volumen (0.0 - 1.0)
   */
  setVolumen(volume: number) {
    this.config.volume = Math.max(0, Math.min(1, volume))
    console.log(`[NotificationSound] Volume set to ${this.config.volume}`)
  }

  /**
   * Muestra una advertencia si el autoplay está bloqueado
   */
  private showAutoplayWarning() {
    console.warn('⚠️ Para activar los sonidos de notificación, haz clic en cualquier parte de la página')
  }

  /**
   * Reproduce un sonido de prueba
   */
  async testSound(): Promise<void> {
    await this.play('order_created')
  }
}

// Exportar instancia singleton
export const notificationSoundService = new NotificationSoundService()

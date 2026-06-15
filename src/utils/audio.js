/**
 * 音频播放工具类
 * 提供统一的音效管理接口，支持多种音效类型
 * 为后续克数加减音效做准备
 */

/**
 * 音效类型枚举
 * @enum {string}
 */
export const SoundType = {
  /** 添加克数音效 */
  ADD_GRAM: 'addGram',
  /** 减少克数音效 */
  SUBTRACT_GRAM: 'subtractGram',
  /** 成功提示音效 */
  SUCCESS: 'success',
  /** 错误提示音效 */
  ERROR: 'error',
  /** 点击音效 */
  CLICK: 'click',
  /** 加载完成音效 */
  LOAD: 'load'
}

/**
 * 音频管理器类
 * 负责音效的加载、播放和管理
 */
class AudioManager {
  constructor() {
    /**
     * 音频缓存对象
     * @type {Object.<string, Audio>}
     */
    this.audioCache = {}
    
    /**
     * 全局音量
     * @type {number}
     */
    this.volume = 0.5
    
    /**
     * 是否静音
     * @type {boolean}
     */
    this.muted = false
    
    /**
     * 音效配置
     * 预留音频文件路径，可替换为实际音频文件
     */
    this.soundConfig = {
      [SoundType.ADD_GRAM]: {
        src: '/assets/sounds/add-gram.mp3',
        volume: 0.6
      },
      [SoundType.SUBTRACT_GRAM]: {
        src: '/assets/sounds/subtract-gram.mp3',
        volume: 0.6
      },
      [SoundType.SUCCESS]: {
        src: '/assets/sounds/success.mp3',
        volume: 0.5
      },
      [SoundType.ERROR]: {
        src: '/assets/sounds/error.mp3',
        volume: 0.5
      },
      [SoundType.CLICK]: {
        src: '/assets/sounds/click.mp3',
        volume: 0.4
      },
      [SoundType.LOAD]: {
        src: '/assets/sounds/load.mp3',
        volume: 0.3
      }
    }
  }
  
  /**
   * 设置全局音量
   * @param {number} volume - 音量值 (0-1)
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
  }
  
  /**
   * 获取全局音量
   * @returns {number} - 当前音量值
   */
  getVolume() {
    return this.volume
  }
  
  /**
   * 设置静音状态
   * @param {boolean} muted - 是否静音
   */
  setMuted(muted) {
    this.muted = muted
  }
  
  /**
   * 获取静音状态
   * @returns {boolean} - 当前静音状态
   */
  getMuted() {
    return this.muted
  }
  
  /**
   * 加载音效文件
   * @param {SoundType} type - 音效类型
   * @returns {Promise<Audio>} - 音频对象
   */
  loadSound(type) {
    return new Promise((resolve, reject) => {
      // 如果已缓存，直接返回
      if (this.audioCache[type]) {
        resolve(this.audioCache[type])
        return
      }
      
      const config = this.soundConfig[type]
      if (!config) {
        reject(new Error(`Sound type "${type}" is not defined`))
        return
      }
      
      const audio = new Audio(config.src)
      audio.volume = config.volume * this.volume
      audio.preload = 'auto'
      
      audio.addEventListener('canplaythrough', () => {
        this.audioCache[type] = audio
        resolve(audio)
      })
      
      audio.addEventListener('error', (e) => {
        // 如果加载失败，使用Web Audio API生成简单音效作为备选
        console.warn(`Failed to load sound "${type}", using fallback`)
        const fallbackAudio = this.createFallbackAudio(type)
        this.audioCache[type] = fallbackAudio
        resolve(fallbackAudio)
      })
      
      // 设置超时
      setTimeout(() => {
        if (!this.audioCache[type]) {
          const fallbackAudio = this.createFallbackAudio(type)
          this.audioCache[type] = fallbackAudio
          resolve(fallbackAudio)
        }
      }, 3000)
    })
  }
  
  /**
   * 创建备选音效（使用Web Audio API）
   * @param {SoundType} type - 音效类型
   * @returns {Object} - 模拟音频对象
   */
  createFallbackAudio(type) {
    return {
      play: () => {
        // 使用Web Audio API生成简单音效
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        let frequency = 800
        let duration = 0.1
        let typeWave = 'sine'
        
        switch (type) {
          case SoundType.ADD_GRAM:
            frequency = 520
            duration = 0.15
            typeWave = 'sine'
            break
          case SoundType.SUBTRACT_GRAM:
            frequency = 380
            duration = 0.15
            typeWave = 'sine'
            break
          case SoundType.SUCCESS:
            frequency = 880
            duration = 0.2
            typeWave = 'sine'
            break
          case SoundType.ERROR:
            frequency = 220
            duration = 0.3
            typeWave = 'sawtooth'
            break
          case SoundType.CLICK:
            frequency = 1200
            duration = 0.05
            typeWave = 'square'
            break
          case SoundType.LOAD:
            frequency = 440
            duration = 0.2
            typeWave = 'sine'
            break
          default:
            frequency = 440
            duration = 0.1
        }
        
        oscillator.type = typeWave
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
        
        gainNode.gain.setValueAtTime(this.volume * 0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + duration)
      }
    }
  }
  
  /**
   * 播放音效
   * @param {SoundType} type - 音效类型
   * @returns {Promise<void>}
   */
  async play(type) {
    if (this.muted) return
    
    try {
      const audio = await this.loadSound(type)
      audio.currentTime = 0
      audio.play().catch(() => {
        // 自动播放被阻止，忽略错误
      })
    } catch (error) {
      console.error(`Failed to play sound "${type}":`, error)
    }
  }
  
  /**
   * 播放添加克数音效
   */
  playAddGram() {
    this.play(SoundType.ADD_GRAM)
  }
  
  /**
   * 播放减少克数音效
   */
  playSubtractGram() {
    this.play(SoundType.SUBTRACT_GRAM)
  }
  
  /**
   * 播放成功音效
   */
  playSuccess() {
    this.play(SoundType.SUCCESS)
  }
  
  /**
   * 播放错误音效
   */
  playError() {
    this.play(SoundType.ERROR)
  }
  
  /**
   * 播放点击音效
   */
  playClick() {
    this.play(SoundType.CLICK)
  }
  
  /**
   * 播放加载音效
   */
  playLoad() {
    this.play(SoundType.LOAD)
  }
  
  /**
   * 预加载所有音效
   * @returns {Promise<void[]>}
   */
  preloadAll() {
    const types = Object.values(SoundType)
    return Promise.all(types.map(type => this.loadSound(type)))
  }
  
  /**
   * 释放所有音频资源
   */
  dispose() {
    Object.values(this.audioCache).forEach(audio => {
      if (audio instanceof Audio) {
        audio.pause()
        audio.src = ''
      }
    })
    this.audioCache = {}
  }
}

/**
 * 创建音频管理器实例
 * @type {AudioManager}
 */
export const audioManager = new AudioManager()

export default audioManager
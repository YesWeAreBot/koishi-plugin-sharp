import { Context, Schema, Service, Logger } from 'koishi'

import sharp from '@yesimbot/sharp'

export const name = 'sharp'

export const usage = "通用图片处理服务"

const logger = new Logger('sharp')

export interface Config {
  checkAvailability?: boolean
  fallbackMode?: boolean
}

declare module 'koishi' {
  interface Context {
    sharp: SharpService;
  }
}

export default class SharpService extends Service<Config> {
  static readonly Config: Schema<Config> = Schema.object({
    checkAvailability: Schema.boolean().default(true).description('是否在启动时检查sharp可用性'),
    fallbackMode: Schema.boolean().default(true).description('是否在sharp不可用时启用降级模式')
  });

  public readonly sharpInstance: typeof sharp;
  public readonly isAvailable: boolean;

  constructor(ctx: Context, config: Config) {
    super(ctx, "sharp")

    this.sharpInstance = sharp
    this.isAvailable = typeof sharp === 'function' && sharp.isAvailable ? sharp.isAvailable() : false

    if (config.checkAvailability) {
      this.checkAvailability()
    }
  }

  private checkAvailability() {
    if (!this.isAvailable) {
      const message = 'Sharp服务不可用，请确保sharp已正确安装。图片处理功能将受限。'
      if (this.config.fallbackMode) {
        logger.warn(message)
      } else {
        logger.error(message)
        throw new Error(message)
      }
    } else {
      logger.success('Sharp服务已成功加载')
    }
  }

  /**
   * 检查sharp是否可用
   */
  public checkSharp() {
    return this.isAvailable
  }

  /**
   * 获取sharp版本信息
   */
  public getVersion() {
    return this.isAvailable && sharp.versions ? sharp.versions.sharp : null
  }
}

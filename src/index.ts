import { Context, Schema, Service } from 'koishi'
import sharp from 'sharp'

export const name = 'sharp'

export const usage = "通用图片处理服务"

export interface Config { }

declare module 'koishi' {
  interface Context {
    sharp: SharpService;
  }
}

export default class SharpService extends Service<Config> {
  static readonly Config: Schema<Config> = Schema.object({});
  public readonly sharpInstance: typeof sharp;
  constructor(ctx: Context, config: Config) {
    super(ctx, "sharp")
    this.sharpInstance = sharp;
  }
}

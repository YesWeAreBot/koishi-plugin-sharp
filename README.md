# @yesimbot Sharp 解决方案

[![npm](https://img.shields.io/npm/v/%40yesimbot%2Fkoishi-plugin-sharp?label=%40yesimbot%2Fkoishi-plugin-sharp)](https://www.npmjs.com/package/@yesimbot/koishi-plugin-sharp)
[![npm](https://img.shields.io/npm/v/@yesimbot/sharp?label=%40yesimbot%2Fsharp)](https://www.npmjs.com/package/@yesimbot/sharp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 🛡️ **解决 Sharp 安全限制** - 避免直接引用 sharp 导致插件被标记为 unsafe 的优雅方案

## 📋 目录

- [功能特性](#-功能特性)
- [安装方法](#-安装方法)
- [使用方法](#-使用方法)
- [API 文档](#-api-文档)
- [配置选项](#-配置选项)
- [示例代码](#-示例代码)
- [注意事项](#-注意事项)
- [更新日志](#-更新日志)

## ✨ 核心特性

### 🛡️ 安全解决方案
- **避免 unsafe 标记** - 通过动态安装方式，避免直接依赖 sharp 导致的安全警告
- **二次导出设计** - `@yesimbot/sharp` 将 sharp 所有功能完整二次导出
- **零侵入集成** - 无需修改现有代码结构，直接替换 sharp 引用即可

### 🚀 技术特性
- **动态安装** - 运行时自动安装 Sharp WebAssembly 版本
- **双模式支持** - 既支持 Koishi 服务注册，也支持直接导入使用
- **包管理器兼容** - 支持 npm、yarn、pnpm、bun 等主流包管理器
- **跨平台运行** - WebAssembly 版本确保在不同环境下的兼容性

## 🚀 安装方式

本代码库提供两种使用方式，根据您的需求选择适合的方案。

### 📦 方案一：直接导入使用（推荐）

**适用于**：任何 Node.js 项目，无需 Koishi 环境

```bash
# 安装核心包
npm install @yesimbot/sharp

# 或使用其他包管理器
yarn add @yesimbot/sharp
pnpm add @yesimbot/sharp
bun add @yesimbot/sharp
```

**优势**：
- ✅ 避免插件被标记为 unsafe
- ✅ 零配置，即装即用
- ✅ 完全替代原生 sharp

### 🔌 方案二：Koishi 插件服务

**适用于**：Koishi 机器人框架

```bash
# 安装插件包（已包含核心依赖）
npm install @yesimbot/koishi-plugin-sharp

# 或使用其他包管理器
yarn add @yesimbot/koishi-plugin-sharp
pnpm add @yesimbot/koishi-plugin-sharp
bun add @yesimbot/koishi-plugin-sharp
```

**安装方式**：
- **推荐**：通过 Koishi 市场搜索 `@yesimbot/koishi-plugin-sharp` 安装
- **命令行**：使用上述命令安装

### 🔄 自动依赖安装

两个包都包含智能的 `postinstall` 脚本，会自动安装 Sharp WebAssembly 依赖：

- `sharp@0.34.3`
- `@img/sharp-wasm32@0.34.3`

支持所有主流包管理器：npm、yarn、pnpm、bun

## 🎯 使用方法

### 📦 方案一：直接导入使用

**完全替代原生 sharp**，无需任何代码修改：

```typescript
// ❌ 避免这样使用（会导致 unsafe 标记）
// import sharp from 'sharp'

// ✅ 推荐这样使用（安全无限制）
import sharp from '@yesimbot/sharp'

// 其余代码完全不变
async function processImage(buffer: Buffer) {
  return await sharp(buffer)
    .resize(800, 600)
    .jpeg({ quality: 90 })
    .toBuffer()
}
```

**适用场景**：
- 任何 Node.js 项目
- 非 Koishi 项目
- 现有项目迁移（仅需替换 import）

### 🔌 方案二：Koishi 插件服务

在 Koishi 环境中通过服务方式使用：

```typescript
import { Context } from 'koishi'

export function apply(ctx: Context) {
  // 通过 ctx.sharp 访问 sharp 实例
  ctx.command('process-image')
    .action(async ({ session }) => {
      try {
        const sharp = ctx.sharp.sharpInstance
        
        // 图片处理示例
        const processedBuffer = await sharp(inputBuffer)
          .resize(800, 600)
          .jpeg({ quality: 90 })
          .toBuffer()
        
        return '图片处理完成！'
      } catch (error) {
        return `处理失败: ${error.message}`
      }
    })
}
```

**适用场景**：
- Koishi 机器人插件
- 需要集中管理 sharp 实例的项目
- 多个插件共享 sharp 功能


## 📚 API 文档

### SharpService

#### 属性

| 属性名 | 类型 | 描述 |
|--------|------|------|
| `sharpInstance` | `typeof sharp` | Sharp 库的完整实例 |

#### 方法

通过 `ctx.sharp.sharpInstance` 访问 Sharp 的所有原生方法：

### Sharp 常用操作

#### 图片调整
```typescript
// 调整尺寸
await sharp(buffer)
  .resize(300, 200)
  .toBuffer()

// 保持宽高比
await sharp(buffer)
  .resize(300, 200, { fit: 'cover' })
  .toBuffer()
```

#### 格式转换
```typescript
// JPEG 转 PNG
await sharp(buffer)
  .png()
  .toBuffer()

// WebP 格式
await sharp(buffer)
  .webp({ quality: 80 })
  .toBuffer()
```

#### 图片优化
```typescript
// 压缩 JPEG
await sharp(buffer)
  .jpeg({ 
    quality: 85,
    progressive: true 
  })
  .toBuffer()

// 压缩 PNG
await sharp(buffer)
  .png({ 
    quality: 90,
    compressionLevel: 9
  })
  .toBuffer()
```

#### 图片处理
```typescript
// 旋转图片
await sharp(buffer)
  .rotate(90)
  .toBuffer()

// 裁剪图片
await sharp(buffer)
  .extract({ left: 100, top: 100, width: 200, height: 200 })
  .toBuffer()

// 添加水印
await sharp(buffer)
  .composite([{
    input: watermarkBuffer,
    gravity: 'southeast'
  }])
  .toBuffer()
```

## ⚙️ 配置选项

### @yesimbot/sharp（直接导入方案）
**零配置设计**，安装后即可直接使用，无需任何配置。

### @yesimbot/koishi-plugin-sharp（Koishi 插件）
同样采用零配置设计，安装后自动注册为 `sharp` 服务：

```typescript
export interface Config { }

// 使用默认配置
export default class SharpService extends Service<Config> {
  static readonly Config: Schema<Config> = Schema.object({});
}
```

## 💡 使用示例

### 📦 直接导入使用示例

**迁移现有项目** - 仅需替换 import 语句：

```typescript
// 迁移前（会导致 unsafe 标记）
// import sharp from 'sharp'

// 迁移后（安全无限制）
import sharp from '@yesimbot/sharp'

// 现有代码无需任何修改
export async function createThumbnail(imagePath: string) {
  return await sharp(imagePath)
    .resize(200, 200)
    .jpeg({ quality: 80 })
    .toBuffer()
}

export async function optimizeImage(buffer: Buffer) {
  return await sharp(buffer)
    .webp({ quality: 85 })
    .toBuffer()
}
```

### 🔌 Koishi 插件使用示例

**完整的图片处理插件**：

```typescript
import { Context, Schema } from 'koishi'

export const name = 'image-processor'

export interface Config {
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

export const Config: Schema<Config> = Schema.object({
  maxWidth: Schema.number().default(1920).description('最大宽度'),
  maxHeight: Schema.number().default(1080).description('最大高度'),
  quality: Schema.number().min(1).max(100).default(85).description('图片质量')
})

export function apply(ctx: Context, config: Config) {
  // 使用 ctx.sharp.sharpInstance 访问 sharp
  ctx.command('compress <image:image>', '压缩图片')
    .action(async ({ session }, image) => {
      if (!image) return '请上传图片'
      
      try {
        const sharp = ctx.sharp.sharpInstance
        const buffer = await image.buffer()
        
        const compressed = await sharp(buffer)
          .resize(config.maxWidth, config.maxHeight, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: config.quality })
          .toBuffer()
        
        return segment.image(compressed, 'image/jpeg')
      } catch (error) {
        return `压缩失败: ${error.message}`
      }
    })

  ctx.command('convert <image:image> <format>', '转换图片格式')
    .usage('支持格式: jpeg, png, webp')
    .action(async ({ session }, image, format) => {
      if (!image || !format) return '请上传图片并指定格式'
      
      try {
        const sharp = ctx.sharp.sharpInstance
        const buffer = await image.buffer()
        
        const converted = await sharp(buffer)
          .toFormat(format as any)
          .toBuffer()
        
        return segment.image(converted, `image/${format}`)
      } catch (error) {
        return `转换失败: ${error.message}`
      }
    })
}
```

### 批量处理示例

```typescript
async function processImages(ctx: Context, images: Buffer[]) {
  const sharp = ctx.sharp.sharpInstance
  
  const results = await Promise.all(
    images.map(async (image, index) => {
      try {
        const processed = await sharp(image)
          .resize(800, 600)
          .jpeg({ quality: 80 })
          .toBuffer()
        
        return {
          index,
          success: true,
          buffer: processed
        }
      } catch (error) {
        return {
          index,
          success: false,
          error: error.message
        }
      }
    })
  )
  
  return results
}
```

## ⚠️ 注意事项

### 🛡️ 安全优势
- **避免 unsafe 标记** - 这是本项目的核心设计目标
- **兼容现有代码** - 直接替换 import 即可，无需重构
- **透明升级** - 从原生 sharp 迁移无任何功能差异

### 💾 性能与资源
- **内存使用**：WebAssembly 版本在处理大图片时可能占用更多内存
- **并发处理**：建议控制同时处理的图片数量，避免内存溢出
- **性能权衡**：WebAssembly 版本性能略低于原生版本，但兼容性更好

### 🔧 最佳实践
- **错误处理**：始终包装 Sharp 操作在 try-catch 中
- **输入验证**：检查图片格式和大小限制
- **版本管理**：如需特定 sharp 版本，请手动安装对应版本

### 📦 依赖管理
- **自动安装**：依赖通过 postinstall 脚本自动安装，不会出现在 package.json
- **版本锁定**：如需固定版本，请手动安装 sharp 和 @img/sharp-wasm32

## 🔄 更新日志

### v0.0.5
- ✨ **初始版本发布**
- 🛡️ **解决 Sharp 安全限制** - 避免插件被标记为 unsafe
- 📦 **双包设计** - @yesimbot/sharp 直接导入 + @yesimbot/koishi-plugin-sharp 服务注册
- 🚀 **Sharp WebAssembly 集成** - 自动安装兼容版本
- 🔧 **零配置迁移** - 直接替换 import 即可使用
- 🎯 **Koishi v4 兼容** - 完美支持服务注册模式

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 📋 项目结构

```
sharp/
├── packages/
│   ├── core/                    # @yesimbot/sharp - 核心功能包
│   │   ├── scripts/
│   │   │   └── postinstall-sharp.js  # 自动安装脚本
│   └── sharp/                   # @yesimbot/koishi-plugin-sharp - Koishi 插件
│       └── src/
│           └── index.ts         # 服务注册实现
└── README.md                    # 本文档
```

### 🔧 开发环境

```bash
# 克隆项目
git clone https://github.com/YesWeAreBot/sharp.git
cd sharp

# 安装依赖
yarn install

# 构建项目
yarn build

# 运行测试
yarn test
```

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🔗 相关链接

- **Sharp 官方文档**: https://sharp.pixelplumbing.com/
- **Koishi 插件开发指南**: https://koishi.chat/zh-CN/guide/plugin/
- **WebAssembly 版本 Sharp**: https://github.com/lovell/sharp/tree/main/docs/install#webassembly
- **NPM 包 - [@yesimbot/sharp](https://www.npmjs.com/package/@yesimbot/sharp)
- **NPM 包 - [@yesimbot/koishi-plugin-sharp](https://www.npmjs.com/package/@yesimbot/koishi-plugin-sharp)

---

## 🎯 快速决策指南

| 使用场景 | 推荐方案 | 安装包 |
|----------|----------|--------|
| **普通 Node.js 项目** | 直接导入使用 | `@yesimbot/sharp` |
| **Koishi 机器人插件** | 服务注册模式 | `@yesimbot/koishi-plugin-sharp` |
| **现有项目迁移** | 直接替换 import | `@yesimbot/sharp` |
| **避免 unsafe 标记** | 任意方案均可 | 任意上述包 |

> 💡 **记住**：只需将 `import sharp from 'sharp'` 替换为 `import sharp from '@yesimbot/sharp'` 即可解决安全问题！



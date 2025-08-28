const { spawn } = require('child_process');
const { detect } = require('detect-package-manager');

// 环境变量“锁”，用于防止无限递归
const GUARD_VARIABLE = '__POSTINSTALL_SHARP_IN_PROGRESS__';

// 检查是否处于递归调用中
if (process.env[GUARD_VARIABLE]) {
  console.log('📦 Skipping recursive postinstall execution.');
  // 正常退出，让父进程继续
  process.exit(0);
}

const SHARP_VERSION = '0.34.3'
// 定义要安装的包
const PACKAGES = `sharp@${SHARP_VERSION} @img/sharp-wasm32@${SHARP_VERSION}`;

// 为不同包管理器配置安装命令
const INSTALL_COMMANDS = {
  // npm 使用 --cpu=wasm32 标志来指定 Wasm 平台
  npm: `npm install --cpu=wasm32 ${PACKAGES} --no-save`,
  // pnpm, bun 支持 --no-save (或等效行为)
  pnpm: `pnpm add ${PACKAGES} --no-save`,
  bun: `bun add ${PACKAGES} --no-save`,
  // Yarn v1 不支持 --no-save，它会默认保存到 package.json
  yarn: `yarn add ${PACKAGES}`,
  // Yarn Berry (yarn 2+)
  'yarn@berry': `yarn add ${PACKAGES} --no-save`,
};

/**
 * 使用 spawn 执行命令并实时流式传输其输出。
 * 这对于观察长时间运行的构建过程至关重要。
 * @param {string} commandString - 完整的命令字符串，例如 "npm install express"
 * @returns {Promise<void>} - 命令成功完成时 resolve，失败时 reject。
 */
function runCommandAndStream(commandString) {
  console.log(`⚡ Executing: \n   $ ${commandString}\n`);
  
  // 使用shell解析命令，避免空格路径问题
  const executionCwd = process.env.INIT_CWD;
  if (!executionCwd) {
      console.warn('⚠️  Could not determine project root via INIT_CWD. Using current directory.');
      console.warn('⚠️  This might fail with modern package managers like Yarn Berry.');
  }
  console.log(`ℹ️  Running command in directory: ${executionCwd || process.cwd()}`);

  // 创建子进程的环境变量
  const childEnv = {
    ...process.env,
    [GUARD_VARIABLE]: 'true',
  };

  return new Promise((resolve, reject) => {
    const child = spawn(commandString, {
      stdio: 'inherit',
      shell: true, // 使用shell模式，避免参数解析问题
      env: childEnv,
      cwd: executionCwd,
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * 在 postinstall 阶段，根据检测到的包管理器安装 sharp 的 wasm 版本
 */
async function postinstallSharp() {
  console.log('🚀 Starting postinstall script to install sharp for wasm32...');

  try {
    // 1. 检测当前项目使用的包管理器
    const pm = await detect();
    console.log(`📦 Detected package manager: ${pm}`);

    const command = INSTALL_COMMANDS[pm];

    // 2. 如果不支持当前包管理器，则给出提示并退出
    if (!command) {
      console.warn(
        `⚠️ Unsupported package manager "${pm}". Please install '${PACKAGES}' manually.`
      );
      return;
    }

    // 3. 对 Yarn 的特殊行为给出提示
    if (pm === 'yarn') {
      console.warn(
        "🔔 Note: 'yarn add' will save sharp to your package.json. This is a known behavior of Yarn 1.x."
      );
    }
    
    // 执行命令并等待其完成，输出将实时显示
    await runCommandAndStream(command);

    console.log('\n✅ Sharp and its wasm dependency installed successfully!');
  } catch (error) {
    console.error('\n❌ Failed to install sharp.');
    console.error('Error:', error.message);
    console.error(
      `\nPlease try installing manually or check the output above for build errors.`
    );
    process.exit(1);
  }
}

// 执行脚本
postinstallSharp();
import { detect } from "detect-package-manager";

import { exec } from 'child_process';

// 安装 sharp 依赖
// npm install --cpu=wasm32 sharp
async function install() {
  const pm = await detect();
  switch (pm) {
    case "bun":
      exec('bun add sharp @img/sharp-wasm32 --no-save', (err, stdout, stderr) => {
        if (err) {
          console.error(`bun add 失败: ${err}`);
          return;
        }
        console.log(`bun add 成功: ${stdout}`);
      });
      break;
    case "npm":
      exec('npm install --cpu=wasm32 sharp @img/sharp-wasm32 --no-save', (err, stdout, stderr) => {
        if (err) {
          console.error(`npm install 失败: ${err}`);
          return;
        }
        console.log(`npm install 成功: ${stdout}`);
      });
      break;
    case "yarn":
      // yarn 不支持 --cpu=wasm32
      exec('yarn add sharp @img/sharp-wasm32 --no-save', (err, stdout, stderr) => {
        if (err) {
          console.error(`yarn add 失败: ${err}`);
          return;
        }
        console.log(`yarn add 成功: ${stdout}`);
      });
      break;
    case "pnpm":
      exec('pnpm add sharp @img/sharp-wasm32 --no-save', (err, stdout, stderr) => {
        if (err) {
          console.error(`pnpm add 失败: ${err}`);
          return;
        }
        console.log(`pnpm add 成功: ${stdout}`);
      });
      break;
    default:
      break;
  }
}

install().then(() => {
  console.log('sharp 安装完成');
});


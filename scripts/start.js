#!/usr/bin/env node
const { spawn } = require('child_process');

const args = process.argv.slice(2);
const expoArgs = ['expo', 'start', ...args];
const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

function runExpoDirectly() {
  const expo = spawn(npxCmd, expoArgs, {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  expo.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });

  expo.on('error', (error) => {
    console.error('Failed to start Expo CLI:', error);
    process.exit(1);
  });
}

if (process.platform === 'win32') {
  runExpoDirectly();
} else {
  const commandParts = [npxCmd, ...expoArgs].map((part) => {
    if (/^[A-Za-z0-9_.\/-]+$/.test(part)) {
      return part;
    }
    return `'${part.replace(/'/g, "'\\''")}'`;
  });
  const command = commandParts.join(' ');
  const script = `if ulimit -n 8192 2>/dev/null; then exec ${command}; else exit 94; fi`;

  const child = spawn('bash', ['-lc', script], {
    stdio: 'inherit'
  });

  let fallbackScheduled = false;

  const scheduleFallback = (reason) => {
    if (fallbackScheduled) {
      return;
    }
    fallbackScheduled = true;
    console.warn(reason);
    runExpoDirectly();
  };

  child.on('error', (error) => {
    scheduleFallback(`Unable to adjust the open file limit automatically: ${error.message}`);
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    if (fallbackScheduled) {
      return;
    }
    if (code === 0) {
      process.exit(0);
    } else if (code === 94) {
      scheduleFallback('Falling back to the default Expo start command because the limit adjustment failed.');
    } else {
      process.exit(code ?? 1);
    }
  });
}

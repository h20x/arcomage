import * as esbuild from 'esbuild';
import { copy } from 'esbuild-plugin-copy';
import fs from 'fs';
import path from 'path';

const TASKS = {
  dev: serve,
  build: build,
};

runTask();

function runTask() {
  const taskName = process.argv[2] || 'build';

  if (TASKS[taskName]) {
    TASKS[taskName]();
  } else {
    console.log(`Task "${taskName}" not found`);
  }
}

function getConfig(dev = false) {
  return {
    entryPoints: ['src/app/app.ts'],
    bundle: true,
    minify: !dev,
    loader: { '.webp': 'file', '.html': 'text' },
    assetNames: 'assets/[name]-[hash]',
    outdir: 'dist',
    plugins: [
      copy({
        assets: [
          {
            from: ['./src/view/assets/cards/*'],
            to: ['./dist/assets/cards'],
          },
          {
            from: ['./src/app/app.html'],
            to: ['./dist/index.html'],
          },
          {
            from: ['./src/app/favicon.ico'],
            to: ['./dist'],
          },
          {
            from: ['./src/audio/sounds.mp3'],
            to: ['./dist/assets'],
          },
        ],
        resolveFrom: 'cwd',
        watch: dev,
      }),
    ],
  };
}

async function serve() {
  cleanOutDir();
  const ctx = await esbuild.context(getConfig(true));
  const { port } = await ctx.serve({
    servedir: 'dist',
    onRequest: ({ remoteAddress, method, path, status, timeInMS }) => {
      console.log(
        `${remoteAddress} - "${method} ${path}" ${status} [${timeInMS}ms]`
      );
    },
  });

  console.log(`Serve 127.0.0.1:${port}\n`);
}

async function build() {
  cleanOutDir();
  await esbuild.build(getConfig());
}

function cleanOutDir() {
  fs.rmdirSync(path.join(process.cwd(), '/dist'), {
    recursive: true,
    force: true,
  });
}

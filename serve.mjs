import * as esbuild from 'esbuild';
import { copy } from 'esbuild-plugin-copy';

(async () => {
  const ctx = await esbuild.context({
    entryPoints: ['src/app/app.ts'],
    bundle: true,
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
        watch: true,
      }),
    ],
  });

  const { port } = await ctx.serve({
    servedir: 'dist',
    onRequest: ({ remoteAddress, method, path, status, timeInMS }) => {
      console.log(
        `${remoteAddress} - "${method} ${path}" ${status} [${timeInMS}ms]`
      );
    },
  });

  console.log(`Serve 127.0.0.1:${port}\n`);
})();

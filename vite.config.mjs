import { relative, sep } from 'node:path';
import { defineConfig } from 'vite';
import { buildScript, buildStyles } from './scripts/build.mjs';

export default defineConfig({
  plugins: [{
    name: 'resume-assets',
    async configureServer() {
      await Promise.all([buildStyles(), buildScript()]);
    },
    async handleHotUpdate({ file, server }) {
      const source = relative(server.config.root, file).split(sep).join('/');
      if (source.startsWith('scss/') && source.endsWith('.scss')) {
        await buildStyles();
      } else if (source === 'js/resume.js') {
        await buildScript();
      } else {
        return;
      }
      server.ws.send({ type: 'full-reload' });
      return [];
    },
  }],
});

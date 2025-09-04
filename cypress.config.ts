import fs from 'fs';

import { defineConfig } from 'cypress';

export default defineConfig({
  video: true,
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, _) {
      on('after:run', results => {
        if (!results) return;
        if ('status' in results) return; // Only CypressFailedRunResults has a status

        results.runs.forEach(specRun => {
          if (specRun.stats.failures === 0 && specRun.video) {
            fs.unlinkSync(specRun.video);
          }
        });
      });
    }
  }
});

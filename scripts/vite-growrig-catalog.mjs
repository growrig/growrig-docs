import path from 'node:path';
import { resolveCatalogRoot, resolveCatalogWatchPaths } from './lib/platform-paths.mjs';

/** Watch the catalog so device, vendor and species edits reload the dev server. */
export function growrigCatalogSync() {
  const catalogRoot = resolveCatalogRoot();
  const watchPaths = catalogRoot ? resolveCatalogWatchPaths(catalogRoot) : [];

  return {
    name: 'growrig-catalog-sync',
    configureServer(server) {
      if (watchPaths.length === 0) return;

      for (const watchPath of watchPaths) server.watcher.add(watchPath);

      const reload = (file) => {
        if (!watchPaths.some((watchPath) => file.startsWith(watchPath + path.sep) || file === watchPath)) {
          return;
        }
        server.ws.send({ type: 'full-reload', path: '*' });
      };

      server.watcher.on('change', reload);
      server.watcher.on('add', reload);
      server.watcher.on('unlink', reload);
    },
  };
}

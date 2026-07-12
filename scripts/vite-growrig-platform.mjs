import path from 'node:path';
import { resolvePlatformRoot, resolvePlatformWatchPaths } from './lib/platform-paths.mjs';

/** Watch growrig-platform so device and vendor edits reload the dev server. */
export function growrigPlatformSync() {
  const platformRoot = resolvePlatformRoot();
  const watchPaths = platformRoot ? resolvePlatformWatchPaths(platformRoot) : [];

  return {
    name: 'growrig-platform-sync',
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

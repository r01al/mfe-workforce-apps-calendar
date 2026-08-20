import { serveRemote } from '@r01al/mfe-workforce-common-server/runtime';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
serveRemote({ service: 'calendar', directory, defaultPort: 3004 });

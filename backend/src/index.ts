import 'dotenv/config';
import { createServer } from 'http';
import app from './app';
import { config } from './config';

const PORT = config.port;

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`
  🚀 Server ready at: http://localhost:${PORT}
  📊 Environment: ${config.nodeEnv}
  🔗 API: http://localhost:${PORT}/api
  `);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

import { app } from './app';
import { checkDatabaseConnection } from './config/db';
import { env } from './config/env';
import { ansi } from './shared/logging/ansi';
import { logStartup } from './shared/logging/startup-logger';

const bootstrap = async (): Promise<void> => {
  try {
    await checkDatabaseConnection();
  } catch {
    console.error('');
    console.error(ansi.bold(ansi.red('  No se pudo conectar a la base de datos.')));
    console.error(ansi.yellow('  Verifica que Postgres este levantado y DATABASE_URL sea valida.'));
    process.exit(1);
  }

  app.listen(env.PORT, () => {
    logStartup({ port: env.PORT, dbConnected: true });
  });
};

void bootstrap();

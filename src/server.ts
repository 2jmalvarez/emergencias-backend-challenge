import { app } from './app';
import { env } from './config/env';
import { logStartup } from './shared/logging/startup-logger';

app.listen(env.PORT, () => {
  logStartup({ port: env.PORT });
});

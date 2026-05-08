import { ansi } from './ansi';

type StartupInfo = {
  port: number;
};

export const logStartup = ({ port }: StartupInfo): void => {
  const now = new Date().toLocaleString('es-AR', { hour12: false });
  const baseUrl = `http://localhost:${port}`;
  const swaggerUrl = `${baseUrl}/docs`;

  console.log('');
  console.log(ansi.bold(ansi.green('  Emergencias API lista para usar')));
  console.log(ansi.gray('  ─────────────────────────────────────────────'));
  console.log(`${ansi.bold('  Hora de inicio')} : ${ansi.cyan(now)}`);
  console.log(`${ansi.bold('  API')}            : ${ansi.blue(baseUrl)}`);
  console.log(`${ansi.bold('  Swagger')}        : ${ansi.magenta(swaggerUrl)}`);
  console.log(ansi.gray('  ─────────────────────────────────────────────'));
};

import { ansi } from '../../src/shared/logging/ansi';
import { toSafeJson, methodColor, statusColor } from '../../src/shared/logging/http-logger';
import { logStartup } from '../../src/shared/logging/startup-logger';

describe('ansi unit', () => {
  it('bold envuelve texto con codigo ANSI bold', () => {
    const result = ansi.bold('test');
    expect(result).toBe('\x1b[1mtest\x1b[0m');
  });

  it('dim envuelve texto con codigo ANSI dim', () => {
    const result = ansi.dim('test');
    expect(result).toBe('\x1b[2mtest\x1b[0m');
  });

  it('red envuelve texto con codigo ANSI rojo', () => {
    const result = ansi.red('test');
    expect(result).toBe('\x1b[31mtest\x1b[0m');
  });

  it('green envuelve texto con codigo ANSI verde', () => {
    const result = ansi.green('test');
    expect(result).toBe('\x1b[32mtest\x1b[0m');
  });

  it('yellow envuelve texto con codigo ANSI amarillo', () => {
    const result = ansi.yellow('test');
    expect(result).toBe('\x1b[33mtest\x1b[0m');
  });

  it('blue envuelve texto con codigo ANSI azul', () => {
    const result = ansi.blue('test');
    expect(result).toBe('\x1b[34mtest\x1b[0m');
  });

  it('magenta envuelve texto con codigo ANSI magenta', () => {
    const result = ansi.magenta('test');
    expect(result).toBe('\x1b[35mtest\x1b[0m');
  });

  it('cyan envuelve texto con codigo ANSI cyan', () => {
    const result = ansi.cyan('test');
    expect(result).toBe('\x1b[36mtest\x1b[0m');
  });

  it('gray envuelve texto con codigo ANSI gris', () => {
    const result = ansi.gray('test');
    expect(result).toBe('\x1b[90mtest\x1b[0m');
  });
});

describe('http-logger unit', () => {
  describe('toSafeJson', () => {
    it('devuelve gris para null', () => {
      expect(toSafeJson(null)).toBe('\x1b[90m-\x1b[0m');
    });

    it('devuelve gris para undefined', () => {
      expect(toSafeJson(undefined)).toBe('\x1b[90m-\x1b[0m');
    });

    it('convierte string a string', () => {
      expect(toSafeJson('hello')).toBe('hello');
    });

    it('convierte number a string', () => {
      expect(toSafeJson(42)).toBe('42');
    });

    it('convierte boolean a string', () => {
      expect(toSafeJson(true)).toBe('true');
    });

    it('devuelve gris para array vacio', () => {
      expect(toSafeJson([])).toBe('\x1b[90m[]\x1b[0m');
    });

    it('devuelve gris para objeto vacio', () => {
      expect(toSafeJson({})).toBe('\x1b[90m{}\x1b[0m');
    });

    it('devuelve JSON formateado para objeto con datos', () => {
      const result = toSafeJson({ id: 1, name: 'test' });
      expect(result).toContain('"id": 1');
      expect(result).toContain('"name": "test"');
    });

    it('devuelve JSON formateado para array con datos', () => {
      const result = toSafeJson([1, 2, 3]);
      expect(result).toContain('1');
      expect(result).toContain('2');
      expect(result).toContain('3');
    });
  });

  describe('methodColor', () => {
    it('GET devuelve cyan', () => {
      expect(methodColor('GET')).toBe('\x1b[36mGET\x1b[0m');
    });

    it('POST devuelve green', () => {
      expect(methodColor('POST')).toBe('\x1b[32mPOST\x1b[0m');
    });

    it('PUT devuelve yellow', () => {
      expect(methodColor('PUT')).toBe('\x1b[33mPUT\x1b[0m');
    });

    it('PATCH devuelve yellow', () => {
      expect(methodColor('PATCH')).toBe('\x1b[33mPATCH\x1b[0m');
    });

    it('DELETE devuelve red', () => {
      expect(methodColor('DELETE')).toBe('\x1b[31mDELETE\x1b[0m');
    });

    it('metodo desconocido devuelve magenta', () => {
      expect(methodColor('UNKNOWN')).toBe('\x1b[35mUNKNOWN\x1b[0m');
    });
  });

  describe('statusColor', () => {
    it('5xx devuelve red', () => {
      expect(statusColor(500)).toBe('\x1b[31m500\x1b[0m');
      expect(statusColor(503)).toBe('\x1b[31m503\x1b[0m');
    });

    it('4xx devuelve yellow', () => {
      expect(statusColor(400)).toBe('\x1b[33m400\x1b[0m');
      expect(statusColor(404)).toBe('\x1b[33m404\x1b[0m');
    });

    it('3xx devuelve magenta', () => {
      expect(statusColor(301)).toBe('\x1b[35m301\x1b[0m');
      expect(statusColor(304)).toBe('\x1b[35m304\x1b[0m');
    });

    it('2xx devuelve green', () => {
      expect(statusColor(200)).toBe('\x1b[32m200\x1b[0m');
      expect(statusColor(201)).toBe('\x1b[32m201\x1b[0m');
    });
  });
});

describe('startup-logger unit', () => {
  const originalConsoleLog = console.log;

  beforeEach(() => {
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  it('logStartup imprime mensajes con db conectada', () => {
    logStartup({ port: 3001, dbConnected: true });

    expect(console.log).toHaveBeenCalled();
    const allCalls = (console.log as jest.Mock).mock.calls.join(' ');
    expect(allCalls).toContain('3001');
    expect(allCalls).toContain('Conectada');
  });

  it('logStartup imprime mensajes con db desconectada', () => {
    logStartup({ port: 3000, dbConnected: false });

    expect(console.log).toHaveBeenCalled();
    const allCalls = (console.log as jest.Mock).mock.calls.join(' ');
    expect(allCalls).toContain('3000');
    expect(allCalls).toContain('Sin conexion');
  });
});

import debug, { Debugger } from 'debug';

class Logger {
  private loggers: { [key: string]: Debugger };

  private tags: string | string[];

  constructor(tags: string | string[]) {
    this.tags = tags;
    this.loggers = {};
  }

  tag(tags: string | [string]): Logger {
    return new Logger([
      ...(this.tags as string[]),
      ...(typeof tags === 'string' ? [tags] : tags),
    ]);
  }

  log(level: string, ...args: (string | Error | object)[]): void {
    const tags = [...this.tags].join(',');
    const scope = `${level}${tags ? `:${tags}` : ''}`;
    const logger = this.loggers[scope] ? this.loggers[scope] : debug(scope);

    this.loggers[scope] = logger;

    const items = args
      .map((item: string | Error | object) => {
        if (item instanceof Error) {
          const obj = { message: item.message };

          Object.getOwnPropertyNames(item).forEach(property => {
            (obj as any)[property] = (item as any)[property];
          });

          return obj;
        }

        if (typeof item === 'string') {
          return item.replace(/\n/, '\\n');
        }

        return item;
      })
      .map(item => {
        if (typeof item === 'object') {
          return JSON.stringify(item);
        }

        return item;
      }) as string[];

    logger(items[0], ...items.slice(1));
  }

  error(...args: (string | Error | object)[]): void {
    this.log.apply(this, ['error', ...args]);
  }

  warn(...args: (string | Error | object)[]): void {
    this.log.apply(this, ['warn', ...args]);
  }

  info(...args: (string | Error | object)[]): void {
    this.log.apply(this, ['info', ...args]);
  }

  verbose(...args: (string | Error | object)[]): void {
    this.log.apply(this, ['verbose', ...args]);
  }

  silly(...args: (string | Error | object)[]): void {
    this.log.apply(this, ['silly', ...args]);
  }
}

export default Logger;

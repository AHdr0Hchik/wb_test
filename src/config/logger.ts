import log4js from 'log4js';

export function setupLogger() {
    log4js.configure({
        appenders: {
            console: { type: 'console' },
            file: { 
                type: 'file', 
                filename: 'logs/app.log',
                maxLogSize: 10485760,
                backups: 5
            }
        },
        categories: {
            default: { 
                appenders: ['console', 'file'], 
                level: process.env.NODE_ENV === 'production' ? 'info' : 'debug' 
            }
        }
    });

    return log4js.getLogger('default');
}
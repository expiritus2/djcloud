class Logger {
    log(...args) {
        console.log(...args);
    }

    error(...args) {
        console.log(...args);
    }

    info(...args) {
        console.info(...args);
    }
}

export default new Logger();

class LimitExceededError extends Error {
    constructor() {
        super('Limit has been exceeded.');

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);

        this.code = 413;
        this.message = 'Limit has been exceeded.';
    }
}

module.exports = LimitExceededError;

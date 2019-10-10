class InternalServerError extends Error {
    constructor() {
        super('Internal server error.');

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);

        this.code = 500;
        this.message = 'Internal server error.';
    }
}

module.exports = InternalServerError;

class BadRequestError extends Error {
    constructor() {
        super('Bad Request.');

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);

        this.code = 400;
        this.message = 'Bad request.';
    }
}

module.exports = BadRequestError;

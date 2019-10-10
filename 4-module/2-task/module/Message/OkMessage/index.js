class OkMessage extends Error {
    constructor() {
        super('OK.');

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);

        this.code = 201;
        this.message = 'OK.';
    }
}

module.exports = OkMessage;

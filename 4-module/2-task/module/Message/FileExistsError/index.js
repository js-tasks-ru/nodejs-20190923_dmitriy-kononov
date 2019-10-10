class FileExistsError extends Error {
    constructor() {
        super('File exists.');

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);

        this.code = 409;
        this.message = 'File exists.';
    }
}

module.exports = FileExistsError;

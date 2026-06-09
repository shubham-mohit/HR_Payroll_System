export class AppError extends Error {
    constructor(message, statuscode, code) {
        super(message);
        this.statuscode = statuscode;
        this.code = code;
    }
}

export class BadrequestError extends AppError {
    constructor(message, code = "BAD_REQUEST") {
        super(message, 400, code);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message, code = "UNAUTHORIZED") {
        super(message, 401, code);
    }
}

export class ForbiddenError extends AppError {
    constructor(message, code = "FORBIDDEN") {
        super(message, 403, code);
    }
}

export class NotFoundError extends AppError {
    constructor(message, code = "NOT_FOUND") {
        super(message, 404, code);
    }
}

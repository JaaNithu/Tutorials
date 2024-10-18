import { HttpStatus, ValidationPipe } from "@nestjs/common";

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

const PASSWORD_MESSAGE = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).';

const VALIDATION_PIPE = new ValidationPipe({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY });

export const RULE = (
    PASSWORD_RULE
)

export const MESSAGES = (
    PASSWORD_MESSAGE
)

export const SETTINGS = (
    VALIDATION_PIPE
)
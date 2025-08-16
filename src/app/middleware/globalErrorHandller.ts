import { NextFunction, Request, Response } from "express";
import { TErrorSources } from "../interface/error.types";
import { envVar } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { handlerDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handlerZodError } from "../helpers/handleZodError";
import { handlerValidationError } from "../helpers/handleValidateError";


export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
    let errorSources: TErrorSources[] = []; 
    // step-1
    let statusCode = 500;
    let message = "Something went Wrong!";
    
    // step -3
    if (err.code === 11000) {
        const simplifiedError = handlerDuplicateError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    } else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    } else if (err.name === "ZodError") {
        const simplifiedError = handlerZodError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources as TErrorSources[];
    } else if (err.name === "ValidationError") {
        const simplifiedError = handlerValidationError(err);
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources as TErrorSources[];
        message = simplifiedError.message;

    } else if (err instanceof AppError) {  //step -2 
        statusCode = err.statusCode;
        message = err.message;
    } else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources, // plural property
        stack: envVar.NODE_ENV === "development" ? err.stack : null
    });
};

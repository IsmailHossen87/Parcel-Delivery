// TRY-CATCH

import { NextFunction, Request, Response } from "express"

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>

//fn Input
export const catchAsync =(fn:AsyncHandler) => (req:Request,res:Response,next:NextFunction)=>{
    Promise.resolve(fn(req,res,next)).catch((err:any)=>{
        next(err)   //Global Error Handler er kase jabe
    })
}
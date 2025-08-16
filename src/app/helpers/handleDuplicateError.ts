import { TGenericErrorResponse } from "../interface/error.types"

export const handlerDuplicateError =(err:any) :TGenericErrorResponse=>{
    const matchedArray =err.message.match(/"([^"]*)"/)

    return {
        statusCode:400,
        message:`${matchedArray[1]} already exists!!`
    }
}
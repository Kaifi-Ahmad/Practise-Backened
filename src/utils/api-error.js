class ApiError extends Error {
    constructor(statusCode,message,errors="Something Went Wrong",stack=""){
        super(message)
        this.statusCode=statusCode
        this.data=null
        this.message=message
        this.errors=errors
        this.success=false
        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}
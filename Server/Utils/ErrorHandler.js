class ErrorHandler extends Error{
    constructor(message,statuscode){
        super(message)
        this.statuscode=statuscode
        Error.captureStackTrace(this,this.constructor)
     
    }
}

module.exports = ErrorHandler


const handleError = (err, req, res, next) => {
    const message = err.message || 'Something went wrong';
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: message,
    });
};

module.exports = { ErrorHandler, handleError };

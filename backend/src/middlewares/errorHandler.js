// HANDLE ROUTE ERRORS
const routeNotFound = (req, res, next) =>{
    const error = new Error(`Routes Not Found ${req.originalUrl}` );
    res.status(404);
    next(error);
}


// HANDLE ERROR
const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
    // res.status(statusCode).json({
    //     message: error.message,
    //     stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    // });


     if(err.name === 'CastError' && err.kind === 'ObjectId'){
        statusCode = 404;
        message = 'Resource not found';
    };

    res.status(statusCode).json({
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = {errorHandler, routeNotFound};
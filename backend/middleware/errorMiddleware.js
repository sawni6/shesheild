const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.ststus(statusCode).json({
        success: false,
        message: err.message || 'Internal Serval Error',
    });
};
module.exports = errorMiddleware;

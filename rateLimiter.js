const moment = require('moment')

const WINDOW_SIZE_IN_HOURS = 24;
const MAX_WINDOW_REQUEST_COUNT = 100;
const WINDOW_LOG_INTERVAL_IN_HOURS = 1;


module.exports = rateLimiter = (req, res, next) => {
    try {
        var ip = req.ip;
        console.log(ip)
        next()
    } catch (error) {
        next(error);
    }
};
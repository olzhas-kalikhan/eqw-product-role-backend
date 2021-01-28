const moment = require('moment')

const WINDOW_SIZE_IN_MS = 1 * 60 * 1000;
const MAX_WINDOW_REQUEST_COUNT = 30;

//local store, can be moved to redis or other 3rd party storage
const ipStore = {};
//state for each new ip or for resetting a state after window sized passed
const initialState = () => ({
    timestamp: Date.now(),
    counter: MAX_WINDOW_REQUEST_COUNT
});
module.exports = rateLimiter = (req, res, next) => {
    try {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        //initialize if it is 1st time requesting
        if (!ipStore[ip]) {
            ipStore[ip] = initialState();
        }
        //reduce counter when request is made
        else {
            ipStore[ip].counter -= 1
        }
        //reset after window size passed
        if (Date.now() - ipStore[ip].timestamp >= WINDOW_SIZE_IN_MS) {
            ipStore[ip] = initialState();
        }
        //return message when max requests exceeded
        if (ipStore[ip].counter <= 0) {
            return res.json({ error: 'Max requests exceeded' })
        }
        //continue if requests counter within the limit
        next()
    } catch (error) {
        next(error);
    }
};
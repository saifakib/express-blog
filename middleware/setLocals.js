const cheerio  = require('cheerio')
const moment = require('moment')
module.exports = () => {
    return (req, res, next) => {
        res.locals.user = req.user,
        res.locals.isloggedIn = req.session.isloggedIn,
        console.log("req.isloggedIn = " + res.locals.isloggedIn);
        console.log(res.locals.user);
        res.locals.truncate = html => {
            let text = cheerio.load(html).text()

            text = text.replace(/(\r\r|\n\r)/gm,' ')
            if(text.length < 100 ) return text

            return text.substr(0, 100) + '...'
        };
        res.locals.moment = time => moment(time).fromNow()
        next()
    }
}
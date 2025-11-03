const { verifyToken } = require('../services/tokenServices');

const check = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

const authUser = async (req, res, next) => {
    try{
        const user = req.cookies.token;
        if(!user) throw new Error("Vui lòng đăng nhập!");
        const data  = await verifyToken(user);
        req.user = data;
        next();
    }catch(err){
        console.log(err);
        next(err);
    }
};

module.exports = {
    check,
    authUser
};
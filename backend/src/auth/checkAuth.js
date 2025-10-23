const { verifyToken } = require('../services/tokenServices');

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

const authUser = async (req, res, next) => {
    try{
        const user = req.cookies.token;
        if(!user) throw new error("Vui lòng đăng nhập!");
        const data  = await verifyToken(user);
        req.user = data;
        next();
    }catch(err){
        console.log(err);
        next(err);
    }
};

module.exports = {
    asyncHandler,
    authUser
};
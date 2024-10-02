const zod = require('zod');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('./config');

const signup_mw = async (req, res, next) => {
    const schema = zod.object({
        email : zod.string().email(),
        firstname: zod.string(),
        lastname: zod.string(),
        password: zod.string().min(8)
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        return res.json({
            msg: "enter correct credentials",
            success: false
        });
    }
    next();
};

const signin_mw = async (req,res,next) => {
    const schema = zod.object({
        email : zod.string().email(),
        password: zod.string().min(8)
    });
    const parsed = schema.safeParse(req.body);
    if(!parsed.success) {
        return res.json({
            msg:"enter correct credentials",
            success: false
        });
    }
    next();
}

const update_mw = async (req,res,next) => {
    const schema = zod.object({
        firstname : zod.string(),
        lastname : zod.string(),
        password: zod.string().min(8)
    });
    const parsed = schema.safeParse(req.body);
    if(!parsed.success) {
        return res.json({
            msg:"enter correct credentials"
        });
    }
    next();
}

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.Authorization || req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if(decoded.existingID || decoded.userID){
            req.userId = decoded.existingID || decoded.userID ;
            next();
        }
        else return res.status(403).json({
            msg:"f"
        });
    } catch (error) {
        return res.status(403).json({})
    }
}

module.exports = {
    signup_mw,
    signin_mw,
    update_mw,
    authMiddleware
};

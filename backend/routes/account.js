const { default: mongoose } = require('mongoose');
const { Account } = require('../db');
const { authMiddleware } = require('../middlewares');
const Router = require('express').Router();

Router.get('/balance', authMiddleware, async (req,res) => {
    const id = req.userId;

    const user = await Account.findOne({userId : id});
    
    return res.json({
        balance : user.balance
    })
})

Router.post('/transfer', authMiddleware, async (req, res) => { 
    const session = await mongoose.startSession();

    session.startTransaction();
    const { to, amount } = req.body;
    const id = req.userId;
    const to_User = await Account.findOne({ userId : to }).session(session);
    const from_User = await Account.findOne({ userId : id }).session(session);
    if(!to_User || !from_User){
        await session.abortTransaction();
        return res.status(400).json({
            msg: "invalid account"
        })
    }    
    if(from_User.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            msg: "insufficient amount"
        })
    }
    await Account.findOneAndUpdate(
        { userId : id },
        { $inc : { balance : -amount }}
    )
    await Account.findOneAndUpdate(
        { userId : to },
        { $inc : { balance : amount}}
    )
    session.commitTransaction();
    return res.json({
        msg: "Transfer successful"
    })
})

module.exports = Router ;

const Router = require('express').Router();
const userRouter = require('./user');
const accRouter = require('./account');

Router.use('/user',userRouter);
Router.use('/account', accRouter);
module.exports = {
    Router
};

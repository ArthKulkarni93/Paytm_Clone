const { User, Account } = require('../db');
const { signup_mw, signin_mw, update_mw, authMiddleware } = require('../middlewares');
const Router = require('express').Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const zod = require('zod');

Router.post('/signup', signup_mw, async (req, res) => {
    const { email, firstname, lastname, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
        if (existing.lastname === lastname && existing.email === email) {
            return res.status(411).json({
                msg: "user already exists, try signing in",
                success: false
            });
        }
    }
    const newuser = await User.create({
        email,
        firstname,
        lastname,
        password
    });
    await Account.create({
        userId : newuser._id,
        balance : 1
    })
    const userID = newuser._id;
    const Token = jwt.sign({userID},JWT_SECRET);
    res.json({
        msg: "user created successfully",
        Token: Token,
        success: true
    });
});

Router.post('/signin', signin_mw, async (req,res)=>{
    const { email, password }  = req.body;
    const existing = await User.findOne({email});
    if(existing) {
        if(existing.password === password) {
            const Token = jwt.sign({
                existingID : existing._id
            }, JWT_SECRET);
            return res.json({
                msg:"user signed in successfully",
                Token:Token,
                success: true
            })
        }
    }
    res.json({
        msg:"user does not exists, try signup",
        success: false
    })
})

Router.put('/update', authMiddleware, async (req, res) => {
    const update_Schema = zod.object({
        email: zod.string().email().optional(),
        firstname: zod.string().optional(),
        lastname: zod.string().optional(),
        password: zod.string().min(8).optional(),
        newemail: zod.string().email().optional(),
        newfirstname: zod.string().optional(),
        newlastname: zod.string().optional(),
        newpassword: zod.string().min(8).optional()
    });

    const payload = update_Schema.safeParse(req.body);
    if (!payload.success) {
        return res.status(400).json({
            msg: "Enter correct credentials"
        });
    }

    // Find the existing user by email and password from the token
    const existingUser = await User.findOne({ email: req.body.email, password: req.body.password });
    if (!existingUser) {
        return res.status(404).json({ msg: "User not found or incorrect credentials." });
    }

    // Update only fields that are provided
    const updatedFields = {};
    if (req.body.newemail) updatedFields.email = req.body.newemail;
    if (req.body.newfirstname) updatedFields.firstname = req.body.newfirstname;
    if (req.body.newlastname) updatedFields.lastname = req.body.newlastname;
    if (req.body.newpassword) updatedFields.password = req.body.newpassword; // Remember to hash this

    await User.updateOne({ _id: existingUser._id }, { $set: updatedFields });

    return res.json({
        msg: "Updated the info"
    });
});


Router.get('/bulk', async (req, res) => {
    const { filter } = req.query;
    const userId = req.userId
    let query = {};
    if (filter) {
        query = {
            $or: [
                { firstname: { '$regex': filter, '$options': 'i' } },
                { lastname: { '$regex': filter, '$options': 'i' } }
            ]
        };
    }

    try {
        const users = await User.find(query);
        // console.log("Filter:", filter);
        // console.log("Users found:", users);

        res.json({
            user: users.map(user => ({
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                _id: user._id
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error.' });
    }
});



module.exports = Router
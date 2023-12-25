import passport from 'passport';
import passportJWT from 'passport-jwt';
import UserModel from './../api/users/userModel';
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import User from "../api/users/userModel";

dotenv.config();

// const JWTStrategy = passportJWT.Strategy;
// const ExtractJWT = passportJWT.ExtractJwt;
//
// let jwtOptions = {};
// jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
// jwtOptions.secretOrKey = process.env.SECRET;
// const strategy = new JWTStrategy(jwtOptions, async (payload, next) => {
//     const user = await UserModel.findByUserName(payload);
//     if (user) {
//         next(null, user);
//     } else {
//         next(null, false);
//     }
// });
// passport.use(strategy);

// 自定义身份验证中间件
const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);

        // console.info(decoded)

        const user = await User.findByUserName(decoded.username)
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};

export { authenticate };

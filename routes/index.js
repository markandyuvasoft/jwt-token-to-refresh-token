import express from 'express'
import morgan from 'morgan'
import  Jwt  from 'jsonwebtoken';
import checkAuth from '../middleware/check-auth.js'

let refreshTokens = [];

const indexrouter=express.Router()


// Route to login user start. (In this case, create an token)......................................................................
indexrouter.post("/login", (req, res) => {
    const user = req.body.user;
    console.log(user);

    if (!user) {
        return res.status(404).json({ message: "Body empty" });
    }

    let accessToken = Jwt.sign(user, "access", { expiresIn: "15s" });   // ACCESS token time limit
    let refreshToken = Jwt.sign(user, "refresh", { expiresIn: "7d" });
    refreshTokens.push(refreshToken);

    return res.status(201).json({
        accessToken,
        refreshToken
    });
});
// Route to login user End. (In this case, create an token)......................................................................


// Protected route start, can only be accessed when user is logged-in.............................................................
indexrouter.post("/protected", checkAuth, (req, res) => {
     return res.json({ message: "welcome!!...." });
});
// Protected route end, can only be accessed when user is logged-in...............................................................



// If the refresh token is valid, create a new accessToken and return it..........................................................
indexrouter.post("/refresh", (req, res, next) => {
    const refreshToken = req.body.token;
    if (!refreshToken || !refreshTokens.includes(refreshToken)) {
        return res.json({ message: "Refresh token not found, login again" });
    }

    Jwt.verify(refreshToken, "refresh", (err, user) => {
        if (!err) {
            const accessToken = Jwt.sign({ username: user.name }, "access", {
                expiresIn: "50s"
            });
            return res.json({ success: true, accessToken });
        } else {
            return res.json({
                success: false,
                message: "Invalid refresh token"
            });
        }
    });
});
// If the refresh token is valid, create a new accessToken and return it...........................................................



export default indexrouter
import User from "../models/user.model.js"
import jwt from 'jsonwebtoken'

export const googleAuth = async (req, res)=>{
	try {
		const {name, email, avatar} = req.body;
		if (!email) {
			return res.status(400).json({
				message: "email is required"
			})
		}
		let user = await User.findOne({ email: email})
		if (!user) {
			user  = await User.create({name, email, avatar})
		}
		// token
		const token = await jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '7d'})
		res.cookie('token', token, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			maxAge: 7 * 24 * 60 * 60 * 1000 // 7days
		})
		return res.status(200).json(user)
	} catch (e) {
        return res.status(500).json({message: "Google authentication failed", error: e.message});
	}
}

export const logoutUser = (req, res) => {
    try {
         res.clearCookie("token", {
            httpOnly: true,
            secure: true,     
            sameSite: "none"
        });
		  return res.status(200).json({message: "logout successfully"})

    } catch (e) {
        return res.status(500).json({message: "Logout failed", error: e.message});
    }
};


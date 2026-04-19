import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
 export const isAuth = async (req, res, next) => {
	try {
		const token = req.cookies.token
		if(!token){
			return res.status(401).json({message: "Token not found"})
		}
		const decoded =  jwt.verify(token, process.env.JWT_SECRET_KEY)
		req.user = await User.findById(decoded.id)
		next()
	} catch (e) {
		return res.status(401).json({message: "Invalid token"})
	}
}
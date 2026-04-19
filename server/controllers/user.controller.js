

export const getCurrentUser = async(req, res)=>{
	try {
		if (!req.user) {
			return res.status(400).json({user: 'null'})
		}

		return res.status(200).json({user: req.user})
		
	} catch (error) {
		return res.status(500).json({message: "get current user error"})		
	}
}
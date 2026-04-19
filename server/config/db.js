import mongoose from 'mongoose';

export const connectDB = async ()=>{
	try {
		await mongoose.connect(process.env.MONGO_DB_URI)
		console.log("Database connected Successfully");
		
	} catch (e) {
		console.error("Database error : ", e)
	}
}
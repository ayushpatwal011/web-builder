import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { auth, provider } from '../firebase'
import { signInWithPopup } from 'firebase/auth'
import axios from 'axios'
import { SERVER_URL } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { toast } from 'react-toastify'

const LoginModel = ({ open, onClose }) => {
	const dispatch = useDispatch()
	const handleGoogleAuth = async ()=>{
		try {
			const result = await signInWithPopup(auth, provider)
			const { data }  =  await axios.post(`${SERVER_URL}/api/auth/google`, {
				email: result.user.email,
				name: result.user.displayName,
				avatar: result.user.photoURL
			}, { withCredentials: true })
			dispatch(setUserData(data))
			toast.success("Login successful!")
			onClose()
			
		} catch (e) {
			toast.error("Login failed. Please try again.")
			console.log(e);
		}
	}
	return (
		<AnimatePresence>
			{open && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
					onClick={onClose}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					{/* Modal Box */}
					<motion.div
						onClick={(e) => e.stopPropagation()}
						className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-[90%] max-w-md shadow-2xl"
						initial={{ scale: 0.85, y: 60, opacity: 0 }}
						animate={{ scale: 1, y: 0, opacity: 1 }}
						exit={{ scale: 0.85, y: 60, opacity: 0 }}
						transition={{ duration: 0.35, ease: "easeOut" }}
					>
						{/* Close Button */}
						<button
							onClick={onClose}
							className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
						>
							✕
						</button>

						{/* Content */}
						<div className="text-center">
							<h2 className="text-xl font-semibold text-white mb-6">
								Welcome to
								<span className=' pro'>
									{" "} WEB BUILDER AI
								</span>
							</h2>

							{/* Google Button */}
							<motion.button
								whileHover={{ scale: 1.03 }}
								whileTap={{ scale: 0.97 }}
								className="w-full flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl transition-all duration-300 border border-zinc-700"
								onClick={()=> handleGoogleAuth()}
							>
								<img
									src="https://www.svgrepo.com/show/475656/google-color.svg"
									alt="google"
									className="w-5 h-5"
								/>
								Continue with Google
							</motion.button>
						</div>

						{/* Divider */}
						<div className="mt-8 text-center">
							<div className="flex items-center gap-3 mb-4">
								<div className="flex-1 h-px bg-zinc-700"></div>
								<span className="text-sm text-zinc-400 whitespace-nowrap">
									Secure Login
								</span>
								<div className="flex-1 h-px bg-zinc-700"></div>
							</div>
							<p className="text-xs text-zinc-500 leading-relaxed">
								By continuing, you agree to our{" "}
								<span className="underline hover:text-zinc-300 cursor-pointer">
									Terms of Service
								</span>{" "}
								and{" "}
								<span className="underline hover:text-zinc-300 cursor-pointer">
									Privacy Policy
								</span>.
							</p>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default LoginModel
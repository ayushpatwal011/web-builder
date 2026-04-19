import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LoginModel from '../components/LoginModel'
import { useDispatch, useSelector } from 'react-redux'
import { Coins, LogOutIcon } from 'lucide-react'
import axios from 'axios'
import { SERVER_URL } from '../App'
import { setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'
const Home = () => {

	const highlightes = [
		'AI generated code',
		'Fully responsive code',
		'Prduction ready output'
	]

	const [openLogin, setOpenLogin] = useState(false)
	const { userData } = useSelector(state => state.user)
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const handleLogout = async () => {
		try {
			await axios.get(`${SERVER_URL}/api/auth/logout`, { withCredentials: true })
			dispatch(setUserData(null))
		} catch (e) {
			console.log(e);

		}
	}


	return (
		<div className='relative min-h-screen bg-black text-white overflow-hidden'>

			{/* Header */}
			<motion.div
				initial={{ y: -40, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5 }}
				className='fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10'
			>
				<div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
					<div className='text-xl font-bold tracking-wide '>
						WebBuilder.ai
					</div>
					<div className='hidden md:flex gap-8  text-gray-300'>
						<button className='path' onClick={()=> navigate('/pricing')}>
							Pricing
						</button>
						<button
						onClick={()=> navigate('/dashboard')}
						 className='path'>
							Dashoard
						</button>
						<button className=' path'>
							About
						</button>
					</div>
					<div className='flex justify-content-center items-center gap-5'>

						{
							userData && <div className='flex items-center justify-content-center gap-1 hover:text-white cursor-pointer btn' onClick={()=> navigate('/pricing')}>
								<Coins /> <span>Cradits</span> <span className='font-bold'>{userData.credits}</span>
							</div>
						}
						{
							!userData ?
								<button className='bg-zinc-900 hover:bg-zinc-800 px-4 py-2 rounded-lg text-sm font-medium transition' onClick={() => setOpenLogin(true)}>
									Get Started
								</button> :
								<div className='flex items-center justify-content-center gap-4'>

									<button onClick={() => setOpenProfile(true)} >
										<img
											src={userData.avatar || `https://ui-avatars.com/api/?name=${userData.user.name}`}
											alt="avatar"
											className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-400 hover:scale-110 transition-transform duration-200 cursor-pointer"
										/>
									</button>
									<button onClick={()=> handleLogout()} className='btn-icon'>
										<LogOutIcon /> 
									</button>
								</div>
						}
					</div>
				</div>
			</motion.div>

			{/* Hero Section */}
			<section className='pt-44 pb-32 px-6 text-center'>

				<motion.h1
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className='text-4xl md:text-6xl font-bold '
				>
					Change your idea into website
					<br />
					<span className=' pro'>
						WEB BUILDER AI
					</span>
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.6 }}
					className='mt-6 text-gray-400 max-w-xl mx-auto'
				>
					Gererate a website in just seconds. Describe your idea and wait for magic. No coding required
				</motion.p>
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.6, duration: 0.4 }}
					className='mt-8'
				>
					<button className='btn'
					onClick={()=> navigate('/generated')}>
						Start Building
					</button>
				</motion.div>

			</section>

			{/* highlight */}
			<section className="max-w-7xl mx-auto px-6 pb-32 grid md:grid-cols-3 gap-8">
				{highlightes.map((h, i) => {
					return (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: i * 0.5 }}
							className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300"
						>
							<h1 className="text-xl font-semibold text-white mb-3">
								{h}
							</h1>

							<p className="text-gray-300 text-sm leading-relaxed">
								Gererate a website in just seconds. Describe your idea and wait for magic. No coding required
							</p>
						</motion.div>
					);
				})}
			</section>

			{/* login Model */}
			{openLogin && <LoginModel open={openLogin} onClose={() => setOpenLogin(false)} />}

		</div>
	)
}

export default Home
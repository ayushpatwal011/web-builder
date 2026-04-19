import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { Coins, LoaderIcon, MoveLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
	Paperclip,
	Image,
	Mic,
	SendHorizonal,
} from "lucide-react";
import axios from 'axios'
import { SERVER_URL } from '../App'

const Generated = () => {
	const { userData } = useSelector(state => state.user)
	const [prompt, setPrompt] = useState('')
	const [loading, setLoading] = useState(false)

	const handleGenerateWebsite = async()=>{
		try {
			setLoading(true)
			const result = await axios.post(`${SERVER_URL}/api/website/generate`, {
				prompt
			}, {withCredentials: true})
			navigate(`/editor/${result.data.websiteId}`)			
		} catch (e) {
			console.log("error in handlegeneratewebite");
			
		}
		finally{
			setLoading(false)
		}
	}

	const navigate = useNavigate()
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
					<div className='flex justify-content-center items-center gap-4'>
						<button onClick={() => navigate('/')} className='btn-icon'>
							<MoveLeft />
						</button>
						<div className='text-xl font-bold pro '>
							WebBuilder.ai
						</div>
					</div>

					<div className='flex justify-content-center items-center gap-4'>

						<div className='flex items-center justify-content-center gap-1 hover:text-white cursor-pointer text-sm'>
							<Coins /> <span>Cradits</span> <span className='font-bold'>{userData.credits}</span>
						</div>

						<button  >
							<img
								src={userData.avatar || `https://ui-avatars.com/api/?name=${userData.user.name}`}
								alt="avatar"
								className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-400 hover:scale-110 transition-transform duration-200 cursor-pointer"
							/>
						</button>
					</div>
				</div>
			</motion.div>

			{/* Hero Section */}
			<section className='pt-44 pb-32 px-6 text-center'>

				<motion.h1
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className='text-2xl md:text-4xl '
				>
					Build apps with chat
					<br />
				</motion.h1>

				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.6, duration: 0.4 }}
					className='mt-8'
				>
					<div className="w-full max-w-3xl mx-auto px-4 h-40">
						<div className={`flex items-end gap-2 bg-[#1e1e1e] border rounded-2xl p-3 shadow-lg ${
							prompt.trim() && !loading ? 'border-orange-400' :'border-zinc-400 cursor-not-allowed'
						}`}>


							{/* Input Field */}
							<textarea
								rows={4}
								placeholder="Ask anything..."
								value={prompt}
								onInput={(e)=>setPrompt(e.target.value)}
								className="flex-1 p-2 bg-transparent resize-none outline-none text-white placeholder-gray-400 max-h-40 overflow-y-auto"
							/>

							<div className="flex gap-3 items-center text-gray-400">
								<button className="hover:text-white">
									<Paperclip size={20} />
								</button>
								<button className="hover:text-white">
									<Image size={20} />
								</button>
								<button className="hover:text-white">
									<Mic size={20} />
								</button>

								<button
									className={`bg-white text-black p-2 rounded-xl hover:bg-gray-200 transition ${prompt.trim() && 'disabled'}`}
									onClick={()=> handleGenerateWebsite() }
								>
									{
										!loading ? 
										<SendHorizonal size={18} /> :
										<LoaderIcon size={18} className='animate-spin ' />
									}
								</button>
							</div>
						</div>
					</div>
				</motion.div>

			</section>
		</div>
	)
}

export default Generated
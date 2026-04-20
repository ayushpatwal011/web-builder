import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LoginModel from '../components/LoginModel'
import { useDispatch, useSelector } from 'react-redux'
import { Coins, LogOutIcon, ExternalLink, Sparkles } from 'lucide-react'
import axios from 'axios'
import { SERVER_URL } from '../App'
import { setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Home = () => {

	const highlightes = [
		'AI generated code',
		'Fully responsive code',
		'Production ready output'
	]

	const showcaseProjects = [
		{
			title: "Mom's Shop",
			description: "A fully AI-generated e-commerce storefront for a local momo shop. Complete with menu, branding, and a clean responsive layout — built in seconds.",
			url: "https://web-builder-1.onrender.com/site/generateawebsiteformomosshop-bbdbe",
			tag: "E-Commerce",
		},
		{
			title: "Modern Calculator",
			description: "A sleek, interactive calculator web app generated entirely by AI. Polished UI, smooth interactions, and production-ready code — no developer needed.",
			url: "https://web-builder-1.onrender.com/site/generateamoderncalculatorwebsite-5e51f",
			tag: "Web App",
		},
	]

	const [openLogin, setOpenLogin] = useState(false)
	const { userData } = useSelector(state => state.user)
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const handleLogout = async () => {
		try {
			await axios.get(`${SERVER_URL}/api/auth/logout`, { withCredentials: true })
			dispatch(setUserData(null))
			toast.info("Logged out successfully")
		} catch (e) {
			toast.error("Logout failed")
			console.log(e)
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
					<div className='text-xl font-bold tracking-wide'>
						WebBuilder.ai
					</div>
					<div className='hidden md:flex gap-8 text-gray-300'>
						<button className='path' onClick={() => navigate('/pricing')}>Pricing</button>
						<button className='path' onClick={() => navigate('/dashboard')}>Dashboard</button>
						<button className='path'>About</button>
					</div>
					<div className='flex items-center gap-5'>
						{userData && (
							<div className='flex items-center gap-1 hover:text-white cursor-pointer btn' onClick={() => navigate('/pricing')}>
								<Coins /> <span>Credits</span> <span className='font-bold'>{userData.credits}</span>
							</div>
						)}
						{!userData ? (
							<button className='bg-zinc-900 hover:bg-zinc-800 px-4 py-2 rounded-lg text-sm font-medium transition' onClick={() => setOpenLogin(true)}>
								Get Started
							</button>
						) : (
							<div className='flex items-center gap-4'>
								<button onClick={() => setOpenProfile(true)}>
									<img
										src={userData.avatar || `https://ui-avatars.com/api/?name=${userData.user.name}`}
										alt="avatar"
										className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-400 hover:scale-110 transition-transform duration-200 cursor-pointer"
									/>
								</button>
								<button onClick={handleLogout} className='btn-icon'>
									<LogOutIcon />
								</button>
							</div>
						)}
					</div>
				</div>
			</motion.div>

			{/* Ambient glow background */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

			{/* Hero Section */}
			<section className='pt-44 pb-32 px-6 text-center'>
				<motion.h1
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className='text-4xl md:text-6xl font-bold'
				>
					Change your idea into website
					<br />
					<span className='pro'>WEB BUILDER AI</span>
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.6 }}
					className='mt-6 text-gray-400 max-w-xl mx-auto'
				>
					Generate a website in just seconds. Describe your idea and wait for magic. No coding required.
				</motion.p>
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.6, duration: 0.4 }}
					className='mt-8'
				>
					<button className='btn' onClick={() => navigate('/generated')}>
						Start Building
					</button>
				</motion.div>
			</section>

			{/* Highlights */}
			<section className="max-w-7xl mx-auto px-6 pb-32 grid md:grid-cols-3 gap-8">
				{highlightes.map((h, i) => (
					<motion.div
						key={i}
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: i * 0.15 }}
						className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300"
					>
						<h1 className="text-xl font-semibold text-white mb-3">{h}</h1>
						<p className="text-gray-300 text-sm leading-relaxed">
							Generate a website in just seconds. Describe your idea and wait for magic. No coding required.
						</p>
					</motion.div>
				))}
			</section>

			{/* ── Showcase Section ── */}
			<section className="max-w-7xl mx-auto px-6 pb-40">

				{/* Section header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-20"
				>
					<div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 tracking-widest uppercase">
						<Sparkles size={13} /> Live Examples
					</div>
					<h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
						See What AI Can Build <br />
						<span className="text-orange-400">In Seconds</span>
					</h2>
					<p className="mt-4 text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">
						These websites were generated entirely by AI — no designer, no developer. Just a prompt and a few seconds.
					</p>
				</motion.div>

				{/* Project cards */}
				<div className="flex flex-col gap-32">
					{showcaseProjects.map((project, i) => {
						const isEven = i % 2 === 0
						return (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 60 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-80px" }}
								transition={{ duration: 0.7, ease: "easeOut" }}
								className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
							>
								{/* iFrame preview */}
								<motion.div
									whileHover={{ scale: 1.02 }}
									transition={{ duration: 0.3 }}
									className="w-full md:w-3/5 relative group"
								>
									{/* Glow */}
									<div className="absolute -inset-1 bg-gradient-to-br from-orange-500/30 via-orange-400/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

									{/* Browser chrome */}
									<div className="relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl shadow-black/60">
										<div className="flex items-center gap-2 px-4 py-3 bg-zinc-800/80 border-b border-white/5">
											<span className="w-3 h-3 rounded-full bg-red-500/70" />
											<span className="w-3 h-3 rounded-full bg-yellow-500/70" />
											<span className="w-3 h-3 rounded-full bg-green-500/70" />
											<span className="ml-3 text-xs text-gray-500 font-mono truncate">{project.url}</span>
										</div>
										<div className="relative w-full h-[400px]">
											<iframe
												src={project.url}
												title={project.title}
												className="w-full h-full border-0 pointer-events-none"
												loading="lazy"
												sandbox="allow-scripts allow-same-origin"
											/>
											{/* subtle overlay so iframe doesn't intercept hover */}
											<div className="absolute inset-0 pointer-events-none" />
										</div>
									</div>
								</motion.div>

								{/* Text content */}
								<motion.div
									initial={{ opacity: 0, x: isEven ? 30 : -30 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, delay: 0.2 }}
									className="w-full md:w-2/5 flex flex-col gap-5"
								>
									<span className="inline-block w-fit text-xs font-bold tracking-widest uppercase bg-orange-500/10 border border-orange-500/25 text-orange-400 px-3 py-1 rounded-full">
										{project.tag}
									</span>
									<h3 className="text-3xl md:text-4xl font-bold text-white leading-snug">
										{project.title}
									</h3>
									<p className="text-gray-400 text-sm leading-relaxed">
										{project.description}
									</p>

									{/* Divider */}
									<div className="w-12 h-0.5 bg-orange-500/50 rounded-full" />

									<a
									href={project.url}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 w-fit bg-orange-500 hover:bg-orange-400 text-black font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
									>
									View Live Site <ExternalLink size={15} />
								</a>
							</motion.div>
							</motion.div>
				)
					})}
		</div>

				{/* Bottom CTA */ }
	<motion.div
		initial={{ opacity: 0, y: 30 }}
		whileInView={{ opacity: 1, y: 0 }}
		viewport={{ once: true }}
		transition={{ duration: 0.6 }}
		className="mt-28 text-center"
	>
		<p className="text-gray-400 mb-5 text-sm">Ready to build yours?</p>
		<button
			className="btn"
			onClick={() => navigate('/generated')}
		>
			Generate My Website →
		</button>
	</motion.div>
			</section >

	{/* Login Modal */ }
{ openLogin && <LoginModel open={openLogin} onClose={() => setOpenLogin(false)} /> }
		</div >
	)
}

export default Home
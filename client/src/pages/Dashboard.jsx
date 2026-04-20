import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Coins, Edit,  Plus, Rocket,  Share2 , Copy, MoveLeft} from 'lucide-react'
import axios from 'axios'
import { SERVER_URL } from '../App'
import { toast } from 'react-toastify'

const Dashboard = () => {
	const { userData } = useSelector((state) => state.user)
	const navigate = useNavigate()

	const [websites, setWebsites] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [copiedId, setCopiedId] = useState(null)

	useEffect(() => {
		const handleGetAllWebsites = async () => {
			setLoading(true)
			try {
				const result = await axios.get(`${SERVER_URL}/api/website/all`, {

					withCredentials: true
				})
				setWebsites(result.data?.websites || result.data?.data || [])
			} catch (e) {
				console.log("error:", e)
				setError(e?.response?.data?.message || "Something went wrong")
			} finally {
				setLoading(false)
			}
		}

		handleGetAllWebsites()
	}, [])

	const handleDeploy = async (id) => {
		const toastId = toast.loading("Deploying your website...")
		try {
			const result = await axios.get(`${SERVER_URL}/api/website/deploy/${id}`, { withCredentials: true })
			window.open(`${result.data.url}`, "_blank")
			setWebsites(p => {
				return p.map((w)=>{
					return w._id === id ? {...w, deployed: true, deployUrl: result.data.url } : w
				})
			})
			toast.update(toastId, { render: "Website deployed successfully!", type: "success", isLoading: false, autoClose: 3000 })
		} catch (e) {
			toast.update(toastId, { render: "Deployment failed", type: "error", isLoading: false, autoClose: 3000 })
			console.log("error in handledeploy", e);
		}
	}
	const handleShare = async (url)=>{
		window.open(`${url}`, "_blank")
	}
	const handleCopiedId = async(site) =>{
		await navigator.clipboard.writeText(site.deployUrl)
		setCopiedId(site._id)
		toast.success("Link copied to clipboard!")
		setTimeout(()=> setCopiedId(null), 2000)
	}

	return (
		<div className='min-h-screen bg-black text-white'>

			{/* HEADER */}
			<div className='fixed top-0 w-full backdrop-blur-lg bg-black/40 border-b border-white/10 z-50'>
				<div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
					<div className='flex items-center gap-2'>
					<button onClick={() => navigate('/')} className='btn-icon'>
							<MoveLeft />
						</button>
					<h1 className='text-xl font-bold tracking-wide text-orange-400'>
						WebBuilder.ai
					</h1>
					</div>

					<div className='flex items-center gap-5'>
						<div className='flex items-center gap-2 btn px-3 py-1 rounded-full'>
							<Coins size={16} />
							<span>{userData?.credits}</span>
						</div>

						<img
							src={
								userData?.avatar ||
								`https://ui-avatars.com/api/?name=${userData?.name}`
							}
							alt="avatar"
							className="w-10 h-10 rounded-full ring-2 ring-orange-400 hover:scale-110 transition"
						/>
					</div>

				</div>
			</div>

			{/* CONTENT */}
			<div className='pt-28 max-w-7xl mx-auto px-6'>

				{/* Welcome */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='mb-10'
				>
					<p className='text-lg'>Welcome back</p>
					<h1 className='text-3xl font-bold pro'>
						{userData?.name}
					</h1>
				</motion.div>

				{/* Create Button */}
				<div className='mb-8'>
					<button
						onClick={() => navigate('/create')}
						className='flex items-center gap-2 btn  transition'
					>
						<Plus size={18} />
						Create New Website
					</button>
				</div>

				{/* STATES */}
				{loading && (
					<div className='text-center text-gray-400'>
						Loading your websites...
					</div>
				)}

				{error && !loading && (
					<div className='text-white text-center'>
						{error}
					</div>
				)}

				{/* EMPTY */}
				{websites.length === 0 && (
					<div className='text-center text-gray-500 mt-20'>
						No websites found 😢 <br />
						Create your first one!
					</div>
				)}

				{/* WEBSITE GRID */}
				<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8'>
					{!loading && !error && (websites) && websites.length > 0 && websites.map((site, i) => (
						<motion.div
							key={site._id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.1 }}
							whileHover={{ y: -6 }}
							className='cursor-pointer bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300'
						>
							{/* Preview */}
							<div className='relative w-full h-40 bg-zinc-900 overflow-hidden'>
								<iframe
									srcDoc={site.latestCode}
									className='absolute top-0 left-0 w-[138%] h-[138%] scale-[0.72] origin-top-left pointer-events-none'
									sandbox='allow-scripts'
								/>
								<div className='absolute inset-0 bg-transparent' />
							</div>

							{/* Info */}
							<div className='p-5'>
								<h2 className='text-lg font-semibold mb-1 truncate'>
									{site.title || "Untitled"}
								</h2>


								<div className='mt-4 flex items-center justify-between '>
									<span>{new Date(site.createdAt).toLocaleDateString()}</span>
									<div className='flex gap-2 items-center'>
										<button className='btn flex gap-2 items-center ' onClick={() => navigate(`/editor/${site._id}`)}>
											<Edit size={16} />
											<span>Edit</span>
										</button>

									</div>
								</div>
								<div className='mt-4 flex items-center justify-between '>
									{
										!site.deployed ?
											<button className='btn w-full flex gap-2 items-center justify-center' onClick={() => handleDeploy(site._id)}>
												<Rocket  size={16} />
												<span>Delpoy</span>

											</button> :
											<div className='flex justify-center items-center w-full gap-4'>
											<motion.button whileTap={{scale: 0.95}} className='btn-icon p-3' onClick={()=> handleCopiedId(site)}>
												<Copy size={18}/>
											</motion.button>
											<button className='btn w-full flex gap-2 items-center justify-center' onClick={()=> handleShare(site.deployUrl)}>
												<Share2  size={16} />
												<span>Share</span>
											</button>
											</div>
									}
								</div>

							</div>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Dashboard

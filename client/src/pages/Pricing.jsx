import { ArrowLeft, Check } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { SERVER_URL } from '../App';

const Pricing = () => {

	const plans = [
		{
			key: 'free',
			name: 'Free',
			price: '₹0',
			credits: 100,
			description: 'Perfect to explore Web Builder AI',
			features: [
				"AI website generation",
				"Responsive design",
				"Basic templates",
				"Custom Domain",
			],
			popular: false,
			button: 'Get Started'
		},
		{
			key: 'pro',
			name: 'Pro',
			price: '₹199',
			credits: 400,
			description: 'Best for creators and students',
			features: [
				"Everything in Free",
				"Advanced AI generation",
				"Faster build speed",
				"Priority support"
			],
			popular: true,
			button: 'Upgrade to Pro'
		},
		{
			key: 'premium',
			name: 'Premium',
			price: '₹499',
			credits: 1200,
			description: 'For professionals & businesses',
			features: [
				"Everything in Pro",
				"Highest performance",
				"24/7 support",
				"Unlimited Use",
			],
			popular: false,
			button: 'Go Premium'
		}
	];

	const { userData } = useSelector(state => state.user);
	const [loading, setLoading] = useState(null); 
	const navigate = useNavigate();

	const handleBuy = async (planKey) => {

		if (loading) return;

		if (!userData) {
			navigate('/');
			return;
		}
		if (planKey === 'free') {
			navigate('/dashboard');
			return;
		}

		setLoading(planKey);

		try {
			const result = await axios.post(
				`${SERVER_URL}/api/billing`,
				{ planType: planKey },
				{ withCredentials: true }
			);

			window.location.href = result.data.sessionUrl;

		} catch (e) {
			console.log('error in handleBuy', e);
			alert("Payment failed. Try again.");
		} finally {
			setLoading(null);
		}
	};

	return (
		<div className='relative min-h-screen bg-black text-white px-6 py-16 overflow-hidden'>

			<div className='absolute inset-0 pointer-events-none'>
				<div className='absolute -top-40 -left-40 w-[400px] h-[400px] bg-yellow-600 rounded-full blur-[140px] opacity-30'></div>
				<div className='absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-yellow-800 rounded-full blur-[140px] opacity-30'></div>
			</div>

			<button
				className='relative z-10 gap-2 flex items-center btn'
				onClick={() => navigate("/")}
			>
				<ArrowLeft size={18} />
				Back
			</button>
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className='text-center max-w-2xl mx-auto mb-16'
			>
				<h1 className='text-4xl md:text-5xl font-bold'>
					Get more out of <span className='pro'>Website Builder AI</span>
				</h1>
				<p className='text-gray-400 mt-4'>
					Unlock your creative potential with powerful AI tools
				</p>
			</motion.div>

			<div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10'>
				{plans.map((p, i) => (
					<motion.div
						key={p.key}
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: i * 0.2 }}
						className={`relative rounded-2xl p-6 border backdrop-blur-xl transition-all
							${p.popular
								? 'border-orange-400 bg-white/5 scale-105 shadow-[0_0_40px_rgba(255,165,0,0.25)]'
								: 'border-white/10 bg-white/5'
							}`}
					>


						{p.popular && (
							<div className='absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-400 text-xs px-3 py-1 rounded-full'>
								Most Popular
							</div>
						)}

						<h2 className='text-2xl font-semibold mb-2'>{p.name}</h2>
						<p className='text-gray-400 text-sm mb-4'>{p.description}</p>

						<div className='mb-4'>
							<span className='text-4xl font-bold pro'>{p.price}</span>
							<span className='text-gray-400 text-sm'> /month</span>
						</div>

						<p className='text-sm mb-6'>
							{p.credits} credits included
						</p>

						<ul className='space-y-3 mb-6'>
							{p.features.map((f, idx) => (
								<li key={idx} className='flex items-center gap-2 text-sm text-gray-300'>
									<Check size={16} className='text-green-400' />
									{f}
								</li>
							))}
						</ul>

						<button
							onClick={() => handleBuy(p.key)}
							disabled={loading === p.key}
							className={`w-full py-2 rounded-lg font-medium transition
								${p.popular
									? 'bg-orange-400 hover:bg-orange-600'
									: 'bg-white/10 hover:bg-white/20'
								}`}
						>
							{
								loading === p.key
									? 'Redirecting...'
									: p.button
							}
						</button>
					</motion.div>
				))}
			</div>
		</div>
	);
};

export default Pricing;
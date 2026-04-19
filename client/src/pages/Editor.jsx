import axios from 'axios';
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SERVER_URL } from '../App';
import { Code2, LoaderIcon, Monitor, Rocket, SendHorizonal, AlertCircle, X, MoveLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Editor from "@monaco-editor/react";

const thinkingSteps = [
	"Understanding your request...",
	"Analyzing the current code...",
	"Planning the changes...",
	"Implementing the updates...",
	"Testing the new code...",
	"Finalizing the response..."
];

function Header({ website }) {
	const navigate = useNavigate()
	return (
		<header className='h-14 flex items-center border-b border-zinc-700 gap-2'>
			<button onClick={() => navigate('/dashboard')} className='btn-icon'>
				<MoveLeft />
			</button>
			<div className='text-xl font-semibold truncate pr-4' onClick={()=> navigate('/dashboard')}>
				{website.title.toUpperCase()}
			</div>
		</header>
	);
}

const WebsiteEditor = () => {
	const [website, setWebsite] = useState(null);
	const [fetchError, setFetchError] = useState('');
	const [updateError, setUpdateError] = useState('');
	const [loading, setLoading] = useState(true);
	const iframeRef = useRef(null);
	const { id } = useParams();
	const [code, setCode] = useState('');
	const [messages, setMessages] = useState([]);
	const [prompt, setPrompt] = useState('');
	const [processing, setProcessing] = useState(false);
	const [processIndex, setProcessIndex] = useState(0);
	const [showCode, setShowCode] = useState(false);
	const [showFullPreview, setShowFullPreview] = useState(false);

	// Auto-scroll refs
	const messagesEndRef = useRef(null);
	const messagesContainerRef = useRef(null);
	const textareaRef = useRef(null);

	// Scroll to bottom whenever messages change or processing state changes
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, processing]);

	// Fetch website on mount
	useEffect(() => {
		const handleGetWebsite = async () => {
			setLoading(true);
			try {
				const res = await axios.get(`${SERVER_URL}/api/website/get-by-id/${id}`, {
					withCredentials: true
				});
				setWebsite(res.data.website);
				setCode(res.data.website.latestCode);
				setMessages(res.data.website.conversation || []);
			} catch (e) {
				console.error("Error fetching website:", e);
				setFetchError(e?.response?.data?.message || "Failed to load the website. Please try again.");
			} finally {
				setLoading(false);
			}
		};
		handleGetWebsite();
	}, [id]);

	// Update iframe whenever code changes
	useEffect(() => {
		if (!iframeRef.current || !code) return;

		const blob = new Blob([code], { type: "text/html" });
		const url = URL.createObjectURL(blob);
		iframeRef.current.src = url;

		return () => URL.revokeObjectURL(url);
	}, [code]);

	// Cycle thinking steps while processing
	useEffect(() => {
		if (!processing) {
			setProcessIndex(0);
			return;
		}
		const interval = setInterval(() => {
			setProcessIndex(prev => (prev + 1) % thinkingSteps.length);
		}, 4000);
		return () => clearInterval(interval);
	}, [processing]);

	// Auto-resize textarea as user types
	useEffect(() => {
		const ta = textareaRef.current;
		if (!ta) return;
		ta.style.height = 'auto';
		ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
	}, [prompt]);

	const handleUpdate = useCallback(async () => {
		const trimmed = prompt.trim();
		if (!trimmed || processing) return;

		// Optimistically append user message and clear input
		setMessages(prev => [...prev, { role: "user", content: trimmed }]);
		setPrompt('');
		setUpdateError('');

		try {
			setProcessing(true);

			const res = await axios.post(
				`${SERVER_URL}/api/website/update/${id}`,
				{ prompt: trimmed },
				{ withCredentials: true }
			);

			setCode(res.data.code);
			setWebsite(prev => ({ ...prev, latestCode: res.data.code }));
			setMessages(prev => [...prev, { role: "ai", content: res.data.message }]);

		} catch (e) {
			console.error("Error in handleUpdate:", e);
			const msg = e?.response?.data?.message || "Something went wrong. Please try again.";
			setUpdateError(msg);
			// Remove the optimistically added user message on failure
			setMessages(prev => prev.slice(0, -1));
		} finally {
			setProcessing(false);
		}
	}, [prompt, processing, id]);

	const handleKeyDown = (e) => {
		// Send on Enter (without Shift)
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleUpdate();
		}
	};

	// --- Render states ---

	if (loading) {
		return (
			<div className='min-h-screen w-screen flex flex-col items-center justify-center bg-black text-white gap-3'>
				<LoaderIcon size={28} className='animate-spin text-zinc-400' />
				<span className='text-zinc-400 text-sm'>Loading your workspace...</span>
			</div>
		);
	}

	if (fetchError) {
		return (
			<div className='min-h-screen w-screen flex flex-col items-center justify-center bg-black text-white gap-3'>
				<AlertCircle size={28} className='text-red-400' />
				<span className='text-red-400 text-sm'>{fetchError}</span>
				<button
					onClick={() => window.location.reload()}
					className='mt-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors'
				>
					Retry
				</button>
			</div>
		);
	}

	return (
		<div className='min-h-screen w-screen flex bg-black text-white overflow-hidden'>

			{/* Sidebar */}
			<aside className='hidden lg:flex w-[380px] flex-col border-r border-zinc-700'>

				<Header website={website} />
				{/* Messages — scrollable container */}
				<div
					ref={messagesContainerRef}
					className='flex-1 overflow-y-auto px-2 py-4 space-y-4'
				>
					{messages.length === 0 && (
						<p className='text-center text-zinc-600 text-sm mt-8 px-4'>
							Describe what you'd like to change and the AI will update the preview.
						</p>
					)}

					{messages.map((m, i) => (
						<div key={i} className={`max-w-[85%] ${m.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
							<div className={`px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap break-words ${m.role === 'user'
								? 'bg-blue-200 text-black'
								: 'bg-zinc-900 text-zinc-200'
								}`}>
								{m.content}
							</div>
						</div>
					))}

					{processing && (
						<div className='max-w-[85%] mr-auto'>
							<div className='px-4 py-2.5 rounded-2xl text-sm bg-zinc-900 text-zinc-400 flex items-center gap-2'>
								<LoaderIcon size={14} className='animate-spin shrink-0' />
								{thinkingSteps[processIndex]}
							</div>
						</div>
					)}

					{/* Anchor element for auto-scroll */}
					<div ref={messagesEndRef} />
				</div>

				{/* Error banner */}
				{updateError && (
					<div className='mx-3 mb-2 px-3 py-2 bg-red-900/40 border border-red-700 rounded-xl text-xs text-red-300 flex items-center gap-2'>
						<AlertCircle size={13} className='shrink-0' />
						{updateError}
					</div>
				)}

				{/* Input */}
				<div className='p-3 border-t border-zinc-700'>
					<div className={`flex items-end gap-2 bg-[#1e1e1e] border rounded-2xl p-3 transition-colors ${processing ? 'border-zinc-700 opacity-70' : 'border-gray-700'
						}`}>
						<textarea
							ref={textareaRef}
							rows={1}
							placeholder="Ask anything... (Enter to send)"
							className='flex-1 p-2 bg-transparent resize-none outline-none text-sm text-white placeholder-zinc-500 max-h-40 overflow-y-auto'
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							onKeyDown={handleKeyDown}
							disabled={processing}
						/>

						<button
							className={`p-2 rounded-xl shrink-0 transition-colors ${processing || !prompt.trim()
								? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
								: 'bg-white text-black hover:bg-zinc-200'
								}`}
							onClick={handleUpdate}
							disabled={processing || !prompt.trim()}
						>
							{processing
								? <LoaderIcon size={18} className='animate-spin' />
								: <SendHorizonal size={18} />
							}
						</button>
					</div>
					<p className='text-xs text-zinc-600 mt-1.5 px-1'>Shift+Enter for new line</p>
				</div>
			</aside>

			{/* Preview */}
			<div className='flex-1 flex flex-col'>
				<div className='h-14 px-4 flex justify-between items-center border-b border-zinc-700'>
					<span className='path'>Live Preview</span>
					<div className='flex gap-2'>
						<button className='btn-icon' onClick={() => setShowCode(true)}>
							<Code2 size={18} />
						</button>
						<button className='btn-icon' onClick={() => setShowFullPreview(true)}>
							<Monitor size={18} />
						</button>
					</div>
				</div>

				<iframe
					ref={iframeRef}
					className='flex-1 w-full bg-zinc-900'
					title='Live Preview'
					sandbox='allow-scripts allow-same-origin'
				/>
			</div>

			{/* code view */}
			<AnimatePresence>
				{
					showCode && (
						<motion.div
							initial={{ x: '100%' }}
							animate={{ x: 0 }}
							exit={{ x: '100%' }}
							className='fixed inset-y-0 right-0 w-full lg:w-[45%] z-[9999] bg-zinc-900 flex flex-col'
						>
							<div className='h-14 px-4 flex items-center justify-between '>
								<span>Index.html</span>
								<button className='btn-icon' onClick={() => setShowCode(false)}>
									<X size={18} />
								</button>
							</div>
							<Editor
								height="100%"
								theme="vs-dark"
								value={website.latestCode}
								language='html'
								onChange={(v) => setCode(v)}
							/>
						</motion.div>
					)
				}
			</AnimatePresence>

			{/* full  preview */}
			<AnimatePresence>
				{
					showFullPreview && (
						<motion.div
							initial={{ x: '100%' }}
							animate={{ x: 0 }}
							exit={{ x: '100%' }}
							className='fixed inset-0 z-[9999] bg-zinc-900'
						>
							<iframe
								srcDoc={code}
								className='w-full h-full bg-zinc-900'
								title='Live Preview'
								sandbox='allow-scripts allow-same-origin'
							/>
							<button onClick={() => setShowFullPreview(false)} className='btn-icon absolute top-2 right-2 mx-4'>
								<X size={24} className='text-white ' />
							</button>
						</motion.div>
					)
				}
			</AnimatePresence>
		</div>
	);
};

export default WebsiteEditor;
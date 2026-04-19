import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SERVER_URL } from '../App'
import axios from 'axios'

const LiveSite = () => {
	const { id } = useParams()
	const [html, setHtml] = useState('')
	const [error, setError] = useState(false)

	useEffect(() => {
		console.log("page open");
		
		const handleGetWebsite = async () => {
			try {
				const res = await axios.get(`${SERVER_URL}/api/website/get-by-slug/${id}`, {
					withCredentials: true
				})
				console.log(res);
				
				setHtml(res.data.website.latestCode)
			} catch (e) {
				setError('Site not found')
				console.error("Error fetching website:", e)
			}
		}
		handleGetWebsite()
	}, [id])

	if (error) {
		return <div>{error}</div>
	}

	return (
		<div>
			<iframe
				title="Live Site"
				srcDoc={html}
				className="w-screen h-screen border-none"
				sandbox="allow-scripts"
			/>
		</div>
	)
}

export default LiveSite
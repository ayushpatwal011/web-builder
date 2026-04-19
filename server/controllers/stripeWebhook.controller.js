export const stripeWebhook = async (req, res) => {
	console.log("🚀 Webhook HIT");

	const sig = req.headers['stripe-signature'];

	let event;

	try {
		event = stripe.webhooks.constructEvent(
			req.body,
			sig,
			process.env.STRIPE_WEBHOOK_SECRET
		);
	} catch (e) {
		console.log("❌ Signature Error:", e.message);
		return res.status(400).send("Webhook Error");
	}

	console.log("✅ EVENT:", event.type);

	if (event.type === "checkout.session.completed") {
		const session = event.data.object;

		console.log("📦 SESSION:", session);
		console.log("🔥 METADATA:", session.metadata);

		const userId = session.metadata?.userId;
		const credits = Number(session.metadata?.credits);
		const plan = session.metadata?.plan;

		console.log("👉 userId:", userId);
		console.log("👉 credits:", credits);

		try {
			const user = await User.findByIdAndUpdate(
				userId,
				{ $inc: { credits }, plan },
				{ new: true }
			);

			console.log("🎉 UPDATED USER:", user);

		} catch (err) {
			console.log("❌ DB ERROR:", err);
		}
	}

	res.status(200).json({ received: true });
};
import { generateResponse } from "../config/openRouter.js";
import { extractJSON } from "../utils/extractJOSN.js";
import Website from "../models/website.model.js"
import User from "../models/user.model.js";

const masterPrompt = `
YOU ARE A PRINCIPAL FRONTEND ARCHITECT
AND A SENIOR UI/UX ENGINEER
SPECIALIZED IN RESPONSIVE DESIGN SYSTEMS.

YOU BUILD HIGH-END, REAL-WORLD, PRODUCTION-GRADE WEBSITES
USING ONLY HTML, CSS, AND JAVASCRIPT
THAT WORK PERFECTLY ON ALL SCREEN SIZES.

THE OUTPUT MUST BE CLIENT-DELIVERABLE WITHOUT ANY MODIFICATION.

❌ NO FRAMEWORKS
❌ NO LIBRARIES
❌ NO BASIC SITES
❌ NO PLACEHOLDERS
❌ NO NON-RESPONSIVE LAYOUTS

--------------------------------------------------
USER REQUIREMENT:
{USER_PROMPT}
--------------------------------------------------

GLOBAL QUALITY BAR (NON-NEGOTIABLE)
--------------------------------------------------
- Premium, modern UI (2026–2027)
- Professional typography & spacing
- Clean visual hierarchy
- Business-ready content (NO lorem ipsum)
- Smooth transitions & hover effects
- SPA-style multi-page experience
- Production-ready, readable code

--------------------------------------------------
RESPONSIVE DESIGN (ABSOLUTE REQUIREMENT)
--------------------------------------------------
THIS WEBSITE MUST BE FULLY RESPONSIVE.

YOU MUST IMPLEMENT:

✔ Mobile-first CSS approach
✔ Responsive layout for:
  - Mobile (<768px)
  - Tablet (768px–1024px)
  - Desktop (>1024px)

✔ Use:
  - CSS Grid / Flexbox
  - Relative units (%, rem, vw)
  - Media queries

✔ REQUIRED RESPONSIVE BEHAVIOR:
  - Navbar collapses / stacks on mobile
  - Sections stack vertically on mobile
  - Multi-column layouts become single-column on small screens
  - Images scale proportionally
  - Text remains readable on all devices
  - No horizontal scrolling on mobile
  - Touch-friendly buttons on mobile

IF THE WEBSITE IS NOT RESPONSIVE → RESPONSE IS INVALID.

--------------------------------------------------
IMAGES (MANDATORY & RESPONSIVE)
--------------------------------------------------
- Use high-quality images ONLY from:
  https://images.unsplash.com/
- EVERY image URL MUST include:
  ?auto=format&fit=crop&w=1200&q=80

- Images must:
  - Be responsive (max-width: 100%)
  - Resize correctly on mobile
  - Never overflow containers

--------------------------------------------------
TECHNICAL RULES (VERY IMPORTANT)
--------------------------------------------------
- Output ONE single HTML file
- Exactly ONE <style> tag
- Exactly ONE <script> tag
- NO external CSS / JS / fonts
- Use system fonts only
- iframe srcdoc compatible
- SPA-style navigation using JavaScript
- No page reloads
- No dead UI
- No broken buttons
--------------------------------------------------
SPA VISIBILITY RULE (MANDATORY)
--------------------------------------------------
- Pages MUST NOT be hidden permanently
- If .page { display: none } is used,
  then .page.active { display: block } is REQUIRED
- At least ONE page MUST be visible on initial load
- Hiding all content is INVALID


--------------------------------------------------
REQUIRED SPA PAGES
--------------------------------------------------
- Home
- About
- Services / Features
- Contact

--------------------------------------------------
FUNCTIONAL REQUIREMENTS
--------------------------------------------------
- Navigation must switch pages using JS
- Active nav state must update
- Forms must have JS validation
- Buttons must show hover + active states
- Smooth section/page transitions

--------------------------------------------------
FINAL SELF-CHECK (MANDATORY)
--------------------------------------------------
BEFORE RESPONDING, ENSURE:

1. Layout works on mobile, tablet, desktop
2. No horizontal scroll on mobile
3. All images are responsive
4. All sections adapt properly
5. Media queries are present and used
6. Navigation works on all screen sizes
7. At least ONE page is visible without user interaction

IF ANY CHECK FAILS → RESPONSE IS INVALID

--------------------------------------------------
OUTPUT FORMAT (RAW JSON ONLY)
--------------------------------------------------
{
  "message": "Short professional confirmation sentence",
  "code": "<FULL VALID HTML DOCUMENT>"
}

--------------------------------------------------
ABSOLUTE RULES
--------------------------------------------------
- RETURN RAW JSON ONLY
- NO markdown
- NO explanations
- NO extra text
- FORMAT MUST MATCH EXACTLY
- IF FORMAT IS BROKEN → RESPONSE IS INVALID
`;

export const generateWebsite = async (req, res) => {
	try {
		const { prompt } = req.body;
		if (!prompt) return res.status(400).json({ message: "Prompt is required" })
		console.log("prompt", prompt)

		const user = await User.findById(req.user._id);
		if (!user) return res.status(401).json({ message: "Unauthorized" })
		console.log("user", user)

		if (user.credits < 50) return res.status(400).json({ message: "You do not have enough credits to generate a website." })

		// get proper output from model
		const finalPrompt = masterPrompt.replace("{USER_PROMPT}", prompt);
		let raw = ''
		let parsed = null
		for (let i = 0; i < 2 && !parsed; i++) {
			raw = await generateResponse(finalPrompt);
			parsed = extractJSON(raw);
			if (!parsed) {
				raw = await generateResponse(finalPrompt + " \n\nRETURN ONLY RAW JSON.");
				parsed = extractJSON(raw);
			}
		};
		if (!parsed) {
			console.log("ai return invalid response");
			return res.status(400).json({ message: "Failed to generate website. Please try again." })
		}


		const website = await Website.create({
			user: user._id,
			title: prompt.slice(0, 50),
			latestCode: parsed.code,
			conversation: [
				{ role: "ai", content: parsed.message },
				{ role: "user", content: prompt }
			]
		})
		console.log("webiste is", website);

		user.credits -= 50;
		await user.save();

		return res.status(200).json({
			message: "Website generated successfully",
			websiteId: website._id,
			remainingCredits: user.credits
		})

	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: "Internal server error" })
	}
}


export const getWebsitesById = async (req, res) => {
	try {
		const { id } = req.params;
		const userid = req.user._id;
		const website = await Website.findById({ _id: id, user: userid });
		if (!website) return res.status(404).json({ message: "Website not found" })
		return res.status(200).json({ website })
	} catch (e) {
		console.log("error in getWebsitesById", e);
		return res.status(500).json({ message: "Internal server error" })
	}
}

export const changes = async (req, res) => {
	try {
		console.log("running")
		const { prompt } = req.body;
		if (!prompt) return res.status(400).json({ message: "Prompt is required" })
		console.log("running", prompt)

		const user = await User.findById(req.user._id);
		if (!user) return res.status(401).json({ message: "Unauthorized" })

		console.log("running", user)
		const websiteId = req.params.id;
		const website = await Website.findById({ _id: websiteId, user: user._id });
		if (!website) return res.status(404).json({ message: "Website not found" })
		console.log("running", website)


		if (user.credits < 25) return res.status(400).json({ message: "You do not have enough credits to generate a website." })

		console.log("running")
		// update code
		const updatePrompt = `
			UPDATE THIS HTML WEBSITE.
			CURRENT CODE:
			${website.latestCode}
			USER REQUEST:
			${prompt}
			RETURN RAW JSON ONLY:
			{
			"message":"Short confimation",
			"code":"<UPDATED FULL HTML CODE>"
			}`
		let raw = ''
		let parsed = null
		for (let i = 0; i < 2 && !parsed; i++) {
			raw = await generateResponse(updatePrompt);
			parsed = extractJSON(raw);
			if (!parsed) {
				raw = await generateResponse(updatePrompt + " \n\nRETURN ONLY RAW JSON.");
				parsed = extractJSON(raw);
			}
		};
		if (!parsed) {
			console.log("ai return invalid response");
			return res.status(400).json({ message: "Failed to generate website. Please try again." })
		}

		website.conversation.push({ role: "ai", content: parsed.message }, { role: "user", content: prompt });
		website.latestCode = parsed.code;
		await website.save();
		user.credits -= 25;
		await user.save();

		return res.status(200).json({ message: parsed.message, code: parsed.code, remainingCredits: user.credits })
	} catch (e) {
		console.log("error in changes", e);
		return res.status(500).json({ message: "Internal server error" })
	}
}

export const getAllWebistes = async (req, res) => {
	try {

		const websites = await Website.find({ user: req.user._id });
		return res.status(200).json({ websites });
	} catch (e) {
		console.log("error in getAllWebistes", e);
		return res.status(500).json({ message: "Internal server error" })
	}
}
export const deploy = async (req, res) => {
	try {

		const website = await Website.findOne({
			_id: req.params.id,
			user: req.user._id
		});

		if (!website) {
			return res.status(400).json({ message: 'website not found' });
		}

		// FIXED SLUG LOGIC
		if (!website.slug) {
			const cleanTitle = website.title
				.toLowerCase()
				.replace(/[^a-z0-9]/g, '')
				.slice(0, 60);

			const uniquePart = website._id.toString().slice(-5);

			website.slug = `${cleanTitle}-${uniquePart}`;
		}

		website.deployed = true;

		website.deployUrl = `${process.env.FRONTEND_URL}/site/${website.slug}`;

		await website.save();

		return res.status(200).json({ url: website.deployUrl });

	} catch (e) {
		console.log("error in deploy", e);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export const getBySlug = async (req, res) => {
	try {
		const website = await Website.findOne({ slug:req.params.slug ,user: req.user._id });
		if(!website){
			res.status(400).json({message: "website not found"})
		}
		return res.status(200).json({ website });
	} catch (e) {
		console.log("error in getBySlug", e);
		return res.status(500).json({ message: "Internal server error" })
	}
}
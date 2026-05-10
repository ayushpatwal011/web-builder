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
- Under 400 tokens
`;

export const generateWebsite = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: "Prompt is required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (user.credits < 50)
      return res.status(400).json({ message: "You do not have enough credits to generate a website." });

    const finalPrompt = masterPrompt.replace("{USER_PROMPT}", prompt);

    const attempts = [
      finalPrompt,
      finalPrompt + "\n\nCRITICAL: Return ONLY a raw JSON object. No markdown, no backticks, no explanation. Keep HTML simple and under 80 lines.",
      finalPrompt + "\n\nReturn ONLY valid JSON. Use \\n for newlines inside strings. Never use single quotes or backticks inside JSON values.",
    ];

    let parsed = null;

    for (const attemptPrompt of attempts) {
      try {
        const raw = await generateResponse(attemptPrompt);
        parsed = extractJSON(raw);
        if (parsed?.code && parsed?.message) break;
      } catch (err) {
        console.error("generateResponse failed:", err.message);
      }
    }

    if (!parsed) {
      console.log("ai return invalid response");
      return res.status(400).json({ message: "Failed to generate website. Please try again." })
    }

    const website = await Website.create({
      user: user._id,
      title: prompt.slice(0, 50),
      latestCode: parsed.code,
      conversation: [
        { role: "user", content: prompt },  
        { role: "ai", content: parsed.message },
      ],
    });

    user.credits -= 50;
    await user.save();

    return res.status(200).json({
      message: "Website generated successfully",
      websiteId: website._id,
      remainingCredits: user.credits,
    });

  } catch (e) {
    console.error("generateWebsite error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
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
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: "Prompt is required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const websiteId = req.params.id;
    const website = await Website.findOne({ _id: websiteId, user: user._id });
    if (!website) return res.status(404).json({ message: "Website not found" });

    if (user.credits < 25)
      return res.status(400).json({ message: "You do not have enough credits to make changes." });

    const updatePrompt = `
      UPDATE THIS HTML WEBSITE.
      CURRENT CODE:
      ${website.latestCode}
      USER REQUEST:
      ${prompt}
      RETURN RAW JSON ONLY:
      {
        "message": "Short confirmation message",
        "code": "<UPDATED FULL HTML CODE>"
      }`;

    const attempts = [
      updatePrompt,
      updatePrompt + "\n\nCRITICAL: Return ONLY a raw JSON object. No markdown, no backticks, no explanation.",
      updatePrompt + "\n\nReturn ONLY valid JSON. Use \\n for newlines inside strings. Never use single quotes or backticks inside JSON values.",
    ];

    let parsed = null;
    for (const attemptPrompt of attempts) {
      try {
        const raw = await generateResponse(attemptPrompt);
        console.log("Raw AI response (first 300 chars):", raw?.slice(0, 300));
        parsed = extractJSON(raw);
        if (parsed?.code && parsed?.message) break;
      } catch (err) {
        console.error("generateResponse failed:", err.message);
      }
    }

    if (!parsed) {
			console.log("ai return invalid response");
			return res.status(400).json({ message: "Failed to generate website. Please try again." })
		}

    website.latestCode = parsed.code;
    website.conversation.push(
      { role: "user", content: prompt },
      { role: "ai", content: parsed.message }
    );
    await website.save();

    user.credits -= 25;
    await user.save();

    return res.status(200).json({
      message: parsed.message,
      code: parsed.code,     
      remainingCredits: user.credits,
    });

  } catch (e) {
    console.error("changes error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

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

			const uniquePart = Date.now().toString()

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

export const deleteWebsite = async (req, res)=>{
	try{
		const { id } = req.params;
		const userid = req.user._id;
		const website = await Website.findByIdAndDelete({ _id: id, user: userid });
		if(!website){
			res.status(400).json({message: "website not found"})
		}
		return res.status(200).json({ message: "website deleted successfully" });
	}catch(e){
		console.log("error in deleteWebsite", e);
		return res.status(500).json({ message: "Internal server error" })
	}
}
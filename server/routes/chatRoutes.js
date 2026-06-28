import express from 'express';
import wrapAsync from '../wrapAsync.js';

const router = express.Router();
const AI_AGENT_SERVICE_URL = process.env.AI_AGENT_SERVICE_URL || 'http://localhost:8000';

router.post('/', wrapAsync(async (req, res) => {
    try {
        console.log(`📡 Proxying chat request to AI Agent at: ${AI_AGENT_SERVICE_URL}/chat`);
        
        const response = await fetch(`${AI_AGENT_SERVICE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });
        
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || 'Failed to communicate with AI Agent');
        }
        
        const data = await response.json();
        return res.json(data);
    } catch (err) {
        console.error("❌ Error proxying to AI Agent:", err.message);
        return res.status(500).json({
            success: false,
            message: "The backend AI Agent service is currently offline or unreachable. Please ensure it is running."
        });
    }
}));

export default router;

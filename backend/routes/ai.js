const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * POST /api/ai/chat
 * RAG-style chat: injects project context into the system prompt
 * Body: { prompt: string, context?: object (project data), history?: array }
 */
router.post('/chat', async (req, res, next) => {
  const { prompt, context, history = [] } = req.body;

  if (!prompt || prompt.trim() === '') {
    return res.status(400).json({ message: 'Prompt is required.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // --- In-Context RAG: inject project data as structured context ---
    const contextBlock = context
      ? `
## Active Project Context (RAG)
\`\`\`json
${JSON.stringify(context, null, 2)}
\`\`\`
Use the above project data to give specific, grounded answers. Reference actual numbers when relevant.
`
      : `## Context\nNo specific project selected. Answer as a general construction expert.`;

    const systemInstruction = `
You are SiteGuide AI — an expert construction engineering assistant for architects, engineers, and project managers.

Your expertise covers:
- Cost estimation & budget optimization
- Material selection and alternatives
- Construction timeline planning (CPM scheduling)
- Risk assessment and mitigation
- Building codes and regulatory compliance
- Sustainable construction practices

Guidelines:
- Be professional, structured, and concise
- Use bullet points and numbered lists when appropriate
- When referencing costs, use USD and realistic market rates
- Flag risks clearly with ⚠️ markers
- For complex topics, provide step-by-step guidance

${contextBlock}
`.trim();

    // Build multi-turn conversation history for Gemini
    const formattedHistory = history.map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.text }],
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemInstruction }] },
        { role: 'model', parts: [{ text: 'Understood. I am SiteGuide AI, ready to assist with construction planning, cost estimation, and project management. How can I help you today?' }] },
        ...formattedHistory,
      ],
    });

    const result = await chat.sendMessage(prompt);
    const text = result.response.text();

    res.json({ text, tokensUsed: result.response.usageMetadata?.totalTokenCount || null });
  } catch (error) {
    console.error('AI Chat Error:', error.message);
    next(error);
  }
});

/**
 * POST /api/ai/analyze-project
 * Generate a full AI analysis report for a specific project
 */
router.post('/analyze-project', async (req, res, next) => {
  const { project } = req.body;

  if (!project) {
    return res.status(400).json({ message: 'Project data is required.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are a **Senior Project Intelligence Analyst** at SiteGuide. Provide a high-impact, professional analysis report for the project: **"${project.name}"**.

Format the entire response using beautiful, structured Markdown. Use icons (emojis), tables, and bold highlights.

### Required Structure:

# 🏗️ Executive Analysis: ${project.name}

## 📊 1. Budget \& Financial Vitality
> [!IMPORTANT]
> Compare the estimated cost ($${project.estimatedCost?.total?.toLocaleString()}) vs the client's original budget ($${project.budget?.toLocaleString()}).

| Metric | Value | Status |
| :--- | :--- | :--- |
| **Declared Budget** | $${project.budget?.toLocaleString()} | |
| **AI Estimated Total** | $${project.estimatedCost?.total?.toLocaleString()} | |
| **Balance Impact** | $${(project.budget - (project.estimatedCost?.total || 0)).toLocaleString()} | ${project.budget < (project.estimatedCost?.total || 0) ? "❌ OVER BUDGET" : "✅ UNDER BUDGET"} |
| **Utilization Ratio** | ${((project.estimatedCost?.total / project.budget) * 100).toFixed(1)}% | |

---

## 🚩 2. Risk Matrix
*Rank the top 3 risks based on severity, likelihood, and cost impact.*

1.  **Risk Title** (Severity: 🔴 High | 🟠 Medium | 🟡 Low)
    *   **Insight:** Concise explanation.
    *   **Mitigation:** **Bold action item to fix this.**

---

## ⏱️ 3. Timeline Integrity
*Analyze if the estimated ${project.estimatedDurationDays} days is realistic.*
- ⚡ **Optimizations:** Suggest 2 ways to compress the schedule (e.g., parallelizing tasks).
- 🕒 **Bottle-necks:** Identify the phase with the most critical dependencies.

---

## 💡 4. Strategic Recommendations
*Actionable engineering advice.*
- **Material Efficiency:** Suggest specific alternatives for ${project.materialBreakdown?.[0]?.name || 'key materials'}.
- **Value Engineering:** Where can we cut 5% of costs without compromising structural safety?

---

## ⭐ Summary Score
# **Score: [X]/10**
*Brief justification for the score.*

Project Data Reference:
\`\`\`json
${JSON.stringify({ 
  name: project.name, 
  area: project.area, 
  buildingType: project.buildingType, 
  budget: project.budget, 
  estimatedCost: project.estimatedCost, 
  materialBreakdown: project.materialBreakdown 
}, null, 2)}
\`\`\`
`.trim();

    const result = await model.generateContent(prompt);
    const analysis = result.response.text();

    res.json({ analysis });
  } catch (error) {
    console.error('AI Analysis Error:', error.message);
    next(error);
  }
});

module.exports = router;

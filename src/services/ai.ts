import { GoogleGenerativeAI } from "@google/generative-ai";

// In a real app, this would come from import.meta.env.VITE_GEMINI_API_KEY
// For this demo, we'll use a placeholder or expect the user to set it.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const genAI = new GoogleGenerativeAI(API_KEY);

export const aiService = {
    async analyzeRisk(projectTitle: string, status: string, deadline: string, checklistCompleted: number, checklistTotal: number) {
        if (!API_KEY) {
            // Mock fallback if no key
            const daysLeft = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            const isHighRisk = daysLeft < 3 && status === 'todo';
            return {
                riskLevel: isHighRisk ? 'High' : 'Low',
                reason: isHighRisk ? 'Deadline is approaching and project is not started.' : 'Project is on track.'
            };
        }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `
        Analyze the risk of this project:
        Title: ${projectTitle}
        Status: ${status}
        Deadline: ${deadline}
        Progress: ${checklistCompleted}/${checklistTotal} tasks completed.
        Current Date: ${new Date().toISOString()}

        Return a JSON object with "riskLevel" (High, Medium, Low) and "reason" (short explanation).
      `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Basic parsing, in production use structured output or robust JSON parsing
            try {
                const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
                return JSON.parse(jsonStr);
            } catch (e) {
                return { riskLevel: 'Unknown', reason: 'Could not parse AI response' };
            }
        } catch (error) {
            console.error("AI Error:", error);
            return { riskLevel: 'Unknown', reason: 'AI Service unavailable' };
        }
    },

    async generateSmartReply(context: string, lastComment: string) {
        if (!API_KEY) {
            const suggestions = [
                "I've updated the checklist with the latest findings.",
                "Can you review the attached documents?",
                "I'm on track to meet the deadline."
            ];
            return suggestions[Math.floor(Math.random() * suggestions.length)];
        }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `
        Context: ${context}
        Last Comment: "${lastComment}"
        
        Generate a professional, helpful, and concise reply suggestion for a medical intern or supervisor.
        Return only the reply text.
      `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error("AI Error:", error);
            return "I'm working on it.";
        }
    }
};

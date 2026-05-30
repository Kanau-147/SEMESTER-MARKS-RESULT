/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Ensure Gemini Client is initialized lazily and cleanly
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('WARNING: GEMINI_API_KEY environment variable is not set. Academic AI counseling reports will fail.');
    }
    ai = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON request parsing body limits
  app.use(express.json());

  // API Endpoints
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', database: 'synced', timestamp: new Date().toISOString() });
  });

  // Proxy endpoint to generate high-quality teacher comments via Gemini
  app.post('/api/generate-remarks', async (req, res) => {
    const { studentName, rollNumber, gradeClass, subjects, overallPercentage, overallGrade, overallStatus, cgpa } = req.body;

    if (!studentName || !subjects) {
      return res.status(400).json({ error: 'Missing required student parameters (studentName or grade subjects).' });
    }

    try {
      const client = getGeminiClient();
      
      const subjectsText = subjects.map((sub: any) => 
        `- ${sub.name}: Score ${sub.score}/${sub.max} (Pass: ${sub.pass}, Grade: ${sub.grade}, Result: ${sub.status})`
      ).join('\n');

      const systemPrompt = `You are an veteran academic counselor and lead homeroom teacher at a prestigious academy. 
Your goal is to draft a personalized, professional progress remark (exactly 40 to 70 words) for a student's official report card. 
The comment must sound human, highly encouraging, supportive, and pedagogical. Avoid generic text. Citing student name naturally.
Analyze their marks carefully to extract:
1. Primary strength (subject they scored highest on).
2. One pedagogical opportunity or area of revision (subject with lower marks, especially if failed).
3. A specific, actionable strategic study recommendation for the upcoming semester.`;

      const promptInput = `Please write official report remarks for:
Student Name: ${studentName}
Roll ID: ${rollNumber}
Class Section: ${gradeClass}
Academic Record:
${subjectsText}

Overall Analysis:
- Cumulative Percentage: ${overallPercentage}%
- Calculated Letter Grade: ${overallGrade}
- Cumulative CGPA Metric: ${cgpa}
- Board Promotion Status: ${overallStatus}

Format Requirements: Provide only the final teacher's remarks paragraph (no greeting lines, no sign-offs, no surrounding quotes).`;

      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: promptInput,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.75,
        }
      });

      const textOutput = response.text?.trim() || '';
      
      // Clean up any outer quotes that Gemini might output
      const cleanRemarks = textOutput.replace(/^["'\u201C\u201D]+|["'\u201C\u201D]+$/g, '');

      res.json({ remarks: cleanRemarks });
    } catch (error: any) {
      console.error('Gemini Remarks Generation Error:', error);
      res.status(500).json({ 
        error: 'AI proxy failed to complete report commentary.',
        details: error.message || 'Unknown integration error and API key parameters checking.' 
      });
    }
  });

  // Dev vs Prod Vite mounting
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve client static dist bundle
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Academic platform running gracefully on http://localhost:${PORT} [ENV: ${process.env.NODE_ENV || 'dev'}]`);
  });
}

startServer();

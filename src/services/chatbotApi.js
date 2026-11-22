/**
 * Chatbot & JD Analyzer API Client Service.
 * Connects React frontend to the FastAPI backend.
 * Uses environment variable VITE_AI_API_URL (defaults to http://localhost:8001).
 * Never exposes any API keys or backend secrets.
 */

const BASE_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8001';

/**
 * Handle HTTP response and return JSON or throw descriptive error.
 */
async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = `Request failed with status ${response.status}`;
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorDetail;
    } catch {
      // response wasn't JSON
    }
    throw new Error(errorDetail);
  }
  return response.json();
}

/**
 * Check backend health status.
 */
export async function checkHealth() {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return await handleResponse(res);
  } catch (err) {
    console.warn('Backend health check failed:', err.message);
    throw new Error('Unable to connect to Arpan AI backend. Please check if the server is running.');
  }
}

/**
 * Get ChromaDB portfolio index status.
 */
export async function getPortfolioStatus() {
  const res = await fetch(`${BASE_URL}/api/v1/portfolio/status`);
  return handleResponse(res);
}

/**
 * Send a question to Arpan Bot.
 * @param {string} question - User question
 * @returns {Promise<{answer: string, grounded: boolean, sources: Array, similarity_score: number}>}
 */
export async function sendChatMessage(question) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: question.trim() }),
    });
    return await handleResponse(res);
  } catch (err) {
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      throw new Error('Cannot connect to AI Backend. The server may be starting up or offline.');
    }
    throw err;
  }
}

/**
 * Upload a Job Description file (PDF, DOCX, or TXT).
 * @param {File} file - Document file to upload
 * @returns {Promise<{session_id: string, filename: string, extracted_characters: number}>}
 */
export async function uploadJobDescription(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch(`${BASE_URL}/api/v1/jd/upload`, {
      method: 'POST',
      body: formData,
    });
    return await handleResponse(res);
  } catch (err) {
    if (err.message.includes('Failed to fetch')) {
      throw new Error('Upload failed. AI Backend is unreachable.');
    }
    throw err;
  }
}

/**
 * Analyze JD from an uploaded session or direct pasted text.
 * @param {Object} params - { sessionId?: string, jdText?: string }
 * @returns {Promise<Object>} Full JD Analysis Response
 */
export async function analyzeJobDescription({ sessionId, jdText }) {
  try {
    const payload = {};
    if (sessionId) payload.session_id = sessionId;
    if (jdText) payload.jd_text = jdText;

    const res = await fetch(`${BASE_URL}/api/v1/jd/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return await handleResponse(res);
  } catch (err) {
    if (err.message.includes('Failed to fetch')) {
      throw new Error('Analysis failed. AI Backend is unreachable.');
    }
    throw err;
  }
}

/**
 * Clean up an active JD temporary session.
 * @param {string} sessionId
 */
export async function deleteJDSession(sessionId) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/jd/${sessionId}`, {
      method: 'DELETE',
    });
    return await handleResponse(res);
  } catch (err) {
    console.warn(`Could not delete session ${sessionId}:`, err.message);
  }
}

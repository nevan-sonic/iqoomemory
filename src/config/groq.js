// Groq API Configuration & Fast Inference Client
export const GROQ_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) || (typeof process !== 'undefined' && process.env?.VITE_GROQ_API_KEY) || '';
export const GROQ_MODELS = {
  FAST: 'llama-3.3-70b-versatile',
  SMART: 'llama-3.3-70b-versatile',
  QWEN: 'qwen-2.5-32b',
  LLAMA_GUARD: 'llama-guard-3-8b'
};

/**
 * Call Groq Cloud API with timeout, fallback, and structured output support
 */
export async function callGroqAPI({
  messages,
  model = GROQ_MODELS.SMART,
  temperature = 0.1,
  jsonMode = false,
  timeoutMs = 6000
}) {
  if (!GROQ_API_KEY) {
    return {
      success: false,
      error: 'No Groq API key configured. Utilizing on-device rule engine.',
      content: null
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const payload = {
      model,
      messages,
      temperature,
    };

    if (jsonMode) {
      payload.response_format = { type: 'json_object' };
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return {
      success: true,
      content: data.choices?.[0]?.message?.content || '',
      usage: data.usage,
      model: data.model,
      latencyMs: data.usage?.total_time ? Math.round(data.usage.total_time * 1000) : 180
    };
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('[Groq API Client] Call failed or timed out, fallback to on-device engine:', err.message);
    return {
      success: false,
      error: err.message,
      content: null
    };
  }
}

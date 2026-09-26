const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const generateIncidentSummary = async (incidentData) => {
  try {
    const prompt = `You are a safety assistant. Given this SOS incident:
Location: ${incidentData.address || `${incidentData.lat}, ${incidentData.lng}`}
Time: ${incidentData.timestamp}

Generate a JSON response ONLY (no extra text, no markdown, no explanation) in this exact format:
{"severity": "low", "summary": "2-line summary for emergency responders"}`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b' ,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    });

    const data = await response.json();

    console.log('--- Groq Raw Response ---');
    console.log(JSON.stringify(data, null, 2));
    console.log('-------------------------');

    if (data.error) {
      console.error('Groq returned an error:', data.error.message);
      return {
        severity: 'medium',
        summary: 'Unable to generate AI summary. Manual review required.',
      };
    }

    const rawText = data.choices[0].message.content;
    const cleanText = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanText);

    return parsed;
  } catch (error) {
    console.error('Groq API error:', error.message);
    return {
      severity: 'medium',
      summary: 'Unable to generate AI summary. Manual review required.',
    };
  }
};
const getLegalChatResponse = async (userMessage, chatHistory = []) => {
  try {
    const systemPrompt = `You are a helpful legal assistant specializing in women's safety and rights in India. 
Provide clear, empathetic guidance on topics like harassment, workplace rights, domestic violence, and legal recourse. 
Keep responses concise (3-5 sentences), cite relevant Indian laws (IPC/BNS sections) where applicable, and suggest actionable next steps. 
Always recommend consulting a lawyer or NGO for serious matters. Do not give definitive legal verdicts.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage },
    ];

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
  model: 'openai/gpt-oss-120b',
  messages,
  temperature: 0.5,
}),
    });

    const data = await response.json();

    if (data.error) {
      console.error('Groq legal chat error:', data.error.message);
      return "Sorry, I'm unable to respond right now. Please try again or contact a local NGO/helpline for immediate assistance.";
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Legal chat error:', error.message);
    return "Sorry, I'm unable to respond right now. Please try again or contact a local NGO/helpline for immediate assistance.";
  }
};

module.exports = { generateIncidentSummary, getLegalChatResponse };
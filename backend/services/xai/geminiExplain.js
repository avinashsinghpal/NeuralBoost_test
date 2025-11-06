async function callGemini(prompt, apiKey) {
  // Minimal REST call to Gemini-compatible endpoint; fallback to mock when no key
  if (!apiKey) return null;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = { contents: [{ parts: [{ text: prompt }] }] };
  const res = await (await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })).json();
  try {
    const text = res.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || null;
  } catch { return null; }
}

function formatPrompt({ breakdown, threatScore, riskCategory, scenario }) {
  return [
    'You are a cybersecurity explanation system for end users.\n',
    'Explain clearly and succinctly why this message was flagged, focusing on practical indicators.\n',
    'Do not include numeric scores.\n',
    'Highlight:\n- URL red flags\n- Sender/domain issues\n- Urgency/emotion cues\n- Attachment risks\n',
    'Output 4–6 concise bullet points with actionable advice.\n\n',
    scenario ? `Scenario: ${scenario}\n\n` : '',
    'Input JSON:\n',
    JSON.stringify({ breakdown, threatScore, riskCategory }, null, 2)
  ].join('');
}

async function geminiExplain({ breakdown, threatScore, riskCategory, scenario }) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || '';
  const prompt = formatPrompt({ breakdown, threatScore, riskCategory, scenario });
  let text = null;
  try { text = await callGemini(prompt, apiKey); } catch { /* ignore */ }
  if (text) return text;
  // Fallback local explanation
  const bullets = [];
  if ((breakdown.url.flags || []).length) bullets.push(`URLs: ${breakdown.url.flags.join(', ')}`);
  if ((breakdown.sender.flags || []).length) bullets.push(`Sender: ${breakdown.sender.flags.join(', ')}`);
  if ((breakdown.nlp.flags || []).length) bullets.push(`Content cues: ${breakdown.nlp.flags.join(', ')}`);
  if ((breakdown.attachment.flags || []).length) bullets.push(`Attachments: ${breakdown.attachment.flags.join(', ')}`);
  if ((breakdown.punycode.flags || []).length) bullets.push(`Punycode/Homograph: ${breakdown.punycode.flags.join(', ')}`);
  bullets.push(`Overall risk category: ${riskCategory} (score ${threatScore})`);
  return bullets.map(b => `- ${b}`).join('\n');
}

module.exports = { geminiExplain };



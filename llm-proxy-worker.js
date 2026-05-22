const DEFAULT_SYSTEM_PROMPT = [
  "你是一个音频算法学习助手。",
  "回答要优先围绕 DSP、AEC、降噪、阵列、波束形成、深度语音增强和工程化落地。",
  "给学习者解释时先讲直觉，再给关键公式、实验建议和排障思路。",
  "如果问题超出上下文，请明确说明不确定点。"
].join("\n");

export default {
  async fetch(request, env) {
    const origin = getAllowedOrigin(request, env);
    if (!origin) {
      return json({ error: "Origin is not allowed." }, 403, "*");
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return json({ error: "Use POST." }, 405, origin);
    }

    if (!env.LLM_API_URL || !env.LLM_API_KEY || !env.LLM_MODEL) {
      return json({ error: "Missing LLM_API_URL, LLM_API_KEY, or LLM_MODEL." }, 500, origin);
    }

    const body = await request.json();
    const question = String(body.question || "").trim();
    if (!question) {
      return json({ error: "Question is required." }, 400, origin);
    }

    const context = JSON.stringify(body.context || {}, null, 2);
    const history = normalizeMessages(body.messages || [], question);
    const upstreamBody = {
      model: env.LLM_MODEL,
      temperature: Number(env.LLM_TEMPERATURE || 0.3),
      messages: [
        { role: "system", content: DEFAULT_SYSTEM_PROMPT },
        { role: "system", content: `学习网页上下文：\n${context}` },
        ...history,
        { role: "user", content: question }
      ]
    };

    const upstream = await fetch(env.LLM_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.LLM_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(upstreamBody)
    });

    const payload = await upstream.json();
    if (!upstream.ok) {
      return json({ error: "Model provider error.", detail: payload }, upstream.status, origin);
    }

    const answer = payload.choices?.[0]?.message?.content ||
      payload.output_text ||
      payload.answer ||
      "";
    return json({ answer }, 200, origin);
  }
};

function normalizeMessages(messages, latestQuestion) {
  return messages
    .filter((message) => ["user", "assistant"].includes(message.role) && message.content)
    .filter((message, index, list) => !(index === list.length - 1 && message.role === "user" && message.content === latestQuestion))
    .slice(-8)
    .map((message) => ({
      role: message.role,
      content: String(message.content).slice(0, 4000)
    }));
}

function getAllowedOrigin(request, env) {
  const requestOrigin = request.headers.get("Origin") || "*";
  const allowedOrigin = env.ALLOWED_ORIGIN || requestOrigin;
  return allowedOrigin === "*" || allowedOrigin === requestOrigin ? allowedOrigin : "";
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin"
  };
}

function json(payload, status, origin) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(origin)
    }
  });
}

import { NextResponse } from "next/server";
import { GUIDE_TIPS, GuideCategory } from "@/lib/guide";

type RequestBody = {
  days: number;
  style: string;
  interests: string[];
  budget: string;
  firstTime: string;
};

function buildEndpoint(baseUrl: string) {
  const trimmed = baseUrl.replace(/\/$/, "");
  if (trimmed.endsWith("/v1/chat/completions")) return trimmed;
  if (trimmed.endsWith("/v1")) return `${trimmed}/chat/completions`;
  return `${trimmed}/v1/chat/completions`;
}

function extractJson(content: string) {
  const trimmed = content.trim();
  if (!trimmed) return null;
  let raw = trimmed;
  if (raw.startsWith("```")) {
    raw = raw.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "").trim();
  }
  const first = raw.indexOf("{");
  const last = raw.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) return null;
  return raw.slice(first, last + 1);
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Missing OPENAI_API_KEY. Please create a .env.local file with your key.",
      },
      { status: 500 }
    );
  }

  try {
    const body = (await request.json()) as RequestBody;
    const { days, style, interests, budget, firstTime } = body;

    const prompt = `Generate a structured JSON travel plan for a trip to China using this schema:
{
  "summary": "1–2 sentence overview",
  "chapters": [
    { "title": "Trip Overview", "content": "..." },
    { "title": "Day-by-day Itinerary", "content": "Day 1...\\nDay 2..." },
    { "title": "Must-book List", "content": "..." },
    { "title": "Transportation", "content": "..." },
    { "title": "Payments & Essential Apps", "content": "..." },
    { "title": "Safety & Cultural Tips", "content": "..." }
  ]
}
Requirements:
- Output must be valid JSON only. No markdown.
- Language: English.
- Style: like a professional travel advisor—warm, practical, clear, and detailed.
- Days should match ${days} days with day-by-day itinerary blocks.
- The day-by-day content must use this exact plain-text format for EACH day block, separated by a blank line:
  Day X – City name
  Weather: short realistic descriptor (e.g., Mild, around 20°C)
  Morning: ...
  Afternoon: ...
  Evening: ...
  Food: ...
  Transport: ...
  Local tip: ...
  Image query: short English keywords for a photo search (city + landmark + vibe)
- Include city names and realistic pacing.
- Incorporate style "${style}", interests ${JSON.stringify(
      interests
    )}, budget "${budget}", first-time visitor: "${firstTime}".`;

    const baseUrl = process.env.JENIYA_BASE_URL || "https://jeniya.top";
    const model = process.env.JENIYA_MODEL || "gpt-3.5-turbo";
    const endpoint = buildEndpoint(baseUrl);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful travel planner. Return only valid JSON in the exact schema requested.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error("OpenAI proxy error:", response.status, errorText);
      return NextResponse.json(
        { error: "OpenAI request failed" },
        { status: 500 }
      );
    }

    const raw = await response.text();
    let data: any = null;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.error("OpenAI proxy JSON parse error:", raw);
      return NextResponse.json(
        { error: "OpenAI request failed" },
        { status: 500 }
      );
    }

    if (data?.summary && Array.isArray(data?.chapters)) {
      return NextResponse.json(data);
    }

    const content = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text;
    if (!content) {
      console.error("OpenAI proxy missing content:", data);
      return NextResponse.json(
        { error: "OpenAI request failed" },
        { status: 500 }
      );
    }

    const extracted = extractJson(content);
    if (!extracted) {
      console.error("OpenAI proxy response not JSON:", content);
      return NextResponse.json(
        { error: "OpenAI request failed" },
        { status: 500 }
      );
    }

    let parsed: any;
    try {
      parsed = JSON.parse(extracted);
    } catch (err) {
      console.error("OpenAI proxy JSON parse error:", extracted);
      return NextResponse.json(
        { error: "OpenAI request failed" },
        { status: 500 }
      );
    }

    const selected = selectGuideTips({
      days,
      interests,
      budget,
      firstTime,
    });

    return NextResponse.json({
      ...parsed,
      guideTips: selected,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "OpenAI request failed" },
      { status: 500 }
    );
  }
}

function selectGuideTips(input: {
  days: number;
  interests: string[];
  budget: string;
  firstTime: string;
}) {
  const topics: GuideCategory[] = ["payments", "internet", "transport"];
  const budgetLower = input.budget.toLowerCase();
  const isFirstTime = input.firstTime.toLowerCase() === "yes";

  if (budgetLower === "budget" || budgetLower === "low" || isFirstTime) {
    topics.push("safety");
  }

  const unique = Array.from(new Set(topics));
  const result: Record<GuideCategory, { title: string; bullets: string[] }> = {} as Record<
    GuideCategory,
    { title: string; bullets: string[] }
  >;

  unique.forEach((key) => {
    const tip = GUIDE_TIPS[key];
    result[key] = {
      title: tip.title,
      bullets: tip.bullets,
    };
  });

  return result;
}

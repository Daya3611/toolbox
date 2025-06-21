import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || text.trim() === "") {
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.COHERE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Cohere API key not found" },
        { status: 500 }
      );
    }

    const normalized = text.toLowerCase();

    const nameQuestions = [
      "your name",
      "what is your name",
      "who are you",
      "may i know your name",
      "tell me your name",
    ];

    const devQuestions = [
      "who created you",
      "who is your developer",
      "who made you",
      "your creator",
      "developer name",
    ];

    const asgarQnA = ["who is asgar"];

    const isNameQuestion = nameQuestions.some((q) => normalized.includes(q));
    const isDevQuestion = devQuestions.some((q) => normalized.includes(q));
    const isAsgarQnA = asgarQnA.some((q) => normalized.includes(q));

    if (isNameQuestion) {
      return NextResponse.json({ reply: "My name is Champak. Chappal walla" });
    }

    if (isAsgarQnA) {
      return NextResponse.json({
        reply: `As soon as you said "Asgar"... sab log bole: "Fassss... Fassss...🐍🐍"

Asgar toh vo banda hai jo SAP padhte padhte 🐍 ban gaya...  
Boss ke samne sirf "Yes Sir, Done Sir, Error nahi Sir" 😒  
Peeche se: "O bhai, ye SAP mujhe sabse bada saap lagta hai!"

Asgar ka code dekh ke even Python bhi bolta: "bhai tu rehne de..." 😂
  
Leh Asgar, tere liye ek hi line:  
"Tu insan kam, snake zyada lagta hai bhai!" 🐍🤣
    `,
      });
    }

    if (isDevQuestion) {
      return NextResponse.json({
        reply: "I was created by The OG Boss Dayanand Gawade. 👑",
      });
    }

    const cohereResponse = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command-r", // or "command-r-plus"
        message: text,
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const result = await cohereResponse.json();

    if (!cohereResponse.ok) {
      console.error("Cohere API error:", result);
      return NextResponse.json(
        {
          error: "Failed to connect to Cohere API",
          details: result,
          reply: "Sorry, I'm having trouble connecting to the AI service.",
        },
        { status: 200 }
      );
    }

    const reply = result.text || "I'm sorry, I couldn't generate a reply.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error.message,
        reply: "Something went wrong while processing your request.",
      },
      { status: 200 }
    );
  }
}

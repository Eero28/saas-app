import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
});

export const POST = async (req: Request) => {
  try {
    const { question, content } = await req.json();

    const chat = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that answers questions about the provided PDF content. Mostly for the job applications",
        },
        {
          role: "user",
          content: `Here is the content of the PDF:\n\n${content}\n\nQuestion: ${question}`,
        },
      ],
      temperature: 0.2,
    });

    return NextResponse.json({ answer: chat.choices[0].message.content });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to query OpenAI" },
      { status: 500 }
    );
  }
};

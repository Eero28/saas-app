import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export const POST = async (req: Request) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { text } = await pdfParse(buffer);
    const lines = text.split("\n").filter((line) => line.trim());

    return NextResponse.json({ lines });
  } catch (err) {
    console.error("PDF error:", err);
    return NextResponse.json({ error: "Failed to read PDF" }, { status: 500 });
  }
};

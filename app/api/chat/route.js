import { NextResponse } from "next/server";
import OpenAI from "openai";
import createLangChain from "../../../lib/langchain"

const systemPrompt = "Welcome to the official website of North Carolina State University (NC State), a leading public land-grant research university located in Raleigh, North Carolina. Here, you can find information about our academic programs, research initiatives, campus life, admissions, and much more. Whether you are a prospective student, current student, faculty member, or visitor, we aim to provide you with all the resources and information you need to succeed and stay connected with the NC State community. Explore our site to learn more about our commitment to education, innovation, and community engagement."

export async function POST(req) {
//   const openai = new OpenAI();
  const requestMessage = await req.json();
  console.log(requestMessage)
  const response = await createLangChain(requestMessage)
//   const completion = await openai.chat.completions.create({
//     messages: [
//       { role: "system", content: systemPrompt },
//       ...requestMessage,
//     ],
//     model: "gpt-4o-mini",
//     apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
//   });

//   const response = completion.choices[0].message.content;

  return NextResponse.json({ message: response }, { status: 200 });
}

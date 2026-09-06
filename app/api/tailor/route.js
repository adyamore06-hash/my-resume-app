import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { resume, jobDescription } = await req.json();

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: "You are an expert executive resume writer and ATS optimization specialist. Rewrite the input resume to match the key skills and keywords in the target job description. Output clear markdown text."
    });

    const prompt = `
=== TARGET JOB DESCRIPTION ===
${jobDescription}

=== ORIGINAL RESUME ===
${resume}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return new Response(JSON.stringify({ tailoredResume: text }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to generate resume." }), { status: 500 });
  }
}

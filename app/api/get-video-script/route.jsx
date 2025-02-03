import { chatSession } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { prompt } = await req.json();
        console.log(prompt);

        const result = await chatSession.sendMessage(prompt);
        
        // Ensure the response is correctly handled
        const resultText = result.response.text();
        console.log(resultText);

        return NextResponse.json({ "result": JSON.parse(resultText) });
    } catch (e) {
        console.error("API Error:", e);
        return NextResponse.json({ "Error": e.message || "Unknown error" }, { status: 500 });
    }
}

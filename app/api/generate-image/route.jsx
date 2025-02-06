import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "@/configs/FirebaseConfig";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
    });

    // Extract single image URL
    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: 500 }
      );
    }
    // Save to Firebase
    const base64Image =
      "data:image/png;base64," + (await ConvertImage(imageUrl));
    const fileName = "Shorts-AI/" + Date.now() + ".png";
    const storageRef = ref(storage, fileName);

    await uploadString(storageRef, base64Image, "data_url");
    const downloadUrl = await getDownloadURL(storageRef);
    console.log(downloadUrl);

    return NextResponse.json({ downloadUrl });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}

const ConvertImage = async (imageUrl) => {
  try {
    const resp = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const base64Image = Buffer.from(resp.data).toString("base64");
    return base64Image;
  } catch (e) {
    console.log("Error:", e);
  }
};

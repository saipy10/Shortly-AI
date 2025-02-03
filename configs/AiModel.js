import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Write a script to generate 30 seconds video on topic: Interesting historical story along with AI image prompt in Realistic format for each scene and give me result in JSON format with imagePrompt and ContentText as field",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "video_scenes": [\n    {\n      "scene_number": 1,\n       "duration": 5,\n      "imagePrompt": "A bustling ancient Roman marketplace, overflowing with people in togas, merchants selling pottery, food stalls with colorful fruits and vegetables, and a grand stone archway in the background, bathed in golden afternoon sunlight. Realistic, cinematic, 4k.",\n      "contentText": "Did you know that Ancient Romans used a form of concrete to build their incredible structures? This allowed them to create grand buildings like the Colosseum, which is still standing today."\n    },\n    {\n      "scene_number": 2,\n       "duration": 5,\n      "imagePrompt": "A close-up view of an artisan meticulously working with clay, shaping a Roman amphora on a pottery wheel. His hands are covered in clay, with a look of concentration. Realistic, focused, shallow depth of field, 4k.",\n      "contentText": "Their concrete wasn\'t like ours, it was mixed with volcanic ash, making it exceptionally durable and resistant to saltwater."\n    },\n      {\n      "scene_number": 3,\n       "duration": 5,\n      "imagePrompt": "A wide shot of the Roman Colosseum, its massive stone structure bathed in the light of a bright sunny day, with a small group of tourists observing below. Realistic, breathtaking, dramatic sky, 4k",\n      "contentText":"This material was crucial in the construction of aqueducts, baths and roads, all vital elements of Roman society. "\n    },\n    {\n      "scene_number": 4,\n       "duration": 5,\n     "imagePrompt": "A Roman aqueduct, with water flowing through its channels, stretching across a landscape with rolling green hills. The structure is weathered and ancient-looking. Realistic, panoramic view, 4k.",\n      "contentText":"It\'s why so many of their incredible achievements, like this aqueduct, have stood the test of time. Truly a feat of engineering."\n    },\n  {\n      "scene_number": 5,\n      "duration": 5,\n      "imagePrompt": "An animated transition showing the Roman archway slowly breaking apart into modern roads and bridges, highlighting the influence of their concrete technology over time. Realistic animation, seamless transition, 4k.",\n       "contentText": "Their ingenious use of concrete had lasting impact and still shapes the way we build things today."\n    },\n{\n      "scene_number": 6,\n       "duration": 5,\n      "imagePrompt": "Close up of  ancient roman coin with the face of an emperor. Detailed texture of the coin showing its wear and tear, golden light and dark contrast. Realistic, macro shot, 4k.",\n      "contentText": "A tiny detail but a massive impact. History is all about the little things, isn\'t it?"\n    }\n  ]\n}\n```\n',
        },
      ],
    },
  ],
});

import { Configuration, OpenAIApi } from "openai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const json = await request.json();
    const { prompt, type } = json;

    if (type === "text") {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates blog post content.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      return NextResponse.json({
        content: completion.data.choices[0].message?.content,
      });
    } else if (type === "image") {
      const image = await openai.createImage({
        prompt,
        n: 1,
        size: "1024x1024",
      });

      return NextResponse.json({
        url: image.data.data[0].url,
      });
    }

    return new NextResponse("Invalid type specified", { status: 400 });
  } catch (error) {
    console.error("[OPENAI_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
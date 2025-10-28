import { GoogleGenAI, Type } from "@google/genai";
import type { Agent, Comment } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      time: {
        type: Type.STRING,
        description: "The timestamp of the comment in HH:MM:SS.ss format, relative to the video's start.",
      },
      command: {
        type: Type.STRING,
        description: "A Niconico-style command like 'ue pink', 'shita green', etc. Can be empty.",
      },
      comment: {
        type: Type.STRING,
        description: "The content of the comment.",
      },
    },
    required: ["time", "comment"],
  },
};

export async function generateCommentsForAgent(agent: Agent, videoFileName: string, articleText: string, previousComments: Comment[]): Promise<Comment[]> {
  const previousCommentsContext = previousComments.length > 0
    ? `
## 💬 先行エージェントのコメント
先行するエージェントが以下のコメントを生成しました。
これらのコメントを参考に、同意したり、反論したり、あるいは全く新しい視点を加えて、あなたの役割（${agent.name}）としてさらに面白いコメントを生成してください。

\`\`\`json
${JSON.stringify(previousComments.map(({agentId, ...rest}) => rest), null, 2)}
\`\`\`
`
    : '';

  const fullPrompt = `
${agent.prompt}
${previousCommentsContext}

## 📝 タスク
あなたは今から「${videoFileName}」というタイトルの動画を見ています。
${articleText ? `参考資料として以下の記事も読みました。\n\n---\n記事内容:\n${articleText}\n---\n\n` : ''}
あなたの役割（${agent.name}）に従って、この動画に対するNiconico風のコメントを10個から15個生成してください。
出力は必ず指定されたJSON形式の配列にしてください。タイムスタンプは動画のどこかの時点を想定して創造的に設定してください。
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    const comments: Comment[] = JSON.parse(jsonText);
    return comments;
  } catch (error) {
    console.error(`Error generating comments for ${agent.name}:`, error);
    throw new Error(`Failed to get a valid response from the ${agent.name}.`);
  }
}

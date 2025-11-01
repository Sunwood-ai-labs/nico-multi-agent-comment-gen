import { GoogleGenAI, Type } from "@google/genai";
import type { Agent, Comment, GeminiModel } from "../types";

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

export async function generateCommentsForAgent(
  agent: Agent,
  videoFileName: string,
  videoData: { mimeType: string; data: string },
  articleText: string,
  previousComments: Comment[],
  modelName: GeminiModel,
  onRetry: (attempt: number, maxRetries: number) => void
): Promise<Comment[]> {
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
添付された動画（タイトル：「${videoFileName}」）を分析してください。
${articleText ? `参考資料として以下の記事も読みました。\n\n---\n記事内容:\n${articleText}\n---\n\n` : ''}
あなたの役割（${agent.name}）に従って、この動画に対するNiconico風のコメントを約${agent.targetCommentCount}個生成してください。
出力は必ず指定されたJSON形式の配列にしてください。タイムスタンプは動画のどこかの時点を想定して創造的に設定してください。
`;
  
  const maxRetries = 3;
  const retryDelay = 60000; // 1 minute

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const textPart = { text: fullPrompt };
      const videoPart = {
        inlineData: {
          mimeType: videoData.mimeType,
          data: videoData.data,
        },
      };

      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts: [textPart, videoPart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.8,
        },
      });

      const jsonText = response.text.trim();
      const parsedData: any[] = JSON.parse(jsonText);

      const comments: Comment[] = parsedData.map(item => ({
        time: item.time,
        comment: item.comment,
        command: item.command || '',
      }));

      return comments; // Success
    } catch (error) {
      console.error(`Attempt ${attempt + 1}/${maxRetries} for ${agent.name} failed:`, error);
      const errorMessage = (error as Error).toString().toLowerCase();

      if (errorMessage.includes("429") || errorMessage.includes("rate limit")) {
        if (attempt === maxRetries - 1) {
          throw new Error(`Rate limit exceeded and max retries reached for ${agent.name}.`);
        }
        onRetry(attempt + 1, maxRetries);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } else {
        throw error; // Non-retriable error
      }
    }
  }

  // This should not be reached, but is a fallback.
  throw new Error(`Failed to generate comments for ${agent.name} after ${maxRetries} attempts.`);
}

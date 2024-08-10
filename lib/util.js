import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";

export async function getVectorStoreRetriever(embeddings,pcIndex){
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex: pcIndex,
        textKey: "text",
      });
      const retriever = vectorStore.asRetriever()
      return retriever
}
export function getModel(){
  return new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.9,
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
}

export function getEmbeddingModel(){
  return new OpenAIEmbeddings({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
}
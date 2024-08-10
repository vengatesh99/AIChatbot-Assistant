import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { PineconeStore } from "@langchain/pinecone";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import {AIMessage, HumanMessage} from "@langchain/core/messages"
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import * as dotenv from "dotenv";
import { getVectorStoreRetriever, getModel, getEmbeddingModel } from "./util";
import { Pinecone } from "@pinecone-database/pinecone";

// dotenv.config();

//TODO: Implement the chat history array using map() method
//TODO: Implement the scraping of Web url and convert it into embeddings

export default async function createLangChain(history) {
  try {
    const chatHistory = history.map(message => {
      if(message.role === 'assistant'){
        return new AIMessage(`${message.content}`)
      }
      else{
        return new HumanMessage(`${message.content}`)
      }
    }
    )
    console.log("chat history created..")

    const pc = new Pinecone({
      apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY,
    });
    const pcIndex = pc.Index("first-index");
    const embeddings = getEmbeddingModel()

    const model = getModel();

    // const retriever = getVectorStoreRetriever(embeddings,pcIndex);
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: pcIndex,
      textKey: "text",
    });
    const retriever = vectorStore.asRetriever()
    
    //pass chat history to retriever
    const rephraseHistoryPrompt = ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder("chat_history"),
      ["user","{input}"],
      ['user',"Given the above conversation, generate a search query to look up in order to get information relevant to the conversation"],
    ])
    console.log("Rephrase promp created......")
    const historyAwareRetriever = await createHistoryAwareRetriever(
      {
        llm: model,
        retriever,
        rephrasePrompt: rephraseHistoryPrompt
      }
    )
    console.log("Retriever for history created .....")

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "Answer the user's questions based on the following context: {context}.",
      ],
      new MessagesPlaceholder("chat_history"),
      ["user", "{input}"],
    ]);

    const chain = await createStuffDocumentsChain({
      llm: model,
      prompt,
    });

    console.log("Initiliazing conversation chain......")
    const conversationChain = await createRetrievalChain({
      combineDocsChain: chain,
      retriever: historyAwareRetriever
    });
  
    const lastQuestion = chatHistory.slice(chatHistory.length-1)[0].content

  console.log("invoking conversation change")

    const response = await conversationChain.invoke({
      input: `${lastQuestion}`,
      chat_history: chatHistory
    });
    // console.log("Response generated:",response.answer);
    return response.answer
  } catch (error) {
    console.log("Error:", error);
  }
}

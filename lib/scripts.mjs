"use server";
import { Pinecone } from "@pinecone-database/pinecone";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";

try {
  //Created a PineCone Client
  const pc = new Pinecone({
    apiKey: NEXT_PUBLIC_PINECONE_API_KEY,
  });
  //
  // console.log(await pc.listIndexes());
  const pcIndex = pc.Index("first-index");


  // console.log(await pc.listIndexes())
  //PDF Loader initializing
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const loader = new PDFLoader(`${process.env.NEXT_PUBLIC_PDF_PATH}`);
  const docs = await loader.load();
  console.log("Preparing chunks from PDF file");
  const chunkedDocs = await textSplitter.splitDocuments(docs);
  console.log(`Loading ${chunkedDocs.length} chunks into pinecone...`);
  // //Creating a vector store to store the vectors/embeddings
  const vectorStore = await PineconeStore.fromDocuments(
    chunkedDocs,
    new OpenAIEmbeddings({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    }),
    { pineconeIndex: pcIndex, textKey: "text"}
  );
} catch (error) {
  console.log("Error in document ingesting", error);
}

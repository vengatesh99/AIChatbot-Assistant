"use client";

import { Box, Typography, Stack, Button } from "@mui/material";
import ChatWindow from "@/components/ChatWindow";
import { useState } from "react";
import { useSession, getSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Header from "@/components/Header";
import AddIcon from '@mui/icons-material/Add';

const chatBoxStyle = {
  marginTop: "20px",
  marginLeft: "20px",
  marginBottom: "20px",
  borderColor: "rgba(0, 0, 0, 0.1)", // Light border color
  // borderColor: "#f5f5f7",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow
  padding: "10px", // Padding for inner spacing
};
export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi, Welcome to our website. Ask me anything... I am here to help",
    },
  ]);

  const handleSendMessage = async (newMessage) => {
    setMessages((prevMessage) => [...prevMessage, newMessage]);

    //invoke the route that handles the POST request to OPEN AI
    const response = await fetch("api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, newMessage]),
    });
    const data = await response.json();
    setMessages((prevMessage) => [
      ...prevMessage,
      { role: "assistant", content: data.message },
    ]);
  };

  const { data: session, status } = useSession();
  const router = useRouter();
  return (
    <>
    <Header />
      {session ? (
        <Box
          display={"flex"}
          flexDirection={"row"}
          height={"100vh"}
          width={"100vw"}
          gap={2}
        >
          <Box border={1} borderRadius={5} sx={chatBoxStyle} flexGrow={1}>
          <Stack direction="row" display={"flex"} justifyContent={"space-between"}>
          <Box component="span" fontWeight='fontWeightLarge'>New Chat</Box>
          <Button variant="outline"><AddIcon/></Button>
          </Stack>
          
          </Box>
          <Box
            border={1}
            borderRadius={5}
            sx={chatBoxStyle}
            flexGrow={4}
            flexShrink={1}
            mr={"20px"}
            display={"flex"}
            flexDirection={"column"}
          >
            <ChatWindow messages={messages} onSendMessage={handleSendMessage} />
          </Box>
        </Box>
      ) : (
        router.push("/")
      )}
    </>
  );
}

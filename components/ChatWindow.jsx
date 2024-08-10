import { Stack, TextField, Button, Box } from "@mui/material";
import { useRef, React } from "react";
import SendIcon from "@mui/icons-material/Send";
import Avatar from "@mui/material/Avatar";

const ChatWindow = ({ messages, onSendMessage }) => {
  const sendMsgRef = useRef();
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log(event);
      onSendMessage({ role: "user", content: sendMsgRef.current.value.trim() });
      sendMsgRef.current.value = "";
    }
  };
    // const sendButtonRef = useRef()
  return (
    <>
      <Box flexGrow={1}>
      {messages.map((message, index) => (
        <Box
          key={index}
          display="flex"
          justifyContent={
            message.role === "assistant" ? "flex-start" : "flex-end"
          }
        >
            {message.role === "assistant" ? (
              <Stack direction={"row"} spacing={2}>
                <Avatar>AI</Avatar>
          <Box
                  bgcolor={message.role === "assistant" ? "#f0f0f5" : "#17171b"}
                  color={message.role === "assistant" ? "black" : "white"}
                  borderRadius={1}
                  p={2}
                >
                  {message.content}
                </Box>
              </Stack>
            ) : (
              <Stack direction={"row"} spacing={2}>
                <Box
                  bgcolor={message.role === "assistant" ? "#f0f0f5" : "#17171b"}
                  color={message.role === "assistant" ? "black" : "white"}
                  borderRadius={1}
            p={2}
          >
            {message.content}
          </Box>
                <Avatar />
              </Stack>
            )}
        </Box>
      ))}
      </Box>

      <Stack direction={"row"} spacing={2}>
        <TextField
          inputRef={sendMsgRef}
          label="Chat with AI"
          fullWidth
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="contained"
          sx={{
            bgcolor: "black",
          }}
          onClick={() => {
            const newMsg = {
              role: "user",
              content: sendMsgRef.current.value.trim(),
            };
            sendMsgRef.current.value = "";
            onSendMessage(newMsg);
          }}
        >
          <SendIcon />
        </Button>
      </Stack>
    </>
  );
};

export default ChatWindow;

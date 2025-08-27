import React from "react";
import HandoverChildPage from "./HandoverChildPage";
import ChatPage from "../ChatPage";

const ChatPageWrapper: React.FC = () => (
  <HandoverChildPage>
    <ChatPage />
  </HandoverChildPage>
);

export default ChatPageWrapper;

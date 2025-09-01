import axiosAuth from "@/lib/axiosAuth";

interface ChatHistoryMessage {
  role: "user" | "assistant";
  content: string;
  _id: string;
  timestamp: string;
}

interface SpecificChatResponse {
  success: boolean;
  data: {
    userId: string;
    messages: ChatHistoryMessage[];
  };
}

interface ChatResponse {
  success: boolean;
  answer: string;
}

export async function sendChatMessage(question: any): Promise<ChatResponse> {
  try {
    // 👇 Tell Axios to expect ChatResponse directly
    const payload: ChatResponse = await axiosAuth.post(
      "/chatbot/chat",
      question
    );

    console.log("Normalized payload:", payload);

    if (payload && payload.answer) {
      return {
        success: payload.success ?? true,
        answer: payload.answer,
      };
    }

    console.warn("Unexpected API response structure:", payload);
    return {
      success: false,
      answer: "Sorry, I couldn't understand the response from the server.",
    };
  } catch (err: any) {
    console.error("Failed to send message:", err);

    if (err.response?.data) {
      return {
        success: false,
        answer:
          err.response.data.message ||
          "Server error occurred. Please try again.",
      };
    } else if (err.request) {
      return {
        success: false,
        answer: "Network error: Please check your connection and try again.",
      };
    } else {
      return {
        success: false,
        answer: "Error: Please try again or contact support.",
      };
    }
  }
}

export async function getChatHistory(): Promise<ChatHistoryMessage[]> {
  try {
    const response = await axiosAuth.get("/chatbot/history");
    return response.data; // history is already an array
  } catch (err) {
    console.error("Failed to fetch chat history:", err);
    throw err;
  }
}

export async function getChatById(
  chatId: string
): Promise<SpecificChatResponse> {
  try {
    const response = await axiosAuth.get(`/chatbot/chats/${chatId}`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch specific chat:", err);
    throw err;
  }
}

export async function deleteChatById(chatId: string): Promise<any> {
  try {
    const response = await axiosAuth.delete(`/chatbot/chats/${chatId}`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch delte chat:", err);
    throw err;
  }
}

export async function deleteAllChats(): Promise<any> {
  try {
    const { data } = await axiosAuth.delete(`/chatbot/chats`);
    return data;
  } catch (err) {
    console.error("Failed to delete all chats:", err);
    throw err;
  }
}

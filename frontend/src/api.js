const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const api = {
  async getConversations() {
    const response = await fetch(`${API_BASE_URL}/conversations`);
    if (!response.ok) throw new Error("Failed to fetch conversations");
    return response.json();
  },

  async createConversation(title = "New Chat") {
    const response = await fetch(`${API_BASE_URL}/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!response.ok) throw new Error("Failed to create conversation");
    return response.json();
  },

  async getConversation(conversationId) {
    const response = await fetch(
      `${API_BASE_URL}/conversations/${conversationId}`,
    );
    if (!response.ok) throw new Error("Failed to fetch conversation");
    return response.json();
  },

  async updateConversation(conversationId, title) {
    const response = await fetch(
      `${API_BASE_URL}/conversations/${conversationId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      },
    );
    if (!response.ok) throw new Error("Failed to update conversation");
    return response.json();
  },

  async deleteConversation(conversationId) {
    const response = await fetch(
      `${API_BASE_URL}/conversations/${conversationId}`,
      {
        method: "DELETE",
      },
    );
    if (!response.ok) throw new Error("Failed to delete conversation");
    return response.json();
  },

  async sendMessage(
    message,
    conversationId = null,
    systemPrompt = null,
    temperature = 0.7,
  ) {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        conversation_id: conversationId,
        system_prompt: systemPrompt,
        temperature,
      }),
    });
    if (!response.ok) throw new Error("Failed to send message");
    return response.json();
  },

  async sendMessageStream(
    message,
    conversationId = null,
    systemPrompt = null,
    temperature = 0.7,
    onChunk,
    onDone,
    onError,
  ) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          conversation_id: conversationId,
          system_prompt: systemPrompt,
          temperature,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let conversationIdFromStream = conversationId;
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "conversation_id") {
                conversationIdFromStream = data.id;
              } else if (data.type === "content") {
                onChunk(data.text, conversationIdFromStream);
              } else if (data.type === "done") {
                onDone(conversationIdFromStream);
              } else if (data.type === "error") {
                onError(data.message);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      onError(error.message);
    }
  },

  async clearConversation(conversationId) {
    const response = await fetch(
      `${API_BASE_URL}/conversations/${conversationId}/clear`,
      {
        method: "POST",
      },
    );
    if (!response.ok) throw new Error("Failed to clear conversation");
    return response.json();
  },
};

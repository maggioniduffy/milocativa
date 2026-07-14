// src/hooks/useConversation.ts
import { useEffect, useState } from "react";
import { useSupabaseClient } from "@/lib/supabase/client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  sentAt: string;
  readAt: string | null;
};

export function useConversation(conversationId: string) {
  const supabase = useSupabaseClient();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("sent_at", { ascending: true })
      .then(({ data }) => data && setMessages(data as unknown as Message[]));

    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: RealtimePostgresChangesPayload<Message>) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, supabase]);

  async function sendMessage(body: string, senderId: string) {
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: senderId,
      body,
    });
  }

  return { messages, sendMessage };
}

"use client";
import { Message } from "rsuite";

export default function ErrorToast({ message }: { message: string }) {
  return (
    <Message type="error" closable>
      {message}
    </Message>
  );
}

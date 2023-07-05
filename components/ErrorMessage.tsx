"use client";
import { Message } from "rsuite";

export default function ErrorMessage({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <Message type="error" {...(className && { className })}>
      There was an error {message}. Please try again later or contact us if the
      issue persists.
    </Message>
  );
}

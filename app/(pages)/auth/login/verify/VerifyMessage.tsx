"use client";
import { Message } from "rsuite";

export default function VerifyMessage() {
  return (
    <Message type="" header={<h3>Check your email</h3>} className="container">
      Please check your email. A sign-in link has been sent to your address.
    </Message>
  );
}

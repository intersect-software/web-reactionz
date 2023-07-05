"use client";
import { signOut } from "next-auth/react";
import { Button, Message } from "rsuite";

export default function LogoutMessage() {
  return (
    <Message type="" header={<h3>Log out</h3>} className="container">
      <p>Are you sure you want to log out?</p>
      <br />
      <Button type="submit" appearance="primary" onClick={() => signOut()}>
        Yes, log out now.
      </Button>
    </Message>
  );
}

"use client";

import { Form } from "rsuite";

export default function NewSite() {
  /**
   * max likes per person
   * IP timeout
   * which emojis
   * custom message?
   */
  return (
    <Form>
      <Form.Group controlId="hostname">
        <Form.ControlLabel>Domain</Form.ControlLabel>
        <Form.Control name="hostname" />
        <Form.HelpText>e.g., myblog.com</Form.HelpText>
      </Form.Group>
    </Form>
  );
}

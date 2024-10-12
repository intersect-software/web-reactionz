"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRef } from "react";
import { Button, Checkbox, CheckboxGroup, Form, Schema } from "rsuite";

export default function LoginForm({ csrfToken }: { csrfToken: string }) {
  const ref = useRef();
  return (
    <div className="container">
      <h3>Login / Register</h3>
      <Form
        ref={ref}
        method="post"
        action="/api/auth/signin/email"
        onSubmit={() => {
          if (!ref?.current?.check()) {
            return;
          }

          const form = ref.current.root as HTMLFormElement;
          if (!form.tos.value) {
            return window.alert(
              "You must accept the Terms of Service and Privacy Policy before logging in or registering"
            );
          }

          signIn("email", { email: form.email.value });
        }}
      >
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <Form.Group>
          <Form.ControlLabel>Email address</Form.ControlLabel>
          <Form.Control
            type="email"
            name="email"
            id="email"
            rule={Schema.Types.StringType()
              .isEmail()
              .isRequired("Please enter a valid email address")}
          />
          <Form.HelpText>You will be emailed a link to login.</Form.HelpText>
        </Form.Group>

        <Form.Group>
          <Form.Control
            name="tos"
            accepter={CheckboxGroup}
            inline
            rule={Schema.Types.NumberType().isRequired(
              "You must accept the Terms of Service and Privacy Policy before logging in or registering"
            )}
          >
            <Checkbox value="1">
              I accept the{" "}
              <Link href="/terms" target="_blank">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" target="_blank">
                Privacy Policy
              </Link>
            </Checkbox>
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Button type="submit" appearance="primary">
            Sign in with Email
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}

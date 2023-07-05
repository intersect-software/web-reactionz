"use client";
import { apiFetch } from "@/lib/helpers";
import { useState } from "react";
import { Button, ButtonToolbar, Form, Modal, useToaster } from "rsuite";
import CopyIcon from "@rsuite/icons/Copy";
import Link from "next/link";
import ErrorToast from "@/components/ErrorToast";

export default function NewSiteModal({
  open,
  onClose,
  onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const [formData, setFormData] = useState({});
  const [step, setStep] = useState(1);
  const [newSiteId, setNewSiteId] = useState(null);
  const toaster = useToaster();

  const handleSubmit = async () => {
    await apiFetch("/api/dashboard/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        setNewSiteId(res.site_id);
        setStep(2);
        onUpdate();
      })
      .catch((err) => toaster.push(<ErrorToast message={err.message} />));
  };

  const scriptTag = `<script async defer src="https://cdn.jsdelivr.net/gh/intersect-software/web-reactionz@1/public/setup.min.js" data-siteid="${newSiteId}" />`;
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>Create new site</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {step === 1 && (
          <Form
            formValue={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
          >
            <Form.Group controlId="hostname">
              <Form.ControlLabel>Domain</Form.ControlLabel>
              <Form.Control name="hostname" placeholder="e.g., myblog.com" />
              <Form.HelpText>
                Reactions will <i>not</i> be allowed from any other domain.
              </Form.HelpText>
            </Form.Group>

            <ButtonToolbar>
              <Button appearance="primary" type="submit">
                Create
              </Button>
              <Button appearance="ghost" color="red" onClick={onClose}>
                Cancel
              </Button>
            </ButtonToolbar>
          </Form>
        )}

        {step === 2 && (
          <div>
            <p>
              Your site has been created! Please paste the following code
              snippet near the bottom of your webpage(s), just <i>before</i> the{" "}
              <code>&lt;/body&gt;</code> tag:
            </p>
            <p>
              <code>{scriptTag}</code>{" "}
              <CopyIcon
                title="Copy to clipboard"
                className="copyToClipboardBtn"
                onClick={() => navigator.clipboard.writeText(scriptTag)}
              />
            </p>
            <p>
              <Button appearance="ghost" onClick={() => setStep(3)}>
                Next
              </Button>
            </p>
          </div>
        )}

        {step === 3 && (
          <div>
            <p>
              You are now ready to configure your site! See the{" "}
              <Link href="/support">Support & Docs</Link> page for more
              information on how to configure your site.
            </p>
            <p>
              <Button
                appearance="ghost"
                onClick={() => {
                  onClose();
                  setStep(1);
                }}
              >
                Close
              </Button>
            </p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

"use client";
import ThemePreview from "@/app/(dashboard)/dashboard/ThemePreview";
import ErrorToast from "@/components/ErrorToast";
import TimePeriodPicker from "@/components/TimePeriodPicker";
import { apiFetch, getEmoji } from "@/lib/helpers";
import { DashboardSite } from "@/types/apiTypes";
import { useState } from "react";
import {
  Button,
  ButtonToolbar,
  CheckPicker,
  Form,
  Modal,
  Panel,
  PanelGroup,
  RadioTile,
  RadioTileGroup,
  Toggle,
  useToaster,
} from "rsuite";
import emoji from "unicode-emoji-json";

export default function EditSiteModal({
  site,
  open,
  onClose,
  onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
  site: DashboardSite;
}) {
  const toaster = useToaster();
  const [formData, setFormData] = useState({
    hostname: site.hostname,
    max_reactions_per_ip: site.max_reactions_per_ip,
    max_reactions_per_ip_period_seconds:
      site.max_reactions_per_ip_period_seconds,
    show_reaction_counts: site.show_reaction_counts,
    emojis: site.emojis,
    ...site.widget_settings,
  });

  const handleSubmit = async () => {
    await apiFetch(`/api/dashboard/sites/${site.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hostname: formData.hostname,
        max_reactions_per_ip: +formData.max_reactions_per_ip,
        max_reactions_per_ip_period_seconds:
          +formData.max_reactions_per_ip_period_seconds,
        show_reaction_counts: formData.show_reaction_counts,
        emojis: formData.emojis,
        widget_settings: [
          "layout",
          "position",
          "prompt",
          "domSelector",
          "bordered",
          "fontSizeScale",
          "fontColor",
          "theme",
        ].reduce((acc, cur) => {
          acc[cur] = formData[cur];
          return acc;
        }, {}),
      }),
    })
      .then(() => {
        onClose();
        onUpdate();
      })
      .catch((err) => toaster.push(<ErrorToast message={err.message} />));
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this site? This is irreversible and will delete all your reaction history for this site permanently."
      )
    ) {
      await apiFetch(`/api/dashboard/sites/${site.id}`, {
        method: "DELETE",
      })
        .then(() => {
          onClose();
          onUpdate();
        })
        .catch((err) => toaster.push(<ErrorToast message={err.message} />));
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <Modal.Header>
        <Modal.Title>Edit site</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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

          <PanelGroup accordion defaultActiveKey={1}>
            <Panel header="Limits" eventKey={1}>
              <div className="formQuestionsGrid">
                <Form.Group controlId="max_reactions_per_ip">
                  <Form.ControlLabel>
                    Maximum reactions per user
                  </Form.ControlLabel>
                  <Form.Control
                    name="max_reactions_per_ip"
                    placeholder="e.g., 1"
                    type="number"
                    min="0"
                  />
                  <Form.HelpText>
                    You can choose whether users can react multiple times per
                    page or not (e.g., to &apos;applause&apos; multiple times).
                  </Form.HelpText>
                </Form.Group>

                <Form.Group controlId="max_reactions_per_ip_period_seconds">
                  <Form.ControlLabel>
                    Time period in which to limit reactions from user
                  </Form.ControlLabel>
                  <TimePeriodPicker
                    value={formData.max_reactions_per_ip_period_seconds}
                    onChange={(seconds) =>
                      setFormData((old) => ({
                        ...old,
                        max_reactions_per_ip_period_seconds: seconds,
                      }))
                    }
                  />
                  <Form.HelpText>
                    How long should one be prevented from reacting again after
                    hitting their limit?
                  </Form.HelpText>
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>Reaction counts visible</Form.ControlLabel>
                  <Toggle
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                    onChange={(checked) =>
                      setFormData((old) => ({
                        ...old,
                        show_reaction_counts: checked,
                      }))
                    }
                    checked={formData.show_reaction_counts}
                  />
                  <Form.HelpText>
                    Should the total count for each reaction be displayed to
                    users?
                  </Form.HelpText>
                </Form.Group>
              </div>
            </Panel>

            <Panel header="Look & Feel" eventKey={2}>
              <div className="formQuestionsGrid">
                <Form.Group controlId="emojis">
                  <Form.ControlLabel>Emojis</Form.ControlLabel>
                  <CheckPicker
                    virtualized
                    block
                    sticky
                    cleanable={false}
                    searchable
                    data={Object.keys(emoji).map((e) => ({
                      label: `${e} ${emoji[e].slug}`,
                      value: emoji[e].slug,
                    }))}
                    value={formData.emojis}
                    onSelect={(items, item) => {
                      // CheckPicker stores items in the order of `data`
                      //  but we want the order of selection
                      // So manually keep track of selection order by appending/deleting as needed
                      setFormData((old) => {
                        const newData = { ...old };
                        if (items.includes(item.value)) {
                          newData.emojis.push(item.value as string);
                        } else {
                          newData.emojis = newData.emojis.filter(
                            (e) => e !== item.value
                          );
                        }
                        return newData;
                      });
                    }}
                    renderValue={() => {
                      const items = formData.emojis ?? [];
                      return (
                        <>
                          <span className="rs-picker-value-list">
                            {items.map((i: any) => (
                              <span
                                className="rs-picker-value-item"
                                key={`emoji-${i}`}
                              >
                                {getEmoji(i)}
                              </span>
                            ))}
                          </span>
                          <span
                            className="rs-picker-value-count"
                            title={items.length.toString()}
                          >
                            {items.length}
                          </span>
                        </>
                      );
                    }}
                    name="emojis"
                  />
                  <Form.HelpText>
                    Choose the reaction emojis to display to your users.
                  </Form.HelpText>
                </Form.Group>

                <Form.Group controlId="domSelector">
                  <Form.ControlLabel>HTML DOM Selector</Form.ControlLabel>
                  <Form.Control
                    name="domSelector"
                    placeholder="e.g., #content"
                  />
                  <Form.HelpText>
                    What is the selector for the element on your pages which the
                    reaction position should be relative to?
                  </Form.HelpText>
                </Form.Group>
              </div>

              <Form.Group>
                <Form.ControlLabel>Position</Form.ControlLabel>
                <RadioTileGroup
                  value={formData.position}
                  onChange={(v) =>
                    setFormData((old) => ({ ...old, position: v as string }))
                  }
                  inline
                >
                  <RadioTile label="Top" value="top">
                    Show your reactions at the top (beginning) of your page
                    element.
                  </RadioTile>
                  <RadioTile label="Bottom" value="bottom">
                    Show your reactions at the bottom (end) of your page
                    element.
                  </RadioTile>
                  <RadioTile label="Right (fixed)" value="right">
                    Show your reactions on the right of your page element, fixed
                    on the right of the screen as you scroll down. On mobile,
                    this will instead be fixed at the bottom of the screen.
                  </RadioTile>
                  <RadioTile label="Left (fixed)" value="left">
                    Show your reactions on the left of your page element, fixed
                    on the left of the screen as you scroll down. On mobile,
                    this will instead be fixed at the bottom of the screen.
                  </RadioTile>
                </RadioTileGroup>
              </Form.Group>

              <Form.Group>
                <Form.ControlLabel>Layout</Form.ControlLabel>
                <RadioTileGroup
                  value={formData.layout}
                  onChange={(v) =>
                    setFormData((old) => ({ ...old, layout: v as string }))
                  }
                  inline
                >
                  <RadioTile label="Horizontal" value="horizontal">
                    Show your reactions side-by-side, with the counts on the
                    right of each emoji.
                  </RadioTile>
                  <RadioTile label="Vertical" value="vertical">
                    Show your reactions on top of each other, with the counts on
                    the right of each emoji.
                  </RadioTile>
                </RadioTileGroup>
              </Form.Group>

              <div className="formQuestionsGrid">
                <Form.Group>
                  <Form.ControlLabel>Border</Form.ControlLabel>
                  <Toggle
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                    onChange={(checked) =>
                      setFormData((old) => ({
                        ...old,
                        bordered: checked,
                      }))
                    }
                    checked={formData.bordered}
                  />
                  <Form.HelpText>
                    Should the reaction widget have a border?
                  </Form.HelpText>
                </Form.Group>

                <Form.Group controlId="prompt">
                  <Form.ControlLabel>Prompt text</Form.ControlLabel>
                  <Form.Control
                    name="prompt"
                    placeholder="e.g., Was this useful?"
                  />
                  <Form.HelpText>
                    Leave blank if you do not want to show a prompt.
                  </Form.HelpText>
                </Form.Group>

                <Form.Group controlId="fontSizeScale">
                  <Form.ControlLabel>Font size scale factor</Form.ControlLabel>
                  <Form.Control
                    name="fontSizeScale"
                    type="number"
                    step="0.1"
                    min="0.5"
                    placeholder="e.g., 1.3"
                  />
                </Form.Group>

                <Form.Group controlId="fontColor">
                  <Form.ControlLabel>Font color</Form.ControlLabel>
                  <Form.Control
                    name="fontColor"
                    type="color"
                    placeholder="e.g., #acacac"
                  />
                </Form.Group>
              </div>

              <Form.Group>
                <Form.ControlLabel>Theme</Form.ControlLabel>
                <RadioTileGroup
                  value={formData.theme}
                  onChange={(v) =>
                    setFormData((old) => ({ ...old, theme: v as string }))
                  }
                  inline
                >
                  <RadioTile label="Minimal" value="minimal">
                    Preview:
                    <ThemePreview
                      theme="minimal"
                      prompt={formData.prompt}
                      emojis={formData.emojis}
                      bordered={formData.bordered}
                      layout={formData.layout}
                      fontSizeScale={formData.fontSizeScale}
                      fontColor={formData.fontColor}
                      showReactionCounts={formData.show_reaction_counts}
                    />
                  </RadioTile>
                  <RadioTile label="Multiline" value="multiline">
                    Preview:
                    <ThemePreview
                      theme="multiline"
                      prompt={formData.prompt}
                      emojis={formData.emojis}
                      bordered={formData.bordered}
                      layout={formData.layout}
                      fontSizeScale={formData.fontSizeScale}
                      fontColor={formData.fontColor}
                      showReactionCounts={formData.show_reaction_counts}
                    />
                    Note: this theme is always used on mobile screens.
                  </RadioTile>
                </RadioTileGroup>
              </Form.Group>
            </Panel>
          </PanelGroup>

          <ButtonToolbar>
            <Button appearance="primary" type="submit">
              Save
            </Button>
            <Button appearance="ghost" color="red" onClick={onClose}>
              Cancel
            </Button>
          </ButtonToolbar>
          <div className="deleteSiteBtn" onClick={handleDelete}>
            Delete site?
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

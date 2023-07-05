"use client";
import SitePage from "@/app/(dashboard)/dashboard/SitePage";
import {
  Button,
  IconButton,
  Message,
  Panel,
  Stack,
  Toggle,
  useToaster,
} from "rsuite";
import GearIcon from "@rsuite/icons/Gear";
import CopyIcon from "@rsuite/icons/Copy";
import { useState } from "react";
import EditSiteModal from "@/app/(dashboard)/dashboard/EditSiteModal";
import { apiFetch } from "@/lib/helpers";
import { DashboardSite } from "@/types/apiTypes";
import ErrorToast from "@/components/ErrorToast";

export default function Site({
  site,
  onUpdate,
}: {
  site: DashboardSite;
  onUpdate: () => void;
}) {
  const [showEditSite, setShowEditSite] = useState(false);
  const [showScriptTag, setShowScriptTag] = useState(false);
  const pages = Object.keys(site.pages);
  const toaster = useToaster();

  const handleToggleSiteActive = async (active: boolean) => {
    await apiFetch(`/api/dashboard/sites/${site.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    })
      .then(onUpdate)
      .catch((err) => toaster.push(<ErrorToast message={err.message} />));
  };

  const scriptTag = `<script async defer src="https://cdn.jsdelivr.net/gh/intersect-software/web-reactionz@1/public/setup.min.js" data-siteid="${site.id}" />`;
  return (
    <>
      <Panel
        className="site"
        header={
          <>
            <Stack justifyContent="space-between">
              <div>
                {site.hostname}{" "}
                <Toggle
                  size="sm"
                  checked={site.active}
                  onChange={(checked) => handleToggleSiteActive(checked)}
                />
              </div>

              <IconButton
                className="editSiteIcon"
                icon={<GearIcon />}
                onClick={() => setShowEditSite(true)}
                appearance="primary"
                placement="right"
                size="sm"
              >
                Configure
              </IconButton>
            </Stack>
            {showScriptTag && <code>{scriptTag}</code>}
            <Button
              size="sm"
              className="showScriptBtn"
              appearance="link"
              onClick={() => setShowScriptTag((old) => !old)}
            >
              Show &lt;script&gt; code?
            </Button>
            <CopyIcon
              title="Copy to clipboard"
              className="copyToClipboardBtn"
              onClick={() => {
                navigator.clipboard.writeText(scriptTag);
                toaster.push(
                  <Message type="success" showIcon closable>
                    Copied to clipboard
                  </Message>,
                  { duration: 2000 }
                );
              }}
            />
          </>
        }
      >
        {pages.length ? (
          <div className="pages">
            {Object.keys(site.pages).map((pageId) => (
              <SitePage
                site={site}
                pageId={pageId}
                reactions={site.pages[pageId]}
                key={`site-${site.id}-page-${pageId}`}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        ) : (
          <Message type="info" header="No reactions yet">
            There have not been any reactions on this site yet.
          </Message>
        )}
      </Panel>

      <EditSiteModal
        open={showEditSite}
        onClose={() => setShowEditSite(false)}
        onUpdate={onUpdate}
        site={site}
      />
    </>
  );
}

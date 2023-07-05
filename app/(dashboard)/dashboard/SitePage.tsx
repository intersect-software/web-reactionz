"use client";
import { Button, Panel, useToaster } from "rsuite";
import ReactionCount from "@/app/(dashboard)/dashboard/ReactionCount";
import PageGraphModal from "@/app/(dashboard)/dashboard/PageGraphModal";
import { useState } from "react";
import { DashboardPageReactions, DashboardSite } from "@/types/apiTypes";
import { apiFetch } from "@/lib/helpers";
import ErrorToast from "@/components/ErrorToast";

export default function SitePage({
  site,
  pageId,
  reactions,
  onUpdate,
}: {
  site: DashboardSite;
  pageId: string;
  reactions: DashboardPageReactions;
  onUpdate: () => void;
}) {
  const [showGraph, setShowGraph] = useState(false);
  const toaster = useToaster();

  const handleDeletePage = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      window.confirm(
        "Are you sure you want to delete this page? All reactions for this page will be irrecoverably lost."
      )
    ) {
      await apiFetch(
        `/api/dashboard/sites/${site.id}/pages/${encodeURIComponent(
          pageId
        )}/reactions`,
        {
          method: "DELETE",
        }
      )
        .then(() => onUpdate())
        .catch((err) => toaster.push(<ErrorToast message={err.message} />));
    }
  };

  return (
    <>
      <Panel
        header={
          <>
            {pageId}{" "}
            <Button appearance="ghost" size="xs" onClick={handleDeletePage}>
              Delete?
            </Button>
          </>
        }
        bordered
        onClick={() => setShowGraph(true)}
        className="page"
      >
        <div className="reactionCounts">
          {Object.keys(reactions).map((emoji) => (
            <ReactionCount emoji={emoji} count={reactions[emoji]} key={emoji} />
          ))}
        </div>
      </Panel>

      {showGraph && (
        <PageGraphModal
          open={showGraph}
          onClose={() => setShowGraph(false)}
          site={site}
          pageId={pageId}
        />
      )}
    </>
  );
}

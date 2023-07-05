"use client";
import NewSiteModal from "@/app/(dashboard)/dashboard/NewSiteModal";
import Site from "@/app/(dashboard)/dashboard/Site";
import { useState } from "react";
import { Button, Input, InputGroup, Loader, Message, Stack } from "rsuite";
import { fetcher } from "@/lib/helpers";
import useSWR from "swr";
import { DashboardSitesResponse } from "@/types/apiTypes";
import SearchIcon from "@rsuite/icons/Search";

export default function Sites() {
  const [showNewSite, setShowNewSite] = useState(false);
  const [search, setSearch] = useState("");
  const { data, error, isLoading, mutate } = useSWR<DashboardSitesResponse>(
    "/api/dashboard/sites",
    fetcher
  );

  return (
    <div>
      <NewSiteModal
        open={showNewSite}
        onUpdate={mutate}
        onClose={() => setShowNewSite(false)}
      />

      {isLoading && <Loader center />}

      <Stack className="actionsWrapper">
        <InputGroup className="searchSitesInput">
          <InputGroup.Addon>
            <SearchIcon />
          </InputGroup.Addon>
          <Input
            value={search}
            type="search"
            onChange={(v) => setSearch(v.toLowerCase())}
            placeholder="Search your sites/pages"
          />
        </InputGroup>
        <Button
          appearance="ghost"
          onClick={() => setShowNewSite(true)}
          size="sm"
        >
          Create new site?
        </Button>
      </Stack>

      {data?.sites
        ?.filter(
          (s) =>
            s.hostname.includes(search) ||
            Object.keys(s.pages).find((p) => p.includes(search))
        )
        .map((s) => (
          <Site site={s} key={`site-${s.id}`} onUpdate={mutate} />
        ))}

      {!isLoading && !data?.sites?.length && (
        <Message type="info" showIcon>
          You do not have any sites yet.
        </Message>
      )}
    </div>
  );
}

"use client";
import { fetcher, getISODateString } from "@/lib/helpers";
import { DashboardSite } from "@/types/apiTypes";
import { DatePicker, DateRangePicker, Loader, Modal, Nav } from "rsuite";
import useSWR from "swr";

import { Chart as ChartJS, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
import { enGB } from "date-fns/locale";
import { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import predefinedRanges from "@/lib/calendarPredefinedRanges";
import ErrorMessage from "@/components/ErrorMessage";

ChartJS.register(...registerables);

type ChartProps = { pageId: string; siteId: string };

function BarChart({ siteId, pageId }: ChartProps) {
  const [date, setDate] = useState<Date>(new Date());
  const { data, error, isLoading } = useSWR(
    `/api/dashboard/sites/${siteId}/pages/${encodeURIComponent(
      pageId
    )}/reactions?date=${getISODateString(date)}`,
    fetcher
  );

  const ChartDatePicker = () => (
    <DatePicker
      placeholder="Select date"
      className="graphDatePicker"
      value={date}
      onChange={(d) => setDate(d!)}
      shouldDisableDate={(d) => d > new Date()}
    />
  );

  if (isLoading) return <ChartDatePicker />;
  if (error) return <ErrorMessage message="fetching the data" />;

  const labels = Object.keys(data.reactions);
  const points = {
    labels,
    datasets: Object.keys(data.emojis).map((emoji) => ({
      label: data.emojis[emoji],
      data: Object.values(data.reactions).map((r) => r[emoji]),
    })),
  };

  return (
    <>
      <ChartDatePicker />
      <Bar
        options={{
          responsive: true,
          plugins: {
            title: { display: true, text: "Reactions per day" },
            legend: {
              labels: {
                boxWidth: 10,
                boxHeight: 0,
                font: { size: 20 },
              },
            },
          },
          scales: {
            y: {
              ticks: { stepSize: 1 },
              title: { display: true, text: "No. of reactions" },
            },
            x: {
              adapters: {
                type: "time",
                date: { locale: enGB },
                time: { parser: "yyyy-MM-dd", unit: "month" },
              },
              title: { display: true, text: "Date" },
            },
          },
        }}
        data={points}
      />
    </>
  );
}

function LineChart({ siteId, pageId }: ChartProps) {
  const [dateRange, setDateRange] = useState<[Date, Date]>(
    predefinedRanges[3].value
  );

  const { data, error, isLoading } = useSWR(
    `/api/dashboard/sites/${siteId}/pages/${encodeURIComponent(
      pageId
    )}/reactions?from=${getISODateString(dateRange[0])}&to=${getISODateString(
      dateRange[1]
    )}`,
    fetcher
  );

  const ChartDatePicker = () => (
    <DateRangePicker
      className="graphDatePicker"
      value={dateRange}
      onChange={(d) => setDateRange(d!)}
      cleanable={false}
      showOneCalendar
      placeholder="Select date range"
      ranges={predefinedRanges}
      shouldDisableDate={(d) => d > new Date()}
    />
  );

  if (isLoading) return <ChartDatePicker />;
  if (error) return <ErrorMessage message="fetching the data" />;

  const labels = Object.keys(data.reactions);
  const points = {
    labels,
    datasets: Object.keys(data.emojis).map((emoji) => ({
      label: data.emojis[emoji],
      data: Object.values(data.reactions).map((r) => r.cumulative[emoji]),
    })),
  };

  return (
    <>
      <ChartDatePicker />
      <Line
        options={{
          responsive: true,
          plugins: {
            title: { display: true, text: "Cumulative reactions over time" },
            legend: {
              labels: {
                boxWidth: 10,
                boxHeight: 0,
                font: { size: 20 },
              },
            },
          },
          scales: {
            y: {
              ticks: { stepSize: 1 },
              title: { display: true, text: "Cumulative no. of reactions" },
            },
            x: {
              adapters: {
                type: "time",
                date: { locale: enGB },
                time: { parser: "yyyy-MM-dd", unit: "month" },
              },
              title: { display: true, text: "Date" },
            },
          },
        }}
        data={points}
      />
    </>
  );
}

export default function PageGraphModal({
  open,
  site,
  pageId,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
  site: DashboardSite;
  pageId: string;
}) {
  const [tab, setTab] = useState("overTime");

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>
          {site.hostname}: {pageId}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Nav appearance="subtle" activeKey={tab} onSelect={setTab}>
          <Nav.Item eventKey="overTime">Reactions over time</Nav.Item>
          <Nav.Item eventKey="perDay">Reactions per day</Nav.Item>
        </Nav>
        {tab === "overTime" && <LineChart siteId={site.id} pageId={pageId} />}
        {tab === "perDay" && <BarChart siteId={site.id} pageId={pageId} />}
      </Modal.Body>
    </Modal>
  );
}

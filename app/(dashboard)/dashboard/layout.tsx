import "rsuite/dist/rsuite.min.css";
import "@/app/globals.css";
import "./dashboard.css";
import Header from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

import "rsuite/dist/rsuite.min.css";
import "@/app/globals.css";
import Header from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header title="" />
      {children}
    </>
  );
}

import "rsuite/dist/rsuite.min.css";
import "@/app/globals.css";
import "./blog.css";
import HeaderStatic from "@/components/HeaderStatic";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderStatic />
      {children}
    </>
  );
}

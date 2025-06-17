
import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className={`flex flex-col min-h-screen ${className || ''}`}>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export const PageContainer = ({ children, className }: LayoutProps) => {
  return (
    <div className={`container mx-auto px-4 py-8 ${className || ''}`}>
      {children}
    </div>
  );
};

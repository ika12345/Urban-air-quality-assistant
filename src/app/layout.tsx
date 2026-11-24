import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#f7f8f7] text-stone-950">{children}</div>;
}

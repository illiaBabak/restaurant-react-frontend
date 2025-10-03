import { JSX } from "react";
import { Header } from "src/components/Header";
import { SideBar } from "src/components/SideBar";

export const Admin = (): JSX.Element => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <SideBar />
    </div>
  );
};

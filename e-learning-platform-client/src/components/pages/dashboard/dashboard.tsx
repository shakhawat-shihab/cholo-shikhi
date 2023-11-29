import React from "react";
import Sidebar from "./sidebar/sidebar";
import { Outlet } from "react-router-dom";

type Props = {};

export default function Dashboard({}: Props) {
  return (
    <div className="flex ">
      <div className="lg:block hidden mt-6 ms-4">
        <Sidebar />
      </div>
      <div className="w-full ms-6 mt-4 me-6 rounded-md">
        <Outlet />
      </div>
    </div>
  );
}

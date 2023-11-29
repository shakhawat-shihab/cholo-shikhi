import { Breadcrumbs } from "@material-tailwind/react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

type Props = {
  imgLink: string;
  links: {
    link: string;
    label: string;
  }[];
};

export default function TopBanner({ imgLink, links }: Props) {
  const location = useLocation();
  console.log("location?.pathname", location);

  // const locationArr = location?.pathname?.trim()?.split("/");

  // console.log("locationArr", locationArr);
  // locationArr.shift();

  return (
    <div className="relative">
      <img
        className="h-96 w-full  object-cover object-center"
        src={imgLink}
        alt="nature image"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2">
        <Breadcrumbs>
          <Link to="/home" className="opacity-60">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </Link>

          {/* {locationArr?.map((x, index) => (
            <Link to="">{x}</Link>
          ))} */}
          {links?.map((x, index) => (
            <Link key={index} to={x?.link}>
              {x?.label}
            </Link>
          ))}
        </Breadcrumbs>
      </div>
    </div>
  );
}

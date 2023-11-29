import React from "react";

type Props = {};

import "./footerBanner.scss";

export default function FooterBanner({}: Props) {
  return (
    <div className="instructor-banner">
      <div className="opacity opacity-one">
        <div className="container">
          <h4>Become An Instructor</h4>
          <h2>Spread Your Skills Worldwide </h2>
          <a href="#" className="tran3s hvr-trim">
            Get Started Now
          </a>
        </div>
      </div>
    </div>
  );
}

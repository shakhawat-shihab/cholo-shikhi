import React from "react";
import "./loader.scss";
const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-container py-24">
        <div className="containerss">
          <div className="loader">
            <div className="loader--dot"></div>
            <div className="loader--dot"></div>
            <div className="loader--dot"></div>
            <div className="loader--dot"></div>
            <div className="loader--dot"></div>
            <div className="loader--dot"></div>
            <div className="loader--text my-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;

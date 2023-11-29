import React, { useEffect, useRef, useState } from "react";
import "./pageNumber.scss";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";

type Props = {
  pages: number;
  selectPageNumber: (page: number) => void;
  currentPage: number;
};

export default function PageNumber({
  pages,
  selectPageNumber,
  currentPage,
}: Props) {
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousButtonRef = useRef<HTMLButtonElement | null>(null);
  const [pageArr, setPageArr] = useState<number[]>([]);

  console.log(pages);

  useEffect(() => {
    let pageNumberLength = 5;
    const lowerBound = Math.max(
      1,
      currentPage - Math.ceil(pageNumberLength / 2)
    );
    const upperBound = Math.min(
      pages,
      currentPage + Math.floor(pageNumberLength / 2)
    );

    const range = [];
    for (let i = lowerBound; i <= upperBound; i++) {
      range.push(i);
    }

    while (range.length < pageNumberLength && range[0] > 1) {
      range.unshift(range[0] - 1);
    }

    while (range.length < pageNumberLength && range[range.length - 1] < pages) {
      range.push(range[range.length - 1] + 1);
    }

    setPageArr(range);
  }, [pages, currentPage]);

  useEffect(() => {
    if (currentPage + 1 > pages) {
      nextButtonRef.current?.setAttribute("disabled", "true");
    } else {
      nextButtonRef.current?.removeAttribute("disabled");
    }
  }, [nextButtonRef, pageArr, currentPage]);

  useEffect(() => {
    if (currentPage - 1 <= 0) {
      previousButtonRef.current?.setAttribute("disabled", "true");
    } else {
      previousButtonRef.current?.removeAttribute("disabled");
    }
  }, [previousButtonRef, pageArr, currentPage]);

  // console.log(pageArr);

  return (
    <div className="page-number-container">
      <button
        onClick={() => {
          selectPageNumber(currentPage - 1);
        }}
        className="page-btn"
        ref={previousButtonRef}
      >
        <SlArrowLeft />
      </button>

      {pageArr.map((x) => (
        <button
          key={x}
          className={`${x == currentPage && "active-page "} page-btn`}
          onClick={() => selectPageNumber(x)}
        >
          {x}
        </button>
      ))}

      <button
        className="page-btn"
        onClick={() => {
          selectPageNumber(currentPage + 1);
        }}
        ref={nextButtonRef}
      >
        <SlArrowRight />
      </button>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import useCourseHook from "../../../hooks/course/useCourseHook";
import IconedInputBox from "../../molecules/iconedInput/iconedInputBox";
import { RiSearch2Fill, RiSearchEyeLine } from "react-icons/ri";
import {
  Button,
  Drawer,
  IconButton,
  Input,
  Spinner,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import InputBox from "../../atoms/input/inputBox";
import TopBanner from "../../organisms/topBanner/topBanner";
import PageNumber from "../../organisms/pageNumber/pageNumber";
import FullScreenMessage from "../../organisms/fullScreenMessage/fullScreenMessage";
import CustommSpinner from "../../organisms/spinner/spinner";
import CourseCard from "../../organisms/courseCard/courseCard";
import CourseFiltering from "../../organisms/courseFiltering/courseFiltering";
import { useSelector } from "react-redux";
import { ShoppingBagIcon } from "@heroicons/react/24/solid";

export default function Courses() {
  const [search, setSearch] = useState("");
  // const navigate = useNavigate();
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const { settings } = useSelector((state: any) => state);

  const { courses, loadAllCourses, isLoadingCourse } = useCourseHook();

  useEffect(() => {
    let queryParams: {
      search?: string;
      page?: number;
      category?: string[];
      sortParam?: string;
      sortOrder?: string;
      difficulty?: string;
    } = {};

    if (search) {
      queryParams.search = search;
    }
    if (settings.category) {
      queryParams.category = settings.category;
    }
    if (settings.sortParam) {
      queryParams.sortParam = settings.sortParam;
    }
    if (settings.sortOrder) {
      queryParams.sortOrder = settings.sortOrder;
    }

    queryParams.page = currentPage;

    // console.log("search & setting ---- ", queryParams);
    loadAllCourses(queryParams);

    // const timeOutFunc = setTimeout(() => {
    //   loadAllCourses(queryParams);
    // }, 3000);
    // return () => clearTimeout(timeOutFunc);
  }, [search, settings, currentPage]);

  useEffect(() => {
    // let queryParams: {
    //   search?: string;
    //   page?: number;
    //   category?: string[];
    //   sortParam?: string;
    //   sortOrder?: string;
    //   difficulty?: string;
    // } = {};
    // if (search) {
    //   queryParams.search = search;
    // }
    // if (settings.category) {
    //   queryParams.category = settings.category;
    // }
    // if (settings.sortParam) {
    //   queryParams.sortParam = settings.sortParam;
    // }
    // if (settings.sortOrder) {
    //   queryParams.sortOrder = settings.sortOrder;
    // }
    // queryParams.page = currentPage;
    // loadAllCourses(queryParams);
  }, [currentPage]);

  // console.log("courses ", courses);
  // console.log("search ", search);
  // console.log("pages ", pages);

  useEffect(() => {
    console.log("count limit ", courses?.count, courses?.limit);
    // ei line ta add korc..... notun vabe --------------------------------------------------------------------------------------
    if (courses?.total && courses?.count == 0) {
      setCurrentPage(1);
    }
    courses?.count && setPages(Math.ceil(courses?.total / courses?.limit));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [courses]);

  const selectPageNumber = (page: number) => {
    setCurrentPage(page);
  };

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeOutFunc = setTimeout(() => {
      setSearch(e.target.value);
      setCurrentPage(1);
    }, 3000);
    return () => clearTimeout(timeOutFunc);
  };

  const arr = [
    {
      link: "/courses",
      label: "Courses",
    },
  ];

  const [open, setOpen] = React.useState(false);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  return (
    <div>
      {/* <TopBanner
        imgLink={`https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80`}
        links={arr}
      /> */}

      <div className=" md:hidden fixed top-1/2 z-50 border-red-800">
        <Button onClick={openDrawer}>
          <ShoppingBagIcon />{" "}
        </Button>
      </div>

      {/* <CourseFilteringDrawer
        openDrawer={openDrawer}
        closeDrawer={closeDrawer}
        open={open}
      /> */}

      <div className="">
        <Typography variant="h2" className="text-center my-2">
          Courses
        </Typography>
        <div className="flex justify-between items-center bg-white max-w-screen-sm mx-auto ps-6 pe-3 py-2">
          <input
            type="text"
            placeholder="Enter text to search course"
            className="outline-none rounded w-full"
            onChange={(e) => onChangeSearch(e)}
          />
          <div className=" ">
            <RiSearchEyeLine size={25} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 my-12 container mx-auto">
        <div className=" hidden md:block  md:col-span-3  bgz-blue-gray-600 border-e-2 border-gray-900 pe-4">
          <CourseFiltering />
        </div>
        <div className=" ms-4 md:ms-0 mx-2 col-span-12 md:col-span-9  ">
          {isLoadingCourse ? (
            <div className="h-screen flex justify-center items-center  ">
              <CustommSpinner className="h-16 w-16" />
            </div>
          ) : (
            <div>
              {courses?.courses?.length ? (
                <div className="grid grid-cols-12 gap-4">
                  {courses?.courses?.map((x) => (
                    <CourseCard key={x?._id} props={x} />
                  ))}
                </div>
              ) : (
                <FullScreenMessage message="No Course Found" />
              )}
            </div>
          )}

          {courses?.courses?.length ? (
            <div className="my-5">
              <PageNumber
                selectPageNumber={selectPageNumber}
                pages={pages}
                currentPage={currentPage}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

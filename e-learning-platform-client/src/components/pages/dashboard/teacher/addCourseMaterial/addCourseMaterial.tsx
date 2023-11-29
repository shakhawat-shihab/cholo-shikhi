import React, { useState } from "react";
import {
  MdAssignment,
  MdDocumentScanner,
  MdFormatListBulleted,
  MdPlayLesson,
} from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import UpdateCourse from "./updateCourse/updateCourse";
import { BsQuestion } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { PiExam } from "react-icons/pi";

type Props = {};

export default function AddCourseMaterial({}: Props) {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = React.useState(1);

  return (
    <div className=" flex justify-center items-center  ">
      <div className=" bg-white w-full  p-2 sm:p-8 md:p-10 shadow-lg rounded-md my-2">
        <div className="py-3">
          <Tabs value={activeTab}>
            <TabsHeader
              className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
              indicatorProps={{
                className:
                  "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
              }}
            >
              <Tab
                key={1}
                value={1}
                onClick={() => setActiveTab(1)}
                className={activeTab === 1 ? "text-gray-900" : ""}
              >
                Add Material
              </Tab>
              <Tab
                key={2}
                value={2}
                onClick={() => setActiveTab(2)}
                className={activeTab === 2 ? "text-gray-900" : ""}
              >
                Update Course
              </Tab>
            </TabsHeader>
            <TabsBody>
              <TabPanel key={1} value={1}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8">
                  {/* modules */}
                  <Link
                    to={`/teacher/dashboard/manage-module/${courseId}`}
                    className=" shadow-lg flex flex-col items-center justify-center rounded hover:scale-105 ease-in-out hover:border hover:border-zinc-800 h-44"
                  >
                    <MdPlayLesson
                      size={30}
                      className="w-8 h-8 text-indigo-500"
                    />
                    <p className="text-slate-200 mt-3 ">Manage Modules</p>
                  </Link>

                  {/* content */}
                  <Link
                    to={`/teacher/dashboard/manage-content/${courseId}`}
                    className=" shadow-lg flex flex-col items-center justify-center rounded hover:scale-105 ease-in-out hover:border hover:border-zinc-800 h-44"
                  >
                    <MdDocumentScanner
                      size={30}
                      className="w-8 h-8 text-indigo-500"
                    />
                    <p className="text-slate-200 mt-3">Manage Content</p>
                  </Link>

                  {/* quiz */}
                  <Link
                    to={`/teacher/dashboard/manage-quiz/${courseId}`}
                    className=" shadow-lg flex flex-col items-center justify-center rounded hover:scale-105 ease-in-out hover:border hover:border-zinc-800 h-44"
                  >
                    <MdFormatListBulleted
                      size={30}
                      className="w-8 h-8 text-indigo-500"
                    />
                    <p className="text-slate-200 mt-3 ">Create Quizzes</p>
                  </Link>

                  {/* question */}
                  {/* <Link
                    to={`/teacher/dashboard/manage-question/${courseId}`}
                    className=" shadow-lg flex flex-col items-center justify-center rounded hover:scale-105 ease-in-out hover:border hover:border-zinc-800 h-44"
                  >
                    <BsQuestion size={30} className="w-8 h-8 text-indigo-500" />
                    <p className="text-slate-200 mt-3 ">Add Question</p>
                  </Link> */}

                  {/* Assignment */}
                  <Link
                    to={`/teacher/dashboard/manage-assignment/${courseId}`}
                    className=" shadow-lg flex flex-col items-center justify-center rounded hover:scale-105 ease-in-out hover:border hover:border-zinc-800 h-44"
                  >
                    <MdAssignment
                      size={30}
                      className="w-8 h-8 text-indigo-500"
                    />
                    <p className="text-slate-200 mt-3 ">Create Assignment</p>
                  </Link>

                  {/* Assign marks */}
                  <Link
                    to={`/teacher/dashboard/manage-assignment-marks/${courseId}`}
                    className=" shadow-lg flex flex-col items-center justify-center rounded hover:scale-105 ease-in-out hover:border hover:border-zinc-800 h-44"
                  >
                    <PiExam size={30} className="w-8 h-8 text-indigo-500" />
                    <p className="text-slate-200 mt-3 "> Assign Marks</p>
                  </Link>
                </div>
              </TabPanel>
              <TabPanel key={2} value={2}>
                <UpdateCourse setVal={setActiveTab} />
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

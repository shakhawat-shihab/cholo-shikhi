import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import React from "react";
import { Link } from "react-router-dom";
import TopBanner from "../../organisms/topBanner/topBanner";
import EnrolledCourses from "./enrolledCourses/enrolledCourses";
import CompletedCourses from "./completedCourses/completedCourses";
import ReviewModal from "../../organisms/reviewModal/reviewModal";

type Props = {};

export default function MyCourse({}: Props) {
  const [activeTab, setActiveTab] = React.useState(1);
  const arr = [
    {
      link: "/my-course",
      label: "My Course",
    },
  ];
  // const [reviewCourse, setReviewCourse] = React.useState(false);
  // const [courseId, setCourseId] = React.useState("");
  // const handleReviewOpen = (id: string) => {
  //   setReviewCourse(!reviewCourse);
  //   setCourseId(id);
  // };
  return (
    <div>
      {/* <TopBanner
        imgLink={`https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80`}
        links={arr}
      /> */}
      {/* <ReviewModal
        reviewCourse={reviewCourse}
        handleReviewOpen={handleReviewOpen}
        courseId={courseId}
      /> */}
      <div className="container mx-auto my-20">
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
              Enrolled Courses
            </Tab>
            <Tab
              key={2}
              value={2}
              onClick={() => setActiveTab(2)}
              className={activeTab === 2 ? "text-gray-900" : ""}
            >
              Completed Courses
            </Tab>
          </TabsHeader>
          <TabsBody>
            <TabPanel key={1} value={1}>
              <EnrolledCourses />
            </TabPanel>
            <TabPanel key={2} value={2}>
              <CompletedCourses
              // handleReviewOpen={handleReviewOpen}
              />
            </TabPanel>
          </TabsBody>
        </Tabs>
      </div>
    </div>
  );
}

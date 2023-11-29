import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import React from "react";
import { useSelector } from "react-redux";
import CourseContent from "../courseContent/courseContent";
import Review from "../reviews/review";
import CourseOverview from "../courseOverview/courseOverview";
import { CourseDetails } from "../../../types/course.type";
import Forum from "../forum/forum";

type Props = {
  courseDetails?: CourseDetails;
};

export default function CourseDetailsSection({ courseDetails }: Props) {
  const [activeTab, setActiveTab] = React.useState(1);
  const user = useSelector((state: any) => state?.auth?.userData);
  return (
    <div className="max-h-96 overflow-y-scroll shhhhhhhhhhhhhhhhhhhihab">
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
            Overview
          </Tab>
          <Tab
            key={2}
            value={2}
            onClick={() => setActiveTab(2)}
            className={activeTab === 2 ? "text-gray-900" : ""}
          >
            Content
          </Tab>
          <Tab
            key={3}
            value={3}
            onClick={() => setActiveTab(3)}
            className={activeTab === 3 ? "text-gray-900" : ""}
          >
            Review
          </Tab>
          <Tab
            key={4}
            value={4}
            onClick={() => setActiveTab(4)}
            className={activeTab === 4 ? "text-gray-900" : ""}
          >
            Forum
          </Tab>
        </TabsHeader>
        <TabsBody className="">
          <TabPanel key={1} value={1}>
            <CourseOverview courseDetails={courseDetails} />
          </TabPanel>
          <TabPanel key={2} value={2}>
            <CourseContent
              courseTeacherRef={courseDetails?.userDetails?.teacherRef}
            />
          </TabPanel>
          <TabPanel key={3} value={3}>
            <Review />
          </TabPanel>
          <TabPanel key={4} value={4}>
            <Forum />
          </TabPanel>
        </TabsBody>
      </Tabs>
    </div>
  );
}

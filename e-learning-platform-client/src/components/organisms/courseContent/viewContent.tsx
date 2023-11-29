import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import React, { useEffect } from "react";
import useContentHook from "../../../hooks/content/useContentHook";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";

type Props = {
  viewContent?: boolean;
  type: string;
  contentId: string;
  handleContentOpen: () => void;
  courseTeacherRef?: string;
};

export default function ViewContent({
  courseTeacherRef,
  viewContent = false,
  handleContentOpen,
  contentId,
}: Props) {
  const {
    loadContentByIdGeneral,
    loadContentByIdAdmin,
    content,
    loadContentByIdTeacher,
    isForbidden,
  } = useContentHook();

  const user = useSelector((state: any) => state.auth.userData);

  useEffect(() => {
    if (user?.role == "teacher" && contentId) {
      if (
        user?.userRef?.teacherRef &&
        courseTeacherRef == user?.userRef?.teacherRef
      ) {
        // current teacher is the teacher of this course
        loadContentByIdTeacher({
          contentId,
          teacherRef: user?.userRef?.teacherRef,
        });
      } else {
        // current teacher is not the teacher of this course
        loadContentByIdGeneral({ contentId });
      }
    } else if (user?.role == "admin" && contentId) {
      console.log("admin...");
      loadContentByIdAdmin({
        contentId,
      });
    } else {
      loadContentByIdGeneral({
        contentId,
      });
    }
    // if(user?.userRef?.teacheRef===)
  }, [contentId]);

  // console.log("content ================ ", content);
  // console.log(
  //   "content?.videoDetails?.videoUrl ================ ",
  //   content?.videoDetails?.videoUrl
  // );

  // useEffect(() => {
  //   console.log("isForbidden    -----   ", isForbidden);
  //   console.log("content    -----   ", content);
  // }, [content]);

  return (
    <div>
      <Dialog
        open={viewContent}
        handler={handleContentOpen}
        className="opacity-40 min-h-full"
      >
        <DialogHeader>
          <Button onClick={handleContentOpen}>Close</Button>
        </DialogHeader>
        <DialogBody className="h-full">
          <div>
            {isForbidden == true ? (
              <div className="flex justify-center items-center">
                Sorry this content is not accessible
              </div>
            ) : (
              <>
                {content && content.type == "video" && (
                  <ReactPlayer
                    url={content?.videoDetails?.videoUrl}
                    controls={true}
                    config={{
                      youtube: {
                        playerVars: { showinfo: 1 },
                      },
                      facebook: {
                        appId: "12345",
                      },
                    }}
                    width="100%"
                    height="100%"
                    className="p-1"
                  />
                )}
                {content && content.type == "document" && (
                  <object
                    data={content?.documentDetails?.fileUrl}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                  >
                    <p>
                      Alternative text - include a link{" "}
                      <a href={content?.documentDetails?.fileUrl}>
                        to the PDF!
                      </a>
                    </p>
                  </object>
                )}

                {content && content.type == "text" && (
                  <div>{content?.textDetails?.text}</div>
                )}
              </>
            )}
          </div>
        </DialogBody>
      </Dialog>
    </div>
  );
}

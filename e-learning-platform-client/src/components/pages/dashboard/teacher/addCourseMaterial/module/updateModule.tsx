import React, { useEffect } from "react";
import useModuleHook from "../../../../../../hooks/module/useModuleHook";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

type Props = {};

export default function UpdateModule({}: Props) {
  const user = useSelector((state: any) => state.auth.userData);
  const { courseId } = useParams();

  const { loadModuleWithoutDetail, modules } = useModuleHook();

  useEffect(() => {
    courseId &&
      loadModuleWithoutDetail({
        courseId,
        teacherRef: user?.userRef?.teacherRef,
      });
  }, []);

  console.log("modules -- ", modules);

  // eikhane sb module load koraite hobe///////////////////////////////////////////////////////////////

  // console.log("modules (UpdateModule)     ", modules);
  return (
    <div>
      {modules?.map((x: any) => (
        <div>
          {" "}
          <h2>{x?.title}</h2>{" "}
        </div>
      ))}
    </div>
  );
}

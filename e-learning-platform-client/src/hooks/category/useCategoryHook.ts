import { useEffect, useState } from "react";
import courseApi from "../../api/courseApi";
import { toast } from "react-toastify";
import { category, courseCreate } from "../../utils/types";
import categoryApi from "../../api/categoryApi";

const useCategoryHook = () => {
  const [categories, setCategories] = useState<category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const loadAllCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const res = await categoryApi.loadcategory();
      // console.log(res?.data);
      setCategories(res?.data?.data);
      // toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load courses";
      }
      // setCourses([]);
      setCategories([]);
      // toast.error(message);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const createCategory = async (data: courseCreate) => {
    setIsLoadingCategories(true);
    try {
      const res = await courseApi.createCourse(data);
      console.log("res ", res);
      toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to create category";
      }
      toast.error(message);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadAllCategories();
  }, []);

  return {
    categories,
    isLoadingCategories,
    loadAllCategories,
    createCategory,
  };
};

export default useCategoryHook;

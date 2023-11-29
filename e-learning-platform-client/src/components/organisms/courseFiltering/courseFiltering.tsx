import {
  Card,
  Checkbox,
  List,
  ListItem,
  ListItemPrefix,
  Radio,
  Typography,
} from "@material-tailwind/react";
import React, {
  useRef,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import useCategoryHook from "../../../hooks/category/useCategoryHook";
import { useDispatch } from "react-redux";
import {
  addCategory,
  addDifficulty,
  removeCategory,
  removeDifficulty,
  setSortingOrder,
  setSortingParam,
} from "../../../redux/slices/settingsSlice";

type Props = {
  // selectedCategories: string[];
  // changeCategory: (categories: string[]) => void;
};

export default function CourseFiltering({}: Props) {
  const { categories } = useCategoryHook();
  const dispatch = useDispatch();

  const difficulty = [
    { label: "Basic", value: "basic" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advance", value: "advance" },
  ];

  const [sortOrder, setSortOrder] = useState("asc");
  const sortOptions = [
    { label: "Ascending", value: "asc" },
    { label: "Descending", value: "desc" },
  ];

  const [sortParam, setSortParam] = useState("createdAt");
  const paramOptions = [
    { label: "Create", value: "createdAt" },
    { label: "Rating", value: "rating" },
    { label: "Title", value: "title" },
  ];

  const handleCategorySelect = (e: any) => {
    if (e.target.checked) {
      dispatch(addCategory(e.target.value));
    } else {
      dispatch(removeCategory(e.target.value));
    }
  };

  const handleDifficultySelect = (e: any) => {
    // console.log(e.target.value);
    if (e.target.checked) {
      dispatch(addDifficulty(e.target.value));
    } else {
      dispatch(removeDifficulty(e.target.value));
    }
  };

  const handleParamChange = (e: any) => {
    console.log("handleParamChange ", e.target.value);
    setSortParam(e.target.value);
    dispatch(setSortingParam(e.target.value));
  };

  const handleOrderChange = (e: any) => {
    // console.log("order select ", e.target.value);
    setSortOrder(e.target.value);
    dispatch(setSortingOrder(e.target.value));
  };

  // console.log(categories);

  return (
    <div className="w-full">
      {/* sort  param*/}
      <Card className="py-2 mb-2">
        <p className="text-center">Sort Parameter</p>
        <List className="min-w-fit">
          {paramOptions?.map((x) => (
            <ListItem className="p-0 min-w-fit" ripple={false}>
              <label
                htmlFor={x.label}
                className="flex w-full cursor-pointer  items-center px-1 py-2"
              >
                <ListItemPrefix className="mr-3">
                  <Radio
                    crossOrigin={true}
                    name="sortParam"
                    id={x.label}
                    ripple={false}
                    className="hover:before:opacity-0"
                    containerProps={{
                      className: "p-0",
                    }}
                    onChange={handleParamChange}
                    value={x.value}
                  />
                </ListItemPrefix>
                <Typography
                  color="blue-gray"
                  className="font-medium text-blue-gray-400 text-sm "
                >
                  {x?.label}
                </Typography>
              </label>
            </ListItem>
          ))}
        </List>
      </Card>

      {/* sort  order*/}
      <Card className="py-2 mb-2">
        <p className="text-center">Sort Order</p>
        <List className=" m-0 min-w-fit">
          {sortOptions?.map((x) => (
            <ListItem className="p-0">
              <label
                htmlFor={x.label}
                className="flex w-full cursor-pointer items-center px-1 py-2"
              >
                <ListItemPrefix className="mr-3">
                  <Radio
                    crossOrigin={true}
                    name="sortOrder"
                    id={x.label}
                    ripple={false}
                    className="hover:before:opacity-0"
                    containerProps={{
                      className: "p-0",
                    }}
                    onChange={handleOrderChange}
                    value={x.value}
                  />
                </ListItemPrefix>
                <Typography
                  color="blue-gray"
                  className="font-medium text-blue-gray-400 text-sm"
                >
                  {x?.label}
                </Typography>
              </label>
            </ListItem>
          ))}
        </List>
      </Card>

      {/* category */}
      <Card className="py-2 mb-2">
        <p className="text-center">Category</p>
        <List className="min-w-fit">
          {categories?.map((x) => (
            <ListItem className="p-0 ">
              <label
                htmlFor={x?._id}
                className="flex w-full cursor-pointer items-center px-1 py-2"
              >
                <ListItemPrefix className="mr-3">
                  <Checkbox
                    crossOrigin={true}
                    id={x?._id}
                    ripple={false}
                    className="hover:before:opacity-0"
                    containerProps={{
                      className: "p-0",
                    }}
                    value={x?._id}
                    onClick={(e) => handleCategorySelect(e)}
                  />
                </ListItemPrefix>
                <Typography color="blue-gray" className="text-sm">
                  {x?.title}
                </Typography>
              </label>
            </ListItem>
          ))}
        </List>
      </Card>

      {/* difficulty */}
      <Card className="py-2 mb-2">
        <p className="text-center">Difficulty</p>
        <List className="min-w-fit">
          {difficulty?.map((x) => (
            <ListItem className="p-0">
              <label
                htmlFor={x?.value}
                className="flex w-full cursor-pointer items-center px-1 py-2"
              >
                <ListItemPrefix className="mr-3">
                  <Checkbox
                    crossOrigin={true}
                    id={x.value}
                    ripple={false}
                    className="hover:before:opacity-0"
                    containerProps={{
                      className: "p-0",
                    }}
                    value={x?.value}
                    onClick={(e) => handleDifficultySelect(e)}
                  />
                </ListItemPrefix>
                <Typography color="blue-gray" className="text-sm">
                  {x?.label}
                </Typography>
              </label>
            </ListItem>
          ))}
        </List>
      </Card>
    </div>
  );
}

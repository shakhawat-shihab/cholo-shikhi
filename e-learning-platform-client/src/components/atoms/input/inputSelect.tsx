import React from "react";

type Props = {
  className?: string;
  type: string;
  placeholder?: string;
  autoComplete?: string;
  name?: string;
  id?: string;
  iconPosition?: "left" | "right";
  showText?: boolean;
  field?: any;
  options: {
    title: string;
    _id?: string;
  }[];
  defaultOption?: string;
  // handleOnChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function InputSelect({
  name,
  id,
  className,
  type,
  placeholder,
  autoComplete,
  iconPosition,
  field,
  options,
  defaultOption,
}: // handleOnChange,
Props) {
  // console.log(options);
  return (
    <select
      //   onChange={onOptionChangeHandler}
      id={id}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      name={name}
      className={`${className}  
      ${iconPosition == "left" && "ps-10"} ${iconPosition == "right" && "pe-10"}
      g-inherit text-sm text-gray-800 capitalize  ms-2 `}
      {...field}
      // onChange={(e) => handleOnChange && handleOnChange(e)}
    >
      {defaultOption && <option>Please select category</option>}
      {options?.map((option, index) => {
        return (
          <option
            key={option?.title}
            value={option?._id ? option?._id : option?.title}
            className="text-sm text-gray-800 capitalize"
            // {
            //   index==0 &&  "selected"
            // }
            selected={index == 0 ? true : false}
          >
            {option?.title}
          </option>
        );
      })}
    </select>
  );
}

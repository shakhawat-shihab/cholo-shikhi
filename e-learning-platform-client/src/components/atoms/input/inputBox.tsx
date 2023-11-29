import React from "react";

type Props = {
  className?: string;
  type: string;
  placeholder?: string;
  autoComplete?: string;
  name?: string;
  id?: string;
  defaultVal?: string;
  iconPosition?: "left" | "right";
  showText?: boolean;
  field?: any;
  handleOnChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function InputBox({
  name,
  id,
  className,
  type,
  placeholder,
  autoComplete,
  iconPosition,
  showText,
  field,
  handleOnChange,
  defaultVal,
}: Props) {
  return (
    <input
      id={id}
      type={`${showText == false ? "password" : type}`}
      placeholder={placeholder}
      autoComplete={autoComplete}
      name={name}
      className={`${className}  
        ${iconPosition == "left" && "pl-10"} 
        ${iconPosition == "right" && "pr-10"}
        ${type == "file" && "mt-4"}
        `}
      onChange={(e) => handleOnChange && handleOnChange(e)}
      {...field}
      defaultValue={defaultVal}
    />
  );
}

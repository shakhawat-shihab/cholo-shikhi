import React from "react";

type Props = {
  className?: string;
  type: string;
  placeholder?: string;
  autoComplete?: string;
  name?: string;
  id?: string;
  defaultVal?: string;
  field?: any;
  handleOnChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function TextBox({
  name,
  id,
  className,
  type,
  placeholder,
  autoComplete,
  field,
  handleOnChange,
  defaultVal,
}: Props) {
  return (
    <textarea
      id={id}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      name={name}
      className={`${className}  `}
      onChange={(e) => handleOnChange && handleOnChange(e)}
      {...field}
      defaultValue={defaultVal}
    />
  );
}

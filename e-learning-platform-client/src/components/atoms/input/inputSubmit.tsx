import React from "react";

type Props = {
  className?: string;
  name?: string;
  id?: string;
  field?: any;
  value: string;
  disabled?: boolean;
};

export default function InputSubmit({
  name,
  id,
  className,
  field,
  value,
  disabled,
}: Props) {
  return (
    <input
      id={id}
      type="submit"
      name={name}
      className={`${className} cursor-pointer`}
      value={value}
      disabled={disabled ? true : false}
    />
  );
}

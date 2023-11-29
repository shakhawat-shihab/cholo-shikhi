import React, { useState } from "react";
import Label from "../../atoms/label/label";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import InputSelect from "../../atoms/input/inputSelect";

type Props = {
  className?: string;
  type: string;
  placeholder?: string;
  autoComplete?: string;
  name?: string;
  id?: string;
  iconPosition: "left" | "right";
  children: React.ReactNode;
  labelText?: string;
  isPassword?: boolean;
  passwordIconSize?: number;
  field?: any;
  options: {
    title: string;
    _id?: string;
  }[];
};

export default function IconedInputSelect({
  name,
  id,
  className,
  type,
  placeholder,
  autoComplete,
  children,
  iconPosition,
  labelText,
  field,
  options,
}: Props) {
  return (
    <div className="relative">
      <div
        className={`inline-flex items-center justify-center absolute top-0 h-full w-10 text-gray-400  ${
          iconPosition == "left" ? "left-0" : "right-0"
        }  `}
      >
        <span>{children}</span>
      </div>

      <InputSelect
        autoComplete={autoComplete}
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        iconPosition={iconPosition}
        className={className}
        field={field}
        options={options}
      />

      <Label
        htmlFor={name}
        className={` ${iconPosition == "left" ? "left-10" : "left-0"}   
        absolute -top-4  text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 capitalize
         peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5  peer-focus:text-sm`}
      >
        {labelText}
      </Label>
    </div>
  );
}

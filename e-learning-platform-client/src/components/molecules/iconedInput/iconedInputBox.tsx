import React, { ChangeEvent, useState } from "react";
import InputBox from "../../atoms/input/inputBox";
import Label from "../../atoms/label/label";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";

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
  onInputChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function IconedInputBox({
  name,
  id,
  className,
  type,
  placeholder,
  autoComplete,
  children,
  iconPosition,
  labelText,
  isPassword,
  passwordIconSize,
  field,
  onInputChange,
}: Props) {
  const [showText, setShowText] = useState(true);
  return (
    <div className="relative">
      <div
        className={`inline-flex items-center justify-center absolute top-0 h-full w-10 text-gray-400  ${
          iconPosition == "left" ? "left-0" : "right-0"
        }  `}
      >
        <span>{children}</span>
      </div>

      <InputBox
        autoComplete={autoComplete}
        id={id}
        name={name}
        type={type}
        className={`${className} ${isPassword && "pr-10"}`}
        placeholder={placeholder}
        iconPosition={iconPosition}
        showText={showText}
        field={field}
        handleOnChange={onInputChange && onInputChange}
      />

      <Label
        htmlFor={name}
        className={` ${iconPosition == "left" ? "left-10" : "left-0"}   
        absolute -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 capitalize
         peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm`}
      >
        {labelText}
      </Label>

      {isPassword && (
        <div
          className={`inline-flex items-center justify-center absolute top-0 h-full w-10 text-gray-400 right-0 `}
          onClick={() => setShowText(!showText)}
        >
          <span>
            {showText ? (
              <BsFillEyeFill size={passwordIconSize} />
            ) : (
              <BsFillEyeSlashFill size={passwordIconSize} />
            )}
          </span>
        </div>
      )}
    </div>
  );
}

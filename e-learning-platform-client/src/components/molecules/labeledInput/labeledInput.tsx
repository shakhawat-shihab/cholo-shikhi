import React from "react";

type Props = {
  className?: string;
  type: string;
  placeholder?: string;
  name?: string;
  id?: string;
  field?: any;
  handleOnChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function LabeledInput({ field, id, type, placeholder }: Props) {
  return (
    <div className="w-full  px-3">
      <label
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        htmlFor={id}
      >
        Last Name
      </label>
      <input
        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        id={id}
        type={type}
        placeholder={placeholder}
        {...field}
      />
    </div>
  );
}

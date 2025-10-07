import { ChangeEvent, JSX } from "react";
import { capitalize } from "src/utils/capitalize";

type Props = {
  label: string;
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type: "text" | "email" | "number";
};

export const FormInput = ({
  label,
  value,
  placeholder,
  onChange,
  type,
}: Props): JSX.Element => (
  <div className="flex flex-col gap-2">
    <label htmlFor={label}>{capitalize(label)}</label>
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border-2 border-violet-300 rounded-md p-2 focus:outline-violet-500"
      type={type}
      id={label}
      min={1}
    />
  </div>
);

import { ChangeEvent, HTMLAttributes, JSX, KeyboardEvent } from "react";
import { capitalize } from "src/utils/capitalize";

type Props = {
  label: string;
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type: "text" | "email" | "number";
  onBlur?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  inputTestId?: string;
};

export const FormInput = ({
  label,
  value,
  placeholder,
  onChange,
  type,
  onBlur,
  onKeyDown,
  inputTestId,
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
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      data-testid={inputTestId}
    />
  </div>
);

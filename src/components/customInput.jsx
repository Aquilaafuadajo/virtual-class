import React from "react";
import { Controller } from "react-hook-form";

function CustomInput({
  placeholder,
  name,
  type,
  control,
  rules,
  errors,
  disabled,
}) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ onChange, onBlur, value }) => (
        <div className="flex flex-col text-[#4F4F4F] mb-3">
          <label htmlFor={name} className="text-xs font-bold capitalize mb-2">
            {name}
          </label>
          <input
            id={name}
            style={
              errors[name]?.message ? { border: "1px solid #ef4444" } : null
            }
            name={name}
            type={type}
            className="rounded px-3 py-2 border-2 text-sm"
            placeholder={placeholder}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            disabled={disabled}
          />
          {errors[name]?.message ? (
            <p className="text-xs text-red-500">{errors[name].message}</p>
          ) : (
            ""
          )}
        </div>
      )}
    />
  );
}

export default CustomInput;

import React from "react";
import { Controller } from "react-hook-form";

function CustomDropdown({ name, control, rules, errors, options }) {
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
          <select
            className="rounded px-3 py-2 border-2 text-sm"
            name={name}
            id={name}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
          >
            {options.map(({ value, label }) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
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

export default CustomDropdown;

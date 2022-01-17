import React from "react";

function Filter({ name, onChange, value, options }) {
  return (
    <div className="flex flex-col text-[#4F4F4F] mr-2">
      <select
        className="rounded px-3 py-2 border-2 text-sm"
        name={name}
        id={name}
        onChange={onChange}
        value={value}
      >
        {options.map(({ value: optionValue, label }) => (
          <option value={optionValue} key={optionValue}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Filter;

import React, { useState } from "react";

function Input({
  value,
  type,
  placeholder,
  setUserData,
  field,
  icon,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      {/* Left Icon */}
      <i
        className={`fi ${icon} absolute top-1/2 -translate-y-1/2 left-3 text-white`}
      ></i>

      {/* Input */}
      <input
        type={
          type !== "password"
            ? type
            : showPassword
            ? "text"
            : "password"
        }
        value={value}
        placeholder={placeholder}
        className="w-full h-8 px-10 text-white bg-gray-500 rounded-md"
        onChange={(e) => {
          setUserData((prev) => ({
            ...prev,
            [field]: e.target.value,
          }));
        }}
      />

      {/* Password Visibility Toggle */}
      {type === "password" && (
        <i
          onClick={() => setShowPassword((prev) => !prev)}
          className={`fi ${
            showPassword ? "fi-sr-eye" : "fi-sr-eye-crossed"
          } absolute top-1/2 -translate-y-1/2 right-3 text-white cursor-pointer`}
        ></i>
      )}
    </div>
  );
}

export default Input;
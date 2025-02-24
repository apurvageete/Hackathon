import React from "react";

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input className="p-2 border rounded w-full" {...props} />
);

import React from "react";

export const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className="p-2 border rounded w-full" {...props} />
);

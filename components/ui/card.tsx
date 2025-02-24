import React from "react";

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 border rounded-lg shadow ${className}`}>{children}</div>
);

export const CardContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

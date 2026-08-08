import { HTMLAttributes } from "react";

export default function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`bg-bg-2 border border-border rounded-xl ${className}`} {...props} />;
}

import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary: "bg-violet text-white hover:bg-violet-bright",
  secondary: "border border-border text-text hover:border-text-dim",
  ghost: "text-text-dim hover:text-text",
  danger: "bg-red/10 text-red border border-red/30 hover:bg-red/20",
};

const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(({ variant = "primary", className = "", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 font-medium text-sm px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    />
  );
});
Button.displayName = "Button";
export default Button;

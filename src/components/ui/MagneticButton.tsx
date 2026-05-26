import { forwardRef, type ButtonHTMLAttributes } from "react";
import { useMagnetic } from "../../hooks/useMagnetic";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "ghost";
  strength?: number;
};

export const MagneticButton = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "solid", strength = 0.3, className = "", children, ...rest }, _ref) => {
    const mag = useMagnetic<HTMLButtonElement>(strength);
    const base =
      "inline-flex items-center justify-center gap-2 px-6 py-3 text-sm tracking-wide uppercase will-change-transform select-none cursor-pointer";
    const styles =
      variant === "solid"
        ? "bg-ink text-paper hover:bg-ink/90"
        : variant === "outline"
          ? "border border-ink text-ink hover:bg-ink hover:text-paper"
          : "text-ink hover:text-accent";
    return (
      <button ref={mag} className={`${base} ${styles} ${className}`} {...rest}>
        <span className="pointer-events-none">{children}</span>
      </button>
    );
  },
);
MagneticButton.displayName = "MagneticButton";

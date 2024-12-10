import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../utils/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input backdrop-blur-[3px] text-white shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-white text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-white underline-offset-4 hover:underline",
        blur: "border border-input backdrop-blur-sm backdrop-filter shadow-sm hover:bg-accent hover:text-accent-foreground",
        menu: "bg-transparent",
        clipboard:
          "backdrop-blur-sm backdrop-filter rounded-none rounded-br-xs text-primary-foreground shadow hover:text-gray-600",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-6 rounded px-3",
        lg: "h-10 rounded px-8",
        icon: "h-9 w-9",
        sideMenu:
          "w-full rounded text-lg text-left flex items-center justify-start",
        clipboard: "h-6 w-6 mr-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../utils/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
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
        ghost:
          "text-foreground hover:bg-black hover:text-white dark:border dark:text-foreground hover:dark:bg-white hover:dark:text-black",
        link: "text-white underline-offset-4 hover:underline",
        blur: "border border-input backdrop-blur-sm backdrop-filter shadow-sm hover:bg-accent hover:text-accent-foreground",
        menu: "bg-transparent",
        clipboard:
          "rounded-none rounded-br-xs text-primary-foreground hover:text-gray-600",
        disabled: "text-stone-600 cursor-default",
        fit: "w-fit p-0 m-0",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-6 px-3",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
        sideMenu: "w-full text-lg text-left flex items-center justify-start",
        clipboard: "h-3 w-3 mr-0.5",
        fit: "m-0 p-0",
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

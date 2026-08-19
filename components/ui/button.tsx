import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
        data-size={size}
        data-variant={variant}
        data-state={props.disabled ? "disabled" : "enabled"}
        data-pressed={props.disabled ? "false" : "true"}
        data-hover={props.disabled ? "false" : "true"}
        data-focus={props.disabled ? "false" : "true"}
        data-active={props.disabled ? "false" : "true"}
        data-interactive={props.disabled ? "false" : "true"}
        data-loading={props.disabled ? "false" : "true"}
        data-open={props.disabled ? "false" : "true"}
        data-checked={props.disabled ? "false" : "true"}
        data-expanded={props.disabled ? "false" : "true"}
        data-value={props.disabled ? "false" : "true"}
        data-multiple={props.disabled ? "false" : "true"}
        data-pressed-multiple={props.disabled ? "false" : "true"}
        data-selected={props.disabled ? "false" : "true"}
        data-default={props.disabled ? "false" : "true"}
        data-checked-multiple={props.disabled ? "false" : "true"}
        data-value-multiple={props.disabled ? "false" : "true"}
        data-pressed-value={props.disabled ? "false" : "true"}
        data-pressed-checked={props.disabled ? "false" : "true"}
        data-pressed-selected={props.disabled ? "false" : "true"}
        data-pressed-default={props.disabled ? "false" : "true"}
        data-pressed-expanded={props.disabled ? "false" : "true"}
        data-pressed-open={props.disabled ? "false" : "true"}
        data-pressed-loading={props.disabled ? "false" : "true"}
        data-pressed-interactive={props.disabled ? "false" : "true"}
        data-pressed-active={props.disabled ? "false" : "true"}
        data-pressed-focus={props.disabled ? "false" : "true"}
        data-pressed-hover={props.disabled ? "false" : "true"}
        
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

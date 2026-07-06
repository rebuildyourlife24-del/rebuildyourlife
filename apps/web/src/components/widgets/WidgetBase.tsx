import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { cn } from "../../lib/utils";

export interface WidgetBaseProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  contentClassName?: string;
}

export function WidgetBase({ 
  title, 
  icon, 
  action, 
  children, 
  className,
  contentClassName,
  ...props 
}: WidgetBaseProps) {
  return (
    <Card className={cn("flex flex-col h-full overflow-hidden", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 border-b border-border/30 bg-muted/20 px-4 py-3">
        <div className="flex items-center gap-2">
          {icon && <span className="text-primary">{icon}</span>}
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground">
            {title}
          </CardTitle>
        </div>
        {action && <div>{action}</div>}
      </CardHeader>
      <CardContent className={cn("flex-1 p-4", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}

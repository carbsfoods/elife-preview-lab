import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  href?: string;
  onClick?: () => void;
  className?: string;
}

const DashboardCard = ({ 
  title, 
  description, 
  icon, 
  buttonText, 
  buttonVariant = "default",
  href,
  onClick,
  className 
}: DashboardCardProps) => {
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
      "bg-card border-border/50 backdrop-blur-sm",
      "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300",
      "hover:before:opacity-100",
      className
    )}>
      <CardHeader className="relative z-10">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
              {icon}
            </div>
          )}
          <div>
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10 space-y-4">
        <CardDescription className="text-muted-foreground leading-relaxed">
          {description}
        </CardDescription>
        {buttonText && (
          <Button 
            variant={buttonVariant}
            className="w-full transition-all duration-300"
            onClick={onClick}
          >
            {buttonText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
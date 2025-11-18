import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  backgroundImage?: string;
}

export function StatsCard({ title, value, subtitle, icon: Icon, trend, backgroundImage }: StatsCardProps) {
  return (
    <Card className="hover-elevate transition-all duration-300 overflow-hidden relative">
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight mt-2">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <span className={`text-sm font-medium ${trend.value >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {trend.value >= 0 ? '+' : ''}{trend.value}%
                </span>
                <span className="text-xs text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-sm">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

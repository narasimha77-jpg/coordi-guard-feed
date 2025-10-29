import { Card } from "@/components/ui/card";
import { SafetyStatus } from "@/utils/haversine";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface SafetyMeterProps {
  distance: number;
  status: SafetyStatus;
}

export const SafetyMeter = ({ distance, status }: SafetyMeterProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "SAFE":
        return {
          color: "text-success",
          bg: "bg-success/20",
          shadow: "shadow-success",
          icon: CheckCircle,
          message: "All Clear - Safe Distance",
        };
      case "CAUTION":
        return {
          color: "text-warning",
          bg: "bg-warning/20",
          shadow: "shadow-none",
          icon: AlertTriangle,
          message: "Warning - Maintain Distance",
        };
      case "DANGER":
        return {
          color: "text-destructive",
          bg: "bg-destructive/20",
          shadow: "shadow-danger",
          icon: XCircle,
          message: "DANGER - Too Close!",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Card className={`p-8 border-border bg-card/50 backdrop-blur-sm ${config.shadow} transition-all duration-300`}>
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className={`p-4 rounded-full ${config.bg}`}>
            <Icon className={`w-12 h-12 ${config.color}`} />
          </div>
        </div>
        
        <div>
          <div className="text-6xl font-bold text-foreground mb-2">
            {distance.toFixed(1)}
            <span className="text-2xl text-muted-foreground ml-2">m</span>
          </div>
          <p className="text-sm text-muted-foreground">Current Distance</p>
        </div>

        <div className={`px-6 py-3 rounded-lg ${config.bg}`}>
          <p className={`text-lg font-semibold ${config.color}`}>
            {config.message}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">SAFE</div>
            <div className="text-sm font-semibold text-success">&gt; 50m</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">CAUTION</div>
            <div className="text-sm font-semibold text-warning">20-50m</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">DANGER</div>
            <div className="text-sm font-semibold text-destructive">&lt; 20m</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

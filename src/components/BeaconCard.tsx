import { Card } from "@/components/ui/card";
import { Coordinates } from "@/utils/haversine";
import { Navigation, User } from "lucide-react";

interface BeaconCardProps {
  type: "vehicle" | "worker";
  coordinates: Coordinates;
}

export const BeaconCard = ({ type, coordinates }: BeaconCardProps) => {
  const isVehicle = type === "vehicle";

  return (
    <Card className="p-6 border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${isVehicle ? 'bg-primary/20' : 'bg-warning/20'}`}>
            {isVehicle ? (
              <Navigation className={`w-6 h-6 ${isVehicle ? 'text-primary' : 'text-warning'}`} />
            ) : (
              <User className="w-6 h-6 text-warning" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {isVehicle ? "Vehicle Beacon" : "Worker Beacon"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isVehicle ? "Active Tracking" : "Personnel Monitor"}
            </p>
          </div>
        </div>
        <div className={`h-3 w-3 rounded-full ${isVehicle ? 'bg-primary' : 'bg-warning'} animate-pulse shadow-glow`} />
      </div>
      
      <div className="space-y-2 mt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Latitude:</span>
          <span className="font-mono text-sm text-foreground">
            {coordinates.latitude.toFixed(6)}°
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Longitude:</span>
          <span className="font-mono text-sm text-foreground">
            {coordinates.longitude.toFixed(6)}°
          </span>
        </div>
      </div>
    </Card>
  );
};

import { useEffect, useState } from "react";
import { BeaconCard } from "@/components/BeaconCard";
import { SafetyMeter } from "@/components/SafetyMeter";
import { RadarDisplay } from "@/components/RadarDisplay";
import {
  Coordinates,
  calculateDistance,
  classifySafety,
  generateRandomCoordinate,
} from "@/utils/haversine";
import { Shield } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [vehicleCoords, setVehicleCoords] = useState<Coordinates>({
    latitude: 40.7128,
    longitude: -74.006,
  });

  const [workerCoords, setWorkerCoords] = useState<Coordinates>({
    latitude: 40.7138,
    longitude: -74.0055,
  });

  const [distance, setDistance] = useState(0);
  const [previousStatus, setPreviousStatus] = useState<string>("SAFE");

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate GPS movement
      const baseCoord = { latitude: 40.7128, longitude: -74.006 };
      const newVehicle = generateRandomCoordinate(baseCoord, 100);
      const newWorker = generateRandomCoordinate(baseCoord, 100);

      setVehicleCoords(newVehicle);
      setWorkerCoords(newWorker);

      const newDistance = calculateDistance(newVehicle, newWorker);
      setDistance(newDistance);

      const status = classifySafety(newDistance);
      
      // Show toast notifications on status change
      if (status !== previousStatus) {
        if (status === "DANGER") {
          toast.error("⚠️ DANGER: Vehicle too close to worker!", {
            description: `Distance: ${newDistance.toFixed(1)}m`,
          });
        } else if (status === "CAUTION" && previousStatus === "SAFE") {
          toast.warning("⚠️ CAUTION: Approaching worker zone", {
            description: `Distance: ${newDistance.toFixed(1)}m`,
          });
        } else if (status === "SAFE" && previousStatus !== "SAFE") {
          toast.success("✓ SAFE: Distance restored", {
            description: `Distance: ${newDistance.toFixed(1)}m`,
          });
        }
        setPreviousStatus(status);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [previousStatus]);

  const status = classifySafety(distance);

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-lg bg-primary/20">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              GPS Safety Monitoring System
            </h1>
            <p className="text-muted-foreground">
              Real-time vehicle and worker tracking with Haversine distance calculation
            </p>
          </div>
        </div>
        <div className="h-1 w-full bg-gradient-primary rounded-full" />
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Beacon Cards */}
        <BeaconCard type="vehicle" coordinates={vehicleCoords} />
        <BeaconCard type="worker" coordinates={workerCoords} />
        
        {/* Safety Meter */}
        <div className="lg:col-span-1">
          <SafetyMeter distance={distance} status={status} />
        </div>
      </div>

      {/* Radar Display */}
      <RadarDisplay
        vehicleCoords={vehicleCoords}
        workerCoords={workerCoords}
        distance={distance}
        status={status}
      />
    </div>
  );
};

export default Index;

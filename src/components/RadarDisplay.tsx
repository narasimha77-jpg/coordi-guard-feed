import { Card } from "@/components/ui/card";
import { Coordinates, SafetyStatus } from "@/utils/haversine";
import { useEffect, useRef } from "react";

interface RadarDisplayProps {
  vehicleCoords: Coordinates;
  workerCoords: Coordinates;
  distance: number;
  status: SafetyStatus;
}

export const RadarDisplay = ({ vehicleCoords, workerCoords, distance, status }: RadarDisplayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 20;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = "#1a1f2e";
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = "#2a3347";
    ctx.lineWidth = 1;
    
    // Vertical and horizontal lines
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      const y = (height / 10) * i;
      
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw range circles
    const ranges = [50, 100, 150, 200];
    ranges.forEach((range) => {
      const radius = (range / 200) * maxRadius;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "#2a3347";
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Range label
      ctx.fillStyle = "#4a5568";
      ctx.font = "10px monospace";
      ctx.fillText(`${range}m`, centerX + radius - 20, centerY + 12);
    });

    // Draw safety zone based on status
    const safetyRadius = (distance / 200) * maxRadius;
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, safetyRadius);
    
    if (status === "DANGER") {
      gradient.addColorStop(0, "rgba(239, 68, 68, 0.3)");
      gradient.addColorStop(1, "rgba(239, 68, 68, 0)");
    } else if (status === "CAUTION") {
      gradient.addColorStop(0, "rgba(245, 158, 11, 0.2)");
      gradient.addColorStop(1, "rgba(245, 158, 11, 0)");
    } else {
      gradient.addColorStop(0, "rgba(16, 185, 129, 0.1)");
      gradient.addColorStop(1, "rgba(16, 185, 129, 0)");
    }
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, safetyRadius, 0, Math.PI * 2);
    ctx.fill();

    // Calculate relative positions
    const latDiff = workerCoords.latitude - vehicleCoords.latitude;
    const lonDiff = workerCoords.longitude - vehicleCoords.longitude;
    
    // Scale to canvas (very rough approximation for visualization)
    const scale = maxRadius / 0.002; // Adjust scale factor
    const workerX = centerX + lonDiff * scale;
    const workerY = centerY - latDiff * scale;

    // Draw vehicle (center)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
    ctx.fillStyle = "#0ea5e9";
    ctx.fill();
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Vehicle pulse
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(14, 165, 233, 0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw worker
    ctx.beginPath();
    ctx.arc(workerX, workerY, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#f59e0b";
    ctx.fill();
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Worker pulse
    ctx.beginPath();
    ctx.arc(workerX, workerY, 18, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(245, 158, 11, 0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw connection line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(workerX, workerY);
    ctx.strokeStyle = status === "DANGER" ? "#ef4444" : status === "CAUTION" ? "#f59e0b" : "#10b981";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

  }, [vehicleCoords, workerCoords, distance, status]);

  return (
    <Card className="p-6 border-border bg-card/50 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">Radar Display</h3>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full h-auto rounded-lg"
        />
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-lg">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-foreground">Vehicle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-foreground">Worker</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

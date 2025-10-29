export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Calculate distance between two GPS coordinates using the Haversine formula
 * @param coord1 First coordinate
 * @param coord2 Second coordinate
 * @returns Distance in meters
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export type SafetyStatus = "SAFE" | "CAUTION" | "DANGER";

export interface SafetyThresholds {
  danger: number;
  caution: number;
}

/**
 * Classify safety status based on distance
 * @param distance Distance in meters
 * @param thresholds Safety thresholds
 * @returns Safety status
 */
export function classifySafety(
  distance: number,
  thresholds: SafetyThresholds = { danger: 20, caution: 50 }
): SafetyStatus {
  if (distance < thresholds.danger) {
    return "DANGER";
  } else if (distance < thresholds.caution) {
    return "CAUTION";
  }
  return "SAFE";
}

/**
 * Generate random GPS coordinates within a range
 * @param center Center coordinate
 * @param radiusMeters Radius in meters
 * @returns Random coordinate
 */
export function generateRandomCoordinate(
  center: Coordinates,
  radiusMeters: number
): Coordinates {
  const radiusInDegrees = radiusMeters / 111000; // Approximate conversion
  
  const u = Math.random();
  const v = Math.random();
  const w = radiusInDegrees * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);

  return {
    latitude: center.latitude + y,
    longitude: center.longitude + x / Math.cos((center.latitude * Math.PI) / 180),
  };
}

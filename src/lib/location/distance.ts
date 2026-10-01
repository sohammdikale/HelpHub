/**
 * Haversine formula to compute great-circle distance between two points on Earth in kilometers.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Truncates exact GPS coordinates to approximate coordinates (~1 km resolution)
 * for user privacy in public job discovery feeds.
 */
export function roundToApproxCoordinates(
  lat: number,
  lng: number
): { approxLat: number; approxLng: number } {
  return {
    approxLat: Math.round(lat * 100) / 100,
    approxLng: Math.round(lng * 100) / 100,
  };
}

/**
 * Common major Indian cities coordinate registry for quick selection & fallback
 */
export const INDIAN_CITIES_COORDINATES: Record<string, { lat: number; lng: number; state: string }> = {
  "New Delhi": { lat: 28.6139, lng: 77.2090, state: "Delhi" },
  "Mumbai": { lat: 19.0760, lng: 72.8777, state: "Maharashtra" },
  "Bengaluru": { lat: 12.9716, lng: 77.5946, state: "Karnataka" },
  "Hyderabad": { lat: 17.3850, lng: 78.4867, state: "Telangana" },
  "Chennai": { lat: 13.0827, lng: 80.2707, state: "Tamil Nadu" },
  "Kolkata": { lat: 22.5726, lng: 88.3639, state: "West Bengal" },
  "Pune": { lat: 18.5204, lng: 73.8567, state: "Maharashtra" },
  "Ahmedabad": { lat: 23.0225, lng: 72.5714, state: "Gujarat" },
  "Jaipur": { lat: 26.9124, lng: 75.7873, state: "Rajasthan" },
  "Lucknow": { lat: 26.8467, lng: 80.9462, state: "Uttar Pradesh" },
  "Chandigarh": { lat: 30.7333, lng: 76.7794, state: "Punjab/Haryana" },
  "Kochi": { lat: 9.9312, lng: 76.2673, state: "Kerala" },
};

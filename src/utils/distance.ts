/**
 * Calculate the distance between two points using the Haversine formula
 * @param {Array} coord1 [latitude, longitude] of first point
 * @param {Array} coord2 [latitude, longitude] of second point
 * @returns {Number} Distance in meters
 */
export const calculateDistance = (coord1: number[], coord2: number[]) => {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;

  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance); // Round to nearest meter
};

/**
 * Calculate the total distance of a path with multiple points
 * @param {Array} coordinates Array of [latitude, longitude] coordinates
 * @returns {Number} Total distance in meters
 */
export const calculatePathDistance = (coordinates: number[][]) => {
  let totalDistance = 0;

  for (let i = 0; i < coordinates.length - 1; i++) {
    totalDistance += calculateDistance(coordinates[i], coordinates[i + 1]);
  }

  return totalDistance;
};

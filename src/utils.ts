export function calculateCentroid(coordinates: [number, number][][]) {
  // Ensure we're working with the first ring of coordinates
  const ring = coordinates[0];

  let area = 0;
  let cx = 0;
  let cy = 0;

  // Calculate centroid using the Shoelace formula
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];

    // Signed area contribution
    const a = x1 * y2 - x2 * y1;
    area += a;

    // Weighted centroid contribution
    cx += (x1 + x2) * a;
    cy += (y1 + y2) * a;
  }

  area /= 2;

  if (area === 0) {
    // If area is zero, just average the coordinates as a fallback
    const sumX = ring.reduce((sum, [x]) => sum + x, 0);
    const sumY = ring.reduce((sum, [_, y]) => sum + y, 0);
    return [sumX / ring.length, sumY / ring.length];
  }

  // Finalize the centroid calculation
  const factor = 1 / (6 * area);
  return [cx * factor, cy * factor];
}

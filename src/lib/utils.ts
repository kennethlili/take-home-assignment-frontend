import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatArea(totalArea: number): string {
  if (totalArea < 10000) {
    return `${Math.round(totalArea)} m²`; // Square meters
  } else {
    const areaInHectares = totalArea / 10000;
    if (areaInHectares < 100) {
      return `${areaInHectares.toFixed(2)} ha`; // Hectares
    } else {
      const areaInSquareKm = totalArea / 1000000;
      return `${areaInSquareKm.toFixed(2)} km²`; // Square kilometers
    }
  }
}

export const ZONING_TYPE = {
  Residential: "Residential",
  Commercial: "Commercial",
  Industrial: "Industrial",
  Planned: "Planned",
} as const;

export type ZoningType = (typeof ZONING_TYPE)[keyof typeof ZONING_TYPE];

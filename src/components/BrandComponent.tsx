import React from "react";
import { brand } from "./Brand";

export const Brand: React.FC = () => (
  <div className="flex items-center gap-2">
    <img src={brand.logoUrl} alt={brand.name} className="h-8 w-8" />
    <div className="font-semibold">{brand.name}</div>
  </div>
);
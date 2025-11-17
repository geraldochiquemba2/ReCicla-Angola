import { Recycle, FileText, Droplet, Wrench, Cpu, Leaf } from "lucide-react";
import type { WasteType } from "@shared/schema";

interface WasteTypeIconProps {
  type: WasteType;
  className?: string;
}

const wasteTypeConfig = {
  plastico: { icon: Recycle, label: "Plástico", color: "text-blue-500" },
  papel: { icon: FileText, label: "Papel", color: "text-amber-500" },
  vidro: { icon: Droplet, label: "Vidro", color: "text-cyan-500" },
  metal: { icon: Wrench, label: "Metal", color: "text-slate-500" },
  eletronicos: { icon: Cpu, label: "Eletrônicos", color: "text-purple-500" },
  organico: { icon: Leaf, label: "Orgânico", color: "text-green-500" },
};

export function WasteTypeIcon({ type, className = "h-5 w-5" }: WasteTypeIconProps) {
  const config = wasteTypeConfig[type];
  const Icon = config.icon;
  return <Icon className={`${config.color} ${className}`} />;
}

export function getWasteTypeLabel(type: WasteType): string {
  return wasteTypeConfig[type].label;
}

export function getWasteTypeColor(type: WasteType): string {
  return wasteTypeConfig[type].color;
}

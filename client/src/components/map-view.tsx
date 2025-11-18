import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { CollectionWithUsers } from "@shared/schema";
import { getWasteTypeLabel } from "./waste-type-icon";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapViewProps {
  collections: CollectionWithUsers[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (collection: CollectionWithUsers) => void;
  userLocation?: [number, number];
  className?: string;
}

export function MapView({
  collections,
  center = [-8.8383, 13.2344], // Luanda, Angola
  zoom = 12,
  onMarkerClick,
  userLocation,
  className = "h-96 w-full rounded-xl",
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView(center, zoom);

    // Satellite imagery layer
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 19,
    }).addTo(map);

    // Labels and roads overlay for hybrid view
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add user location marker if available
    if (userLocation) {
      const userMarker = L.marker(userLocation, {
        icon: L.icon({
          iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      }).addTo(mapRef.current);

      userMarker.bindPopup("<b>Sua Localização</b>");
    }

    // Add collection markers
    collections.forEach((collection) => {
      if (!collection.latitude || !collection.longitude || !mapRef.current) return;

      const lat = parseFloat(collection.latitude);
      const lng = parseFloat(collection.longitude);

      if (isNaN(lat) || isNaN(lng)) return;

      const iconColor =
        collection.status === "disponivel"
          ? "green"
          : collection.status === "aceito"
          ? "orange"
          : "grey";

      const marker = L.marker([lat, lng], {
        icon: L.icon({
          iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColor}.png`,
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      }).addTo(mapRef.current);

      const popupContent = `
        <div class="p-2">
          <h3 class="font-semibold">${getWasteTypeLabel(collection.wasteType)}</h3>
          <p class="text-sm">${collection.quantity} kg</p>
          <p class="text-sm text-muted-foreground">${collection.address}</p>
          ${collection.pointsGenerated > 0 ? `<p class="text-sm font-semibold text-primary mt-1">${collection.pointsGenerated} pontos</p>` : ""}
        </div>
      `;

      marker.bindPopup(popupContent);

      if (onMarkerClick) {
        marker.on("click", () => onMarkerClick(collection));
      }

      markersRef.current.push(marker);
    });

    // Adjust map bounds to show all markers
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      mapRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [collections, userLocation, onMarkerClick]);

  return <div ref={mapContainerRef} className={className} data-testid="map-view" />;
}

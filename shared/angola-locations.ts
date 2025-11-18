export interface Location {
  name: string;
  coordinates: {
    latitude: string;
    longitude: string;
  };
}

export interface Municipality extends Location {
  communes?: string[];
}

export interface Province extends Location {
  municipalities: Record<string, Municipality>;
}

export const angolaLocations: Record<string, Province> = {
  "Luanda": {
    name: "Luanda",
    coordinates: { latitude: "-8.8383", longitude: "13.2344" },
    municipalities: {
      "Belas": { name: "Belas", coordinates: { latitude: "-8.9500", longitude: "13.1500" } },
      "Cacuaco": { name: "Cacuaco", coordinates: { latitude: "-8.7833", longitude: "13.3667" } },
      "Cazenga": { name: "Cazenga", coordinates: { latitude: "-8.8500", longitude: "13.2833" } },
      "Icolo e Bengo": { name: "Icolo e Bengo", coordinates: { latitude: "-9.0667", longitude: "13.5167" } },
      "Luanda": { name: "Luanda", coordinates: { latitude: "-8.8383", longitude: "13.2344" } },
      "Quiçama": { name: "Quiçama", coordinates: { latitude: "-9.7167", longitude: "13.6167" } },
      "Talatona": { name: "Talatona", coordinates: { latitude: "-8.9167", longitude: "13.1833" } },
      "Viana": { name: "Viana", coordinates: { latitude: "-8.8833", longitude: "13.3833" } },
    }
  },
  "Benguela": {
    name: "Benguela",
    coordinates: { latitude: "-12.5763", longitude: "13.4055" },
    municipalities: {
      "Balombo": { name: "Balombo", coordinates: { latitude: "-12.3500", longitude: "14.7167" } },
      "Benguela": { name: "Benguela", coordinates: { latitude: "-12.5763", longitude: "13.4055" } },
      "Bocoio": { name: "Bocoio", coordinates: { latitude: "-12.6167", longitude: "14.1667" } },
      "Caimbambo": { name: "Caimbambo", coordinates: { latitude: "-12.5667", longitude: "13.6167" } },
      "Catumbela": { name: "Catumbela", coordinates: { latitude: "-12.4333", longitude: "13.5500" } },
      "Chongorói": { name: "Chongorói", coordinates: { latitude: "-12.5000", longitude: "14.0833" } },
      "Cubal": { name: "Cubal", coordinates: { latitude: "-12.6667", longitude: "14.2667" } },
      "Ganda": { name: "Ganda", coordinates: { latitude: "-13.0333", longitude: "14.0833" } },
      "Lobito": { name: "Lobito", coordinates: { latitude: "-12.3644", longitude: "13.5481" } },
    }
  },
  "Huíla": {
    name: "Huíla",
    coordinates: { latitude: "-14.9167", longitude: "13.5667" },
    municipalities: {
      "Caconda": { name: "Caconda", coordinates: { latitude: "-13.7333", longitude: "15.0667" } },
      "Caluquembe": { name: "Caluquembe", coordinates: { latitude: "-14.0000", longitude: "14.7500" } },
      "Chibia": { name: "Chibia", coordinates: { latitude: "-15.0000", longitude: "14.0167" } },
      "Chicomba": { name: "Chicomba", coordinates: { latitude: "-13.6833", longitude: "15.4833" } },
      "Chipindo": { name: "Chipindo", coordinates: { latitude: "-14.4167", longitude: "13.8833" } },
      "Humpata": { name: "Humpata", coordinates: { latitude: "-15.0833", longitude: "13.4167" } },
      "Jamba": { name: "Jamba", coordinates: { latitude: "-14.5167", longitude: "16.1500" } },
      "Lubango": { name: "Lubango", coordinates: { latitude: "-14.9167", longitude: "13.5667" } },
      "Matala": { name: "Matala", coordinates: { latitude: "-14.5333", longitude: "16.0667" } },
    }
  },
  "Huambo": {
    name: "Huambo",
    coordinates: { latitude: "-12.7769", longitude: "15.7391" },
    municipalities: {
      "Bailundo": { name: "Bailundo", coordinates: { latitude: "-12.2667", longitude: "15.3167" } },
      "Cachiungo": { name: "Cachiungo", coordinates: { latitude: "-12.5833", longitude: "15.5167" } },
      "Caála": { name: "Caála", coordinates: { latitude: "-12.8500", longitude: "15.5667" } },
      "Ecunha": { name: "Ecunha", coordinates: { latitude: "-13.1833", longitude: "15.6167" } },
      "Huambo": { name: "Huambo", coordinates: { latitude: "-12.7769", longitude: "15.7391" } },
      "Londuimbali": { name: "Londuimbali", coordinates: { latitude: "-12.6167", longitude: "15.8833" } },
      "Longonjo": { name: "Longonjo", coordinates: { latitude: "-12.9167", longitude: "15.2500" } },
      "Mungo": { name: "Mungo", coordinates: { latitude: "-12.6667", longitude: "15.7000" } },
    }
  },
  "Bié": {
    name: "Bié",
    coordinates: { latitude: "-12.5000", longitude: "17.5833" },
    municipalities: {
      "Andulo": { name: "Andulo", coordinates: { latitude: "-11.4833", longitude: "16.7167" } },
      "Camacupa": { name: "Camacupa", coordinates: { latitude: "-12.0167", longitude: "17.4833" } },
      "Catabola": { name: "Catabola", coordinates: { latitude: "-12.3667", longitude: "17.2833" } },
      "Chinguar": { name: "Chinguar", coordinates: { latitude: "-12.6167", longitude: "16.9167" } },
      "Chitembo": { name: "Chitembo", coordinates: { latitude: "-13.0333", longitude: "16.9833" } },
      "Cuemba": { name: "Cuemba", coordinates: { latitude: "-12.3167", longitude: "16.8667" } },
      "Cunhinga": { name: "Cunhinga", coordinates: { latitude: "-12.8833", longitude: "17.5833" } },
      "Kuito": { name: "Kuito", coordinates: { latitude: "-12.3833", longitude: "16.9333" } },
    }
  },
  "Cabinda": {
    name: "Cabinda",
    coordinates: { latitude: "-5.5500", longitude: "12.2000" },
    municipalities: {
      "Belize": { name: "Belize", coordinates: { latitude: "-5.6667", longitude: "12.7000" } },
      "Buco-Zau": { name: "Buco-Zau", coordinates: { latitude: "-5.1667", longitude: "12.6167" } },
      "Cabinda": { name: "Cabinda", coordinates: { latitude: "-5.5500", longitude: "12.2000" } },
      "Cacongo": { name: "Cacongo", coordinates: { latitude: "-5.1333", longitude: "12.2000" } },
    }
  },
  "Cunene": {
    name: "Cunene",
    coordinates: { latitude: "-16.2667", longitude: "15.7500" },
    municipalities: {
      "Cahama": { name: "Cahama", coordinates: { latitude: "-16.2667", longitude: "14.3167" } },
      "Cuanhama": { name: "Cuanhama", coordinates: { latitude: "-17.0667", longitude: "15.8000" } },
      "Curoca": { name: "Curoca", coordinates: { latitude: "-17.2667", longitude: "15.0167" } },
      "Cuvelai": { name: "Cuvelai", coordinates: { latitude: "-16.9833", longitude: "15.7667" } },
      "Namacunde": { name: "Namacunde", coordinates: { latitude: "-17.4333", longitude: "15.8667" } },
      "Ombadja": { name: "Ombadja", coordinates: { latitude: "-17.1000", longitude: "15.3333" } },
    }
  },
  "Cuando Cubango": {
    name: "Cuando Cubango",
    coordinates: { latitude: "-15.7833", longitude: "18.5333" },
    municipalities: {
      "Calai": { name: "Calai", coordinates: { latitude: "-16.7167", longitude: "21.1500" } },
      "Cuangar": { name: "Cuangar", coordinates: { latitude: "-17.8667", longitude: "18.7000" } },
      "Cuchi": { name: "Cuchi", coordinates: { latitude: "-14.4333", longitude: "17.9500" } },
      "Cuito Cuanavale": { name: "Cuito Cuanavale", coordinates: { latitude: "-15.1667", longitude: "19.1500" } },
      "Dirico": { name: "Dirico", coordinates: { latitude: "-17.9500", longitude: "20.9167" } },
      "Mavinga": { name: "Mavinga", coordinates: { latitude: "-15.7833", longitude: "20.4000" } },
      "Menongue": { name: "Menongue", coordinates: { latitude: "-14.6597", longitude: "17.6911" } },
      "Nankova": { name: "Nankova", coordinates: { latitude: "-15.4167", longitude: "18.6667" } },
      "Rivungo": { name: "Rivungo", coordinates: { latitude: "-16.8333", longitude: "18.5000" } },
    }
  },
};

export const getProvinces = (): string[] => {
  return Object.keys(angolaLocations).sort();
};

export const getMunicipalities = (province: string): string[] => {
  const provinceData = angolaLocations[province];
  if (!provinceData) return [];
  return Object.keys(provinceData.municipalities).sort();
};

export const getCoordinates = (province: string, municipality?: string) => {
  const provinceData = angolaLocations[province];
  if (!provinceData) return null;
  
  if (municipality && provinceData.municipalities[municipality]) {
    return provinceData.municipalities[municipality].coordinates;
  }
  
  return provinceData.coordinates;
};

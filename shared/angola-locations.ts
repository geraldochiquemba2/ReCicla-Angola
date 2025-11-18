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
  "Bengo": {
    name: "Bengo",
    coordinates: { latitude: "-9.0333", longitude: "13.7667" },
    municipalities: {
      "Ambriz": { name: "Ambriz", coordinates: { latitude: "-7.8500", longitude: "13.1167" } },
      "Bula Atumba": { name: "Bula Atumba", coordinates: { latitude: "-8.6167", longitude: "13.4333" } },
      "Dande": { name: "Dande", coordinates: { latitude: "-8.7833", longitude: "13.5333" } },
      "Dembos": { name: "Dembos", coordinates: { latitude: "-9.1667", longitude: "14.0000" } },
      "Nambuangongo": { name: "Nambuangongo", coordinates: { latitude: "-9.1000", longitude: "14.4000" } },
      "Pango Aluquém": { name: "Pango Aluquém", coordinates: { latitude: "-8.9667", longitude: "13.5167" } },
    }
  },
  "Cuanza Norte": {
    name: "Cuanza Norte",
    coordinates: { latitude: "-9.1833", longitude: "14.8667" },
    municipalities: {
      "Ambaca": { name: "Ambaca", coordinates: { latitude: "-9.3667", longitude: "14.5500" } },
      "Banga": { name: "Banga", coordinates: { latitude: "-9.0167", longitude: "14.5667" } },
      "Bolongongo": { name: "Bolongongo", coordinates: { latitude: "-9.8333", longitude: "14.6167" } },
      "Cambambe": { name: "Cambambe", coordinates: { latitude: "-9.7500", longitude: "15.3833" } },
      "Cazengo": { name: "Cazengo", coordinates: { latitude: "-9.1333", longitude: "14.9167" } },
      "Golungo Alto": { name: "Golungo Alto", coordinates: { latitude: "-9.1167", longitude: "14.7000" } },
      "Gonguembo": { name: "Gonguembo", coordinates: { latitude: "-9.5000", longitude: "14.5000" } },
      "Lucala": { name: "Lucala", coordinates: { latitude: "-9.5667", longitude: "14.8667" } },
      "Quiculungo": { name: "Quiculungo", coordinates: { latitude: "-9.0833", longitude: "14.6167" } },
      "Samba Cajú": { name: "Samba Cajú", coordinates: { latitude: "-9.2833", longitude: "14.3833" } },
    }
  },
  "Cuanza Sul": {
    name: "Cuanza Sul",
    coordinates: { latitude: "-11.0833", longitude: "14.9167" },
    municipalities: {
      "Amboim": { name: "Amboim", coordinates: { latitude: "-10.7500", longitude: "14.4833" } },
      "Cassongue": { name: "Cassongue", coordinates: { latitude: "-11.7833", longitude: "15.2500" } },
      "Cela": { name: "Cela", coordinates: { latitude: "-11.5000", longitude: "14.9833" } },
      "Conda": { name: "Conda", coordinates: { latitude: "-11.3333", longitude: "15.8333" } },
      "Ebo": { name: "Ebo", coordinates: { latitude: "-11.2500", longitude: "14.1167" } },
      "Libolo": { name: "Libolo", coordinates: { latitude: "-10.5000", longitude: "14.5833" } },
      "Mussende": { name: "Mussende", coordinates: { latitude: "-10.9167", longitude: "14.8167" } },
      "Porto Amboim": { name: "Porto Amboim", coordinates: { latitude: "-10.7167", longitude: "13.7667" } },
      "Quibala": { name: "Quibala", coordinates: { latitude: "-10.7333", longitude: "14.9667" } },
      "Quilenda": { name: "Quilenda", coordinates: { latitude: "-10.4167", longitude: "14.3167" } },
      "Seles": { name: "Seles", coordinates: { latitude: "-11.3000", longitude: "14.4167" } },
      "Sumbe": { name: "Sumbe", coordinates: { latitude: "-11.2050", longitude: "13.8433" } },
    }
  },
  "Lunda Norte": {
    name: "Lunda Norte",
    coordinates: { latitude: "-8.6667", longitude: "18.7500" },
    municipalities: {
      "Cambulo": { name: "Cambulo", coordinates: { latitude: "-8.9667", longitude: "17.4667" } },
      "Capenda Camulemba": { name: "Capenda Camulemba", coordinates: { latitude: "-9.4333", longitude: "18.4333" } },
      "Caungula": { name: "Caungula", coordinates: { latitude: "-8.8167", longitude: "19.5167" } },
      "Chitato": { name: "Chitato", coordinates: { latitude: "-7.3833", longitude: "20.2500" } },
      "Cuango": { name: "Cuango", coordinates: { latitude: "-8.2833", longitude: "17.3500" } },
      "Cuílo": { name: "Cuílo", coordinates: { latitude: "-8.1167", longitude: "19.2000" } },
      "Lóvua": { name: "Lóvua", coordinates: { latitude: "-7.8167", longitude: "18.6333" } },
      "Lubalo": { name: "Lubalo", coordinates: { latitude: "-7.3500", longitude: "19.6500" } },
      "Lucapa": { name: "Lucapa", coordinates: { latitude: "-8.4167", longitude: "20.7333" } },
      "Xá-Muteba": { name: "Xá-Muteba", coordinates: { latitude: "-7.9333", longitude: "19.8667" } },
    }
  },
  "Lunda Sul": {
    name: "Lunda Sul",
    coordinates: { latitude: "-10.3333", longitude: "20.7500" },
    municipalities: {
      "Cacolo": { name: "Cacolo", coordinates: { latitude: "-10.2000", longitude: "19.2167" } },
      "Dala": { name: "Dala", coordinates: { latitude: "-11.1500", longitude: "20.3333" } },
      "Muconda": { name: "Muconda", coordinates: { latitude: "-11.3167", longitude: "20.3667" } },
      "Saurimo": { name: "Saurimo", coordinates: { latitude: "-9.6600", longitude: "20.3917" } },
    }
  },
  "Malanje": {
    name: "Malanje",
    coordinates: { latitude: "-9.5333", longitude: "16.3500" },
    municipalities: {
      "Cacuso": { name: "Cacuso", coordinates: { latitude: "-9.6167", longitude: "15.1000" } },
      "Calandula": { name: "Calandula", coordinates: { latitude: "-9.1833", longitude: "15.8667" } },
      "Cambundi-Catembo": { name: "Cambundi-Catembo", coordinates: { latitude: "-9.7000", longitude: "17.3667" } },
      "Cangandala": { name: "Cangandala", coordinates: { latitude: "-9.7500", longitude: "16.7667" } },
      "Caombo": { name: "Caombo", coordinates: { latitude: "-10.2500", longitude: "15.5000" } },
      "Cuaba Nzogo": { name: "Cuaba Nzogo", coordinates: { latitude: "-9.4833", longitude: "15.5833" } },
      "Cunda-Dia-Baze": { name: "Cunda-Dia-Baze", coordinates: { latitude: "-10.0333", longitude: "16.8833" } },
      "Luquembo": { name: "Luquembo", coordinates: { latitude: "-10.3833", longitude: "16.4833" } },
      "Malanje": { name: "Malanje", coordinates: { latitude: "-9.5333", longitude: "16.3500" } },
      "Marimba": { name: "Marimba", coordinates: { latitude: "-9.2000", longitude: "15.7167" } },
      "Massango": { name: "Massango", coordinates: { latitude: "-10.2500", longitude: "16.1500" } },
      "Mucari": { name: "Mucari", coordinates: { latitude: "-9.9500", longitude: "15.9833" } },
      "Quela": { name: "Quela", coordinates: { latitude: "-9.2833", longitude: "16.2167" } },
      "Quirima": { name: "Quirima", coordinates: { latitude: "-9.4667", longitude: "16.5333" } },
    }
  },
  "Moxico": {
    name: "Moxico",
    coordinates: { latitude: "-11.7167", longitude: "19.9167" },
    municipalities: {
      "Alto Zambeze": { name: "Alto Zambeze", coordinates: { latitude: "-11.3833", longitude: "23.1333" } },
      "Bundas": { name: "Bundas", coordinates: { latitude: "-12.1667", longitude: "18.5500" } },
      "Camanongue": { name: "Camanongue", coordinates: { latitude: "-13.4167", longitude: "20.6833" } },
      "Cameia": { name: "Cameia", coordinates: { latitude: "-11.6833", longitude: "20.8333" } },
      "Léua": { name: "Léua", coordinates: { latitude: "-11.8167", longitude: "19.7000" } },
      "Luau": { name: "Luau", coordinates: { latitude: "-10.7000", longitude: "22.2167" } },
      "Luacano": { name: "Luacano", coordinates: { latitude: "-12.5667", longitude: "19.7000" } },
      "Luchazes": { name: "Luchazes", coordinates: { latitude: "-13.5333", longitude: "19.9167" } },
      "Luena": { name: "Luena", coordinates: { latitude: "-11.7833", longitude: "19.9167" } },
    }
  },
  "Namibe": {
    name: "Namibe",
    coordinates: { latitude: "-15.1950", longitude: "12.1514" },
    municipalities: {
      "Bibala": { name: "Bibala", coordinates: { latitude: "-14.9833", longitude: "13.6667" } },
      "Camucuio": { name: "Camucuio", coordinates: { latitude: "-15.1167", longitude: "13.4167" } },
      "Moçâmedes": { name: "Moçâmedes", coordinates: { latitude: "-15.1950", longitude: "12.1514" } },
      "Tômbua": { name: "Tômbua", coordinates: { latitude: "-15.7833", longitude: "11.8667" } },
      "Virei": { name: "Virei", coordinates: { latitude: "-14.3833", longitude: "13.2333" } },
    }
  },
  "Uíge": {
    name: "Uíge",
    coordinates: { latitude: "-7.6167", longitude: "15.0667" },
    municipalities: {
      "Alto Cauale": { name: "Alto Cauale", coordinates: { latitude: "-6.7000", longitude: "15.1000" } },
      "Ambuíla": { name: "Ambuíla", coordinates: { latitude: "-7.0667", longitude: "15.1667" } },
      "Bembe": { name: "Bembe", coordinates: { latitude: "-7.0167", longitude: "13.7500" } },
      "Buengas": { name: "Buengas", coordinates: { latitude: "-7.7500", longitude: "14.6667" } },
      "Bungo": { name: "Bungo", coordinates: { latitude: "-7.5000", longitude: "15.4167" } },
      "Damba": { name: "Damba", coordinates: { latitude: "-7.4167", longitude: "14.4667" } },
      "Macocola": { name: "Macocola", coordinates: { latitude: "-7.1333", longitude: "15.8000" } },
      "Milunga": { name: "Milunga", coordinates: { latitude: "-6.9833", longitude: "15.4833" } },
      "Mucaba": { name: "Mucaba", coordinates: { latitude: "-7.2833", longitude: "14.6000" } },
      "Negage": { name: "Negage", coordinates: { latitude: "-7.7667", longitude: "15.2667" } },
      "Puri": { name: "Puri", coordinates: { latitude: "-6.8167", longitude: "14.9000" } },
      "Quitexe": { name: "Quitexe", coordinates: { latitude: "-7.3667", longitude: "14.0667" } },
      "Sanza Pombo": { name: "Sanza Pombo", coordinates: { latitude: "-6.8833", longitude: "15.7667" } },
      "Songo": { name: "Songo", coordinates: { latitude: "-7.3667", longitude: "15.5667" } },
      "Uíge": { name: "Uíge", coordinates: { latitude: "-7.6167", longitude: "15.0667" } },
      "Zombo": { name: "Zombo", coordinates: { latitude: "-6.9500", longitude: "14.4167" } },
    }
  },
  "Zaire": {
    name: "Zaire",
    coordinates: { latitude: "-6.2167", longitude: "12.7833" },
    municipalities: {
      "Cuimba": { name: "Cuimba", coordinates: { latitude: "-5.8000", longitude: "13.5000" } },
      "M'banza-Kongo": { name: "M'banza-Kongo", coordinates: { latitude: "-6.2667", longitude: "14.2417" } },
      "Nóqui": { name: "Nóqui", coordinates: { latitude: "-5.9167", longitude: "12.5000" } },
      "N'zeto": { name: "N'zeto", coordinates: { latitude: "-7.2333", longitude: "12.8667" } },
      "Soyo": { name: "Soyo", coordinates: { latitude: "-6.1350", longitude: "12.3683" } },
      "Tomboco": { name: "Tomboco", coordinates: { latitude: "-6.0667", longitude: "13.3333" } },
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

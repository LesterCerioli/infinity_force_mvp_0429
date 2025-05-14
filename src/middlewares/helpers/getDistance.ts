export const calculateDistance = (lon1: number, lat1: number, lon2: number, lat2: number): number => {
    // Mean radius of Earth's radius in kilometers = 6,371 km
    const R = 6371;
    
    
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    
    const distance = R * c;
  
    return distance;
  };
  
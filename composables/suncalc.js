import { ref } from 'vue';
import SunCalc from 'suncalc';

export function useSunPosition() {
  function getSolarPosition(lat, lon, date = new Date()) {
    if (!lat || !lon) {
      console.warn('Koordinatlar eksik:', { lat, lon });
      return null;
    }

    // Güneş pozisyonunu hesapla
    const { altitude, azimuth } = SunCalc.getPosition(date, lat, lon);
    
    // Radyanı dereceye çevir
    const altitudeDeg = altitude * (180 / Math.PI);
    let azimuthDeg = azimuth * (180 / Math.PI);

    // SunCalc'ın azimuth değerini pusula derecesine çevir
    // SunCalc: -180 ile +180 arası (0 = güney, -90 = doğu, +90 = batı)
    // Pusula: 0-360 arası (0 = kuzey, 90 = doğu, 180 = güney, 270 = batı)
    let compassDeg = (azimuthDeg + 180) % 360;

    // Gün doğumu, gün batımı ve diğer zamanları hesapla
    const times = SunCalc.getTimes(date, lat, lon);



    return { 
      altitudeDeg,      // Güneşin yüksekliği
      compassDeg,       // Pusula açısı
      times,           // Gün doğumu, batımı vs.
      isDay: altitude > 0  // Gündüz mü?
    };
  }

  // Açıya göre yön belirleme yardımcı fonksiyonu
  function getDirection(deg) {
    const directions = ['K', 'KD', 'D', 'GD', 'G', 'GB', 'B', 'KB'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  }

  return {
    getSolarPosition
  };
}

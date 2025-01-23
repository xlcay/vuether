import { ref } from 'vue';
import SunCalc from 'suncalc';

function getSolarPosition(lat, lon, date = new Date()) {
  const { altitude, azimuth } = SunCalc.getPosition(date, lat, lon);
  // altitude: güneşin ufkun üzerinde kaç radyan (0 -> ufuk, π/2 -> tam tepede)
  // azimuth: kuzeyden saat yönünün tersine kaç radyan (0 -> kuzey, ±π -> güney)

  // Dereceye çevirelim:
  const altitudeDeg = altitude * (180 / Math.PI);
  const azimuthDeg = azimuth * (180 / Math.PI);

  return { altitudeDeg, azimuthDeg };
}

let compassDeg = 180 - azimuthDeg;
if (compassDeg < 0) {
  compassDeg += 360;
    }

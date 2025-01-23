<template>
  <div v-if="weatherData" class="flex flex-col items-center">
    <!-- Pusula Container -->
 <!-- Outer Circle Container -->
<div class="relative w-32 h-32 border-2 border-gray-800 rounded-full bg-white flex justify-center items-center mt-8">
  <!-- Compass Background Lines (Optional) -->
  <div class="absolute w-full h-full">
    <!-- Horizontal line -->
    <div class="absolute w-full h-[2px] bg-gray-300 top-1/2 -translate-y-1/2"></div>
    <!-- Vertical line -->
    <div class="absolute h-full w-[2px] bg-gray-300 left-1/2 -translate-x-1/2"></div>
  </div>

  <!-- Arrow Shaft + Head -->
  <div
    class="absolute w-2 h-8 bg-dark-cyan/50
               origin-center
               transition-transform duration-700
               top-[40%] left-[50%]
               z-99"
    :style="{ transform: `rotate(${compassAngle}deg)` }"
  >
    <!-- Arrow Head -->
    <div
      class="absolute -top-[8px] left-1/2 -translate-x-1/2
                 w-0 h-0
                 border-l-[5px] border-r-[5px] border-b-[10px]
                 border-l-transparent border-r-transparent border-b-red-500"
    ></div>
  </div>

  <!-- Direction Labels (N, S, E, W) -->
  <div class="absolute inset-0">
    <span class="absolute -top-6 left-1/2 -translate-x-1/2 font-bold text-gray-800">N</span>
    <span class="absolute -bottom-6 left-1/2 -translate-x-1/2 font-bold text-gray-800">S</span>
    <span class="absolute -right-6 top-1/2 -translate-y-1/2 font-bold text-gray-800">E</span>
    <span class="absolute -left-6 top-1/2 -translate-y-1/2 font-bold text-gray-800">W</span>
  </div>
</div>


    <!-- Açı ve Koordinat Bilgileri -->

    <div class=" text-sm text-gray-600 text-center space-y-1 mt-8">
        <div v-if="typeof compassAngle === 'number'">
          Güneş Açısı: {{ Math.round(compassAngle) }}°
        </div>
        <div v-if="weatherData?.coord">
          Konum: {{ weatherData.coord.lat }}°N, {{ weatherData.coord.lon }}°E
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import SunCalc from 'suncalc';

const props = defineProps({
  weatherData: {
    type: Object,
    required: true
  }
});

const compassAngle = ref(null); 
let updateInterval;

function calculateSunPosition() {
  if (!props.weatherData?.coord) {
    console.warn('Hava durumu verisi henüz hazır değil');
    return;
  }

  const { lat, lon } = props.weatherData.coord;
  const now = new Date();
  const sunPosition = SunCalc.getPosition(now, lat, lon);
  
  let azimuthDeg = (sunPosition.azimuth * 180) / Math.PI;
  azimuthDeg = (450 - azimuthDeg) % 360;
  
  console.log('Pusula güncellendi:', {
    city: props.weatherData.name,
    coordinates: { lat, lon },
    angle: azimuthDeg,
    time: now.toLocaleTimeString()
  });

  compassAngle.value = azimuthDeg;
}

// WeatherData değişimini izle
watch(
  () => props.weatherData,
  (newData) => {
    if (newData?.coord) {
      calculateSunPosition();
    }
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  if (props.weatherData?.coord) {
    calculateSunPosition();
  }
  updateInterval = setInterval(calculateSunPosition, 60000); 
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
</script>


  
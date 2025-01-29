<template>
  <div v-if="weatherData" class="flex flex-col items-center text-light">
    <!-- Pusula Container -->
 <!-- Outer Circle Container -->
<div class="relative w-32 h-32 border-4 rounded-full bg-white flex justify-center items-center mt-8">
  <!-- Compass Background Lines (Optional) -->
  <div class="absolute w-full h-full">
    <!-- Horizontal line -->
    <div class="absolute w-full h-[2px] bg-gray-300 top-1/2 -translate-y-1/2"></div>
    <!-- Vertical line -->
    <div class="absolute h-full w-[2px] bg-gray-300 left-1/2 -translate-x-1/2"></div>
  </div>

  <!-- Arrow Shaft + Head -->
  <div
    class="absolute w-2 h-8 bg-light/90
               origin-center
               transition-transform duration-700
               top-[40%] left-[50%]
               z-99"
    :style="{ transform: `rotate(${sunPosition?.compassDeg}deg)` }"
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
    <span class="absolute -top-6 left-1/2 -translate-x-1/2 font-bold">N</span>
    <span class="absolute -bottom-6 left-1/2 -translate-x-1/2 font-bold">S</span>
    <span class="absolute -right-6 top-1/2 -translate-y-1/2 font-bold">E</span>
    <span class="absolute -left-6 top-1/2 -translate-y-1/2 font-bold">W</span>
  </div>
</div>


    <!-- Açı ve Koordinat Bilgileri -->

    <div class=" text-sm text-gray-600 text-center space-y-1 mt-8">
        <div v-if="typeof sunPosition?.compassDeg === 'number'">
          Güneş Açısı: {{ Math.round(sunPosition.compassDeg) }}°
        </div>
        <div v-if="sunPosition">
          {{ sunPosition.isDay ? 'Gündüz' : 'Gece' }}
        </div>
        <div v-if="sunPosition">
          🌅 {{ formatTime(sunPosition.times.sunrise) }} | 
          🌇 {{ formatTime(sunPosition.times.sunset) }}
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useSunPosition } from '../composables/suncalc';

const props = defineProps({
  weatherData: {
    type: Object,
    required: true
  }
});

const { getSolarPosition } = useSunPosition();
const sunPosition = ref(null);
let updateInterval;

function formatTime(date) {
  return date.toLocaleTimeString('tr-TR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hours12: false,
  });
}



function updateSunPosition() {
  if (!props.weatherData?.coord) return;

  const { lat, lon } = props.weatherData.coord;
  sunPosition.value = getSolarPosition(lat, lon);
}

// WeatherData değişimini izle
watch(
  () => props.weatherData,
  () => {
    updateSunPosition();
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  updateSunPosition();
  // Her 5 dakikada bir güncelle
  updateInterval = setInterval(updateSunPosition, 300000);
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
</script>


  
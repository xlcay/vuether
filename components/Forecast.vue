<template>
  <div class="rounded-lg p-4 w-full">
    <h3 class="text-xl font-bold mb-4 text-light text-center">5 Günlük Tahmin</h3>
    
    <div v-if="forecast" class="flex flex-col gap-4">
      <div v-for="(day, index) in forecast" 
           :key="index"
           class="bg-dark-green/50 rounded-lg p-4 flex items-center justify-between">
        
        <!-- Sol: Tarih -->
        <div class="text-light text-sm">
          {{ formatDate(day.dt) }}
        </div>

        <!-- Orta: Hava Durumu İkonu ve Açıklama -->
        <div class="flex items-center gap-2">
          <img 
            :src="`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`"
            :alt="day.weather[0].description"
            class="w-16 h-16"
          />
          <span class="text-light text-sm capitalize">
            {{ day.weather[0].description }}
          </span>
        </div>

        <!-- Sağ: Yüksek ve Düşük Sıcaklık -->
        <div class="text-light flex flex-col items-end">
          <div class="font-bold">
            {{ Math.round(day.main.temp_max) }}°C
            <span class="text-xs text-light/70">yüksek</span>
          </div>


        </div>
      </div>
    </div>

    <!-- Loading durumu -->
    <div v-else class="text-light text-center">
      Yükleniyor...
    </div>
  </div>
</template>


  <style>
           /* 'green': '#235347',
        'light-green': '#8eb69b',
        'dark-green': '#163832' */
  </style>

<script setup>
const props = defineProps({
  forecast: {
    type: Array,
    required: true
  }
});

// Unix timestamp'i tarihe çevir
function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString('tr-TR', {
    weekday: 'short',
    day: '2-digit',
    month: 'long',
  });
}
</script>


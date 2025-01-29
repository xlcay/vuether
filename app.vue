<template>
  <div class="min-h-screen bg-gradient-to-b from-dark-blue to-dark-green">
    <div class="container mx-auto px-4 py-8 flex flex-col items-center justify-center">
      <!-- Head -->
      <div class="flex flex-col items-center justify-center">
        <h1 class="text-3xl font-bold m-5 text-light">Vuether App</h1>
        <h2 class="text-lg font-medium text-center m-5 text-dark-gray/70 max-w-3xl">
          This project is designed to help you get maximum efficiency from your solar panels. Developed using Nuxt 3, Vue 3, and TailwindCSS technologies, our application receives real-time weather data via API and provides optimal angle suggestions for your solar panels.
        </h2>
        <animatedSun class="rounded-full bg-light bg-opacity-30 p-1 cursor-pointer hover:bg-opacity-50 transition-all"/>
      </div>

      <!-- Content -->
      <div class="w-full flex flex-col gap-8 mt-8">
        <!-- Üst sıra: WeatherCard ve Compass yan yana -->
        <div class="flex flex-col md:flex-row gap-8 justify-center">
          <!-- WeatherCard -->
          <div class="space-between flex">
            <WeatherCard 
              @weather-updated="handleWeatherUpdate"
              @forecast-updated="handleForecastUpdate"
            />
          </div>

          <!-- Compass -->
          <div v-if="currentWeather" class="w-full md:w-1/3 bg-transparent rounded-lg p-6">
            <h3 class="text-xl font-bold mb-4 text-light text-center">Güneş Konumu</h3>
            <Compass :weatherData="currentWeather" />
          </div>
        </div>

        <!-- Alt sıra: Forecast tam genişlikte -->
        <div v-if="forecastData" class="w-full">
          <Forecast :forecast="forecastData" />
        </div>
      </div>

      <span class="text-light relative text-sm italic mt-8">
        Calculations may be inaccurate due to OpenWeatherMap API limitations.
      </span>
    </div>
  </div>
</template>
<!-- 
        'dark': '#18181b',
        'dark-blue': '#11212d',
        'dark-cyan': '#253745',
        'dark-blue-2': '#4a5c6a',
        'dark-gray': '#9babab',
        'light': '#ccd0cf',
-->



<script setup>
import WeatherCard from '~/components/WeatherCard.vue';
import Forecast from '~/components/Forecast.vue';
import animatedSun from '~/components/animatedSun.vue';
import { ref } from 'vue';

// WeatherCard'dan gelen veriyi tutmak için
const currentWeather = ref(null);
const forecastData = ref(null);

// WeatherCard'dan veriyi al
function handleWeatherUpdate(weatherData) {
  currentWeather.value = weatherData;
  console.log('Weather Updated:', weatherData); // Debug log
}

function handleForecastUpdate(forecast) {
  forecastData.value = forecast;
  console.log('Forecast Updated:', forecast); // Debug log
}
</script>

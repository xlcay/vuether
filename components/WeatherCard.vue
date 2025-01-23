<template>
    
     <div class="flex flex-row gap-5 justify-center items-center">
        <div class="bg-light/70 p-8 rounded-lg shadow-lg">
          
          <div class="flex gap-2 mb-4">
            <input 
              v-model="city" 
              type="text" 
              placeholder="Şehir giriniz" 
              class="px-3 py-2 rounded border"
              @keyup.enter="fetchWeatherData"
            />
            <button 
              @click="fetchWeatherData"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              :disabled="pending"
            >
              {{ pending ? 'Yükleniyor...' : 'Ara' }}
            </button>
          </div>

          <div v-if="pending" class="text-center py-4">
            Yükleniyor...
          </div>

          <div v-else-if="error" class="text-red-500 mb-4">
            {{ error }}
          </div>
         

          <div v-else-if="weatherData" class="flex flex-col space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold text-dark">{{ weatherData.name }}</h3>
              <span class="text-sm text-dark">{{ cityTime }}</span>
            </div>
    
            <div class="flex items-center gap-4">
              <div class="text-5xl font-bold text-gray-800">{{ Math.round(weatherData.main.temp) }}°C</div>
              <div class="flex flex-col">
                <span class="text-dark">Nem: {{ weatherData.main.humidity }}% </span>
                <span class="text-dark">Rüzgar: {{ weatherData.wind.speed }} m/s </span>
              </div>
            </div>
    
            <div class="flex items-center  gap-2">
              <div class="rounded-full bg-light bg-opacity-30 p-1">
                <img
                :src="getIconUrl(weatherData.weather[0].icon)"
                :alt="weatherData.weather[0].description"
                class="w-12 h-12"
                />
              </div>
              <span class="text-dark capitalize">{{ weatherData.weather[0].description }}</span>
            </div>

            <div v-if="coordinates" class="text-sm text-gray-600">
              Koordinatlar: {{ coordinates.lat }}°N, {{ coordinates.lon }}°E
            </div>
          </div>

          <!-- weatherData hazır olduğunda pusula göster -->
            <div v-if="weatherData" class="mt-4">
              <Compass :weatherData="weatherData" />
            </div>
        </div>
      </div> 

    

</template>


<style>


  /* colors: {
        transparent: 'transparent',
        'dark': '#18181b',
        'dark-blue': '#11212d',
        'dark-cyan': '#253745',
        'dark-blue-2': '#4a5c6a',
        'dark-gray': '#9babab',
        'light': '#ccd0cf',
      
      }, */


</style>


<script setup>


import { ref, onMounted, watch, defineEmits } from 'vue';


const config = useRuntimeConfig();
const apiKey = config.public.openWeatherMapApiKey;

const city = ref('London');
const weatherData = ref(null);
const error = ref(null);
const pending = ref(false);
const coordinates = ref(null);
const cityTime = ref(null);
let timeInterval; 


const emit = defineEmits(['update:coords']);

onMounted(async () => {
  await fetchWeatherData();
});


async function fetchWeatherData() {
  pending.value = true;
  error.value = null;
  
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${apiKey}&units=metric&lang=tr`
    );
    const data = await response.json();
    
    if (response.ok) {
      weatherData.value = data;
      coordinates.value = {
        lat: data.coord.lat,
        lon: data.coord.lon
      };
      updateCityTime(data.timezone);
    } else {
      error.value = 'Şehir bulunamadı';
    }
  } catch (err) {
    error.value = 'Bir hata oluştu';
    console.error(err);
  } finally {
    pending.value = false;
  }
}

function updateCityTime(timezoneOffset) {

  if (timeInterval) {
    clearInterval(timeInterval);
  }


  const updateTime = () => {
    const date = new Date();
    const utcTime = date.getTime();
    const localOffset = date.getTimezoneOffset() * 60000; 
    const targetTime = new Date(utcTime + localOffset + (timezoneOffset * 1000));

    cityTime.value = targetTime.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };


  updateTime();
  
  
  timeInterval = setInterval(updateTime, 30000);
}

function getIconUrl(iconCode) {
  return iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : '';
}


watch(coordinates, (val) => {
  if (val && val.lat != null && val.lon != null) {
    emit('update:coords', val);
  }
});

</script>








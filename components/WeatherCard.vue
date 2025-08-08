<template>
    
     <div class="flex">
        <div class="bg-light p-8 rounded-lg shadow-lg">
          
          <div class="flex gap-2 mb-6">
            <input 
              v-model="city" 
              type="text" 
              placeholder="Şehir giriniz" 
              class="px-3 py-2 rounded border"
              @keyup.enter="fetchWeatherData"
            />
            <button 
              @click="fetchWeatherData"
              class="px-4 py-2 text-white rounded-lg bg-light-green"
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
              <span class="text-md font-bold text-dark">{{ cityTime }}</span>
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
                class="w-16 h-16"
                />
              </div>
              <span class="text-dark capitalize">{{ weatherData.weather[0].description }}</span>
            </div>

            <div v-if="coordinates" class="text-sm text-gray-600 italic">
              Koordinatlar: {{ coordinates.lat }}°N, {{ coordinates.lon }}°E
            </div>
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
        'green': '#235347',
        'light-green': '#8eb69b',
        'dark-green': '#163832'
      }, */


</style>


<script setup>


import { ref, onMounted, watch, defineEmits } from 'vue';


const config = useRuntimeConfig();
const apiKey = config.public.openWeatherMapApiKey;

const city = ref('Londra');
const weatherData = ref(null);
const forecast = ref(null);
const error = ref(null);
const pending = ref(false);
const coordinates = ref(null);
const cityTime = ref(null);
let timeInterval; 


const emit = defineEmits(['weather-updated', 'forecast-updated']);

onMounted(async () => {
  await fetchWeatherData();
});


async function fetchWeatherData() {
  pending.value = true;
  error.value = null;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city.value}&appid=${apiKey}&units=metric&lang=tr`
    );
    
    const data = await response.json();

    if (response.ok) {
      weatherData.value = {
        ...data.list[0],
        name: data.city.name,
        coord: data.city.coord,
        sys: {
          country: data.city.country
        }
      };
      
      // Her günün 15:00 verisi
      const dailyForecasts = data.list.filter(item => {
        const hour = new Date(item.dt * 1000).getHours();
        return hour === 15;
      });

      forecast.value = dailyForecasts;

      coordinates.value = {
        lat: data.city.coord.lat,
        lon: data.city.coord.lon
      };

      updateCityTime(data.city.timezone);

      emit('weather-updated', weatherData.value);
      emit('forecast-updated', forecast.value);
    } else {
      error.value = data.message || 'Şehir bulunamadı';
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
      timeZone: '',
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

// Veriyi App.vue'ya gönder
watch(weatherData, (newData) => {
  if (newData) {
    emit('weather-updated', newData);
  }
});

// Forecast verisini de gönder
watch(forecast, (newForecast) => {
  if (newForecast) {
    emit('forecast-updated', newForecast);
  }
});

</script>








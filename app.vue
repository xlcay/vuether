<template>

  <div class="min-h-screen bg-dark">
    <div class="container mx-auto px-4 py-8 flex flex-col items-center justify-center">
      <!-- Head -->
      <div class="flex flex-col items-center justify-center">
        <h1 class="text-3xl font-bold m-5 text-light">Vuether App</h1>
        <h2 class="text-lg font-medium text-center m-5 text-dark-gray/70 max-w-3xl">
          This project is designed to help you get maximum efficiency from your solar panels. Developed using Nuxt 3, Vue 3, and TailwindCSS technologies, our application receives real-time weather data via API and provides optimal angle suggestions for your solar panels.
        </h2>
        <animatedSun class="rounded-full bg-light bg-opacity-30 p-1 cursor-pointer hover:bg-opacity-50 transition-all"/>
      </div>
    </div>

    <!-- Content -->
     
    <div class="flex flex-row justify-center items-center gap-5">
      <WeatherCard />
      
    </div>
    <span class="text-light relative text-sm italic ">Calculations may be inaccurate due to OpenWeatherMap API limitations.</span>
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
  import { ref } from 'vue';
  import animatedSun from '~/components/animatedSun.vue';
  const isClicked = ref(false);
  function handleClick() {
    isClicked.value = !isClicked.value,
    console.log('clicked');
  }
  // Grab your API Key from runtime config
</script>

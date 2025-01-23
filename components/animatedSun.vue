<template>
    <div ref="lottieContainer" style="width: 48px; height: 48px;"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"></div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
import lottie from 'lottie-web'
import animationData from '~/assets/animation.json'

const lottieContainer = ref(null)
const animation = ref(null)

onMounted(() => {
  animation.value = lottie.loadAnimation({
    container: lottieContainer.value,
    renderer: 'svg',
    loop: true,             
    autoplay: false,         
    animationData: animationData
  })

  
  animation.value.goToAndStop(0, true)
})

function handleMouseEnter() {
 
  animation.value?.goToAndPlay(0, true)
}

function handleMouseLeave() {
  
  animation.value?.goToAndStop(0, true)
}
  </script>
  
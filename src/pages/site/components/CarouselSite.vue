<template>
  <q-carousel
    swipeable
    animated
    v-model="slide"
    :autoplay="autoplay"
    infinite
    arrows
    control-color="primary"
    navigation
    height="400px"
    class="rounded-borders"
  >
    <q-carousel-slide
      v-for="(item, index) in carroselImagens"
      :key="index"
      :name="index"
      :img-src="`${item.imagen}`"
    >
      <div class="absolute-bottom custom-caption">
        <div class="text-subtitle1">{{ item.description }}</div>
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>
<script setup>
import { ref } from 'vue';

const slide = ref("1");
const autoplay = ref(true);

const props = defineProps({
    carroselImagens: {type: Array, required: true}
})
</script>
<style scoped>
.banner-content {
  position: absolute;
  bottom: 20%;
  left: 10%;
  color: white;
}

.custom-caption {
  text-align: center;
  padding: 12px;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>

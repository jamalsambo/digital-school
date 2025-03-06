<template>
  <q-card
    class="q-pa-md text-white my-card"
    :style="`background: linear-gradient(135deg, ${item.color1}, ${item.color2})`
    "
    flat
  >
    <div class="row no-wrap items-center">
      <q-icon :name="item.icon" size="32px" class="q-mr-md" />
      <div>
        <div class="text-subtitle2">{{ item?.title }}</div>
        <div class="text-h6 text-weight-bold">{{ item?.value }}</div>
      </div>
    </div>
  </q-card>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: false,
  }
})
</script>

<style scoped>
.my-card {
  border-radius: 10px;

}
</style>

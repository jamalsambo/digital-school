<template>
  <q-card class="q-pa-md my-card" :style="`border-left: 5px solid ${item.color1}`">
    <q-item>
      <q-item-section>
        <q-item-label class="title">{{ item.title }}</q-item-label>
        <q-item-label class="amounts">
          {{ item.value }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup>

const props = defineProps(
  {
    item: {
      type: Object,
      required: true,
    }
  })

</script>

<style scoped>
.my-card {
  border-left: 5px solid #008080;
}
.title {
  font-size: 1.2em;
  font-weight: bold;
}
.amounts {
  font-size: 1em;
  color: #555;
}
</style>

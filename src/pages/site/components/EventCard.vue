<template>
  <q-card class="q-pa-md row items-center shadow-2 rounded-borders q-mb-sm">
    <!-- Data -->
    <div class="bg-grey-8 text-white column items-center q-pa-md q-mr-md rounded-borders" style="width: 70px;">
      <div class="text-h5">{{ day }}</div>
      <div class="text-caption">{{ month }}</div>
    </div>

    <!-- Conteúdo -->
    <div class="column">
      <div class="text-subtitle1 text-weight-bold">{{ title }}</div>
      <div class="row items-center q-mt-xs">
        <q-icon name="place" size="16px" class="q-mr-xs text-grey-7" />
        <span class="text-caption text-grey-7">{{ location }}</span>
      </div>
    </div>
  </q-card>
</template>

<script setup>
defineProps({
  day: { type: String, required: true },
  month: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true }
})
</script>

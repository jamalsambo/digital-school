<template>
  <q-card flat bordered class="q-pa-md q-mb-md">
    <div class="row items-center">
      <q-icon :name="icon" size="32px" class="q-mr-md text-primary" />
      <div class="column">
        <div class="text-h6">{{ title }}</div>
        <div class="text-body2 text-grey-7 q-mt-xs">{{ text }}</div>
      </div>
    </div>
  </q-card>
</template>

<script setup>
defineProps({
  title: String,
  text: String,
  icon: String
})
</script>

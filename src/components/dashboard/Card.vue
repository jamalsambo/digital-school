<template>
  <q-card class="bg-transparent no-shadow no-border" bordered>
    <q-card-section
      class="q-pa-none"
      :style="`background-color: ${item.color1}`"
    >
      <q-item class="q-pa-none">
        <q-item-section
          v-if="icon_position === 'left'"
          side
          :style="`background-color: ${item.color2}`"
          class="q-pa-lg q-mr-none text-white"
        >
          <q-icon :name="item.icon" color="white" size="24px"></q-icon>
        </q-item-section>
        <q-item-section class="q-pa-md q-ml-none text-white">
          <q-item-label class="text-white text-h6 text-weight-bolder">{{
            item.value
          }}</q-item-label>
          <q-item-label>{{ item.title }}</q-item-label>
        </q-item-section>

        <q-item-section
          v-if="icon_position === 'right'"
          side
          class="q-mr-md text-white"
        >
          <q-icon :name="item.icon" color="white" size="44px"></q-icon>
        </q-item-section>
      </q-item>
      <q-card-actions align="left">
        <q-btn
          flat
          color="white"
          label="Detalhes"
          @click="showDetails('Usuários Ativos')"
          icon="arrow_circle_right"
        />
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>
<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  icon_position: {
    required: false,
    default: "left",
  },
});
</script>

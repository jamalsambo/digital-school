<template>
  <q-card class="my-card" flat bordered>
    <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" />

    <q-card-section>
      <div class="text-overline text-orange-9">Overline</div>
      <div class="text-h5 q-mt-sm q-mb-xs">Title</div>
      <div class="text-caption text-grey">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </div>
    </q-card-section>

    <q-card-actions>
      <q-btn flat color="primary" label="Share" />
      <q-btn flat color="secondary" label="Book" />

      <q-space />

      <q-btn
        color="grey"
        round
        flat
        dense
        :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        @click="expanded = !expanded"
      />
    </q-card-actions>

    <q-slide-transition>
      <div v-show="expanded">
        <q-separator />
        <q-card-section class="text-subtitle2">
          {{ lorem }}
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>
<script setup>
import { ref } from 'vue';

const expanded = ref()
</script>

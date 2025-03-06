<template>
  <q-table
    class="no-shadow"
    :rows="rows"
    :title="title"
    :columns="columns"
    row-key="id"
    :filter="filter"
    v-model:pagination="pagination"
  >
    <template v-slot:top-right="">
      <q-input
        borderless
        dense
        debounce="300"
        v-model="filter"
        placeholder="Pesquisar"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <slot name="new"></slot>
    </template>
    <template v-slot:body-cell-penalts="props">
      <slot name="penalts" :penalts="props.row.payment.penalts"></slot>
    </template>

    <template v-slot:body-cell-actions="props">
      <slot name="actions" :props="props"></slot>
    </template>
  </q-table>
</template>

<script setup>
import { defineProps, ref } from "vue";
defineProps({
  rows: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
});

const filter = ref();
const pagination = ref({
  rowsPerPage: 10,
  page: 1,
});
</script>

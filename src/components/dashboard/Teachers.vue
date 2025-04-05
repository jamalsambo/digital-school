<template>
  <q-card class="q-pa-md my-card" :style="`border-left: 5px solid  ${item.color1}`">
    <q-item>
      <q-item-section>
        <q-img :src="`${item?.img}`"  style="width: 50px; height: 50px;">
          <template v-slot:error>
            <div class="text-red">Erro ao carregar imagem</div>
          </template>
        </q-img>
      </q-item-section>
      <q-item-section class="right">
        <q-item-label class="title">{{item.title}}</q-item-label>
        <q-item-label class="amounts">
        {{ item.value }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
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

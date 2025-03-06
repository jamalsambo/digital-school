<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Gerenciador de Arraste e Solte</div>
      </q-card-section>

      <q-card-section>
        <div class="row q-gutter-md">
          <!-- Primeira lista -->
          <q-card class="col-6">
            <q-card-section>
              <div class="text-subtitle1">Lista 1</div>
            </q-card-section>

            <q-card-section>
              <draggable
                v-model="list1"
                group="items"
                @start="onDragStart"
                @end="onDragEnd"
              >
                <q-item
                  v-for="item in list1"
                  :key="item.id"
                  clickable
                  class="q-mb-sm"
                >
                  <q-item-section>{{ item.name }}</q-item-section>
                </q-item>
              </draggable>
            </q-card-section>
          </q-card>

          <!-- Segunda lista -->
          <q-card class="col-6">
            <q-card-section>
              <div class="text-subtitle1">Lista 2</div>
            </q-card-section>

            <q-card-section>
              <draggable
                v-model="list2"
                group="items"
                @start="onDragStart"
                @end="onDragEnd"
              >
                <q-item
                  v-for="item in list2"
                  :key="item.id"
                  clickable
                  class="q-mb-sm"
                >
                  <q-item-section>{{ item.name }}</q-item-section>
                </q-item>
              </draggable>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import draggable from 'vuedraggable';

// Duas listas de itens
const list1 = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
]);

const list2 = ref([
  { id: 4, name: 'Item 4' },
  { id: 5, name: 'Item 5' },
]);

// Funções de manipulação
const onDragStart = (event) => {
  console.log('Início do arraste:', event);
};

const onDragEnd = (event) => {
  console.log('Fim do arraste:', event);
};
</script>

<style scoped>
/* Adiciona espaçamento entre itens arrastáveis */
.q-item {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  background-color: #f9f9f9;
  cursor: grab;
}
.q-item:active {
  cursor: grabbing;
}
</style>

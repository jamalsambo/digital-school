<template>
  <q-dialog v-model="props.precedenceDialog">
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">
          Definir Precedência para "{{ currentDiscipline?.name }}"
        </div>
      </q-card-section>
      <q-card-section>
        <q-select
          v-model="currentDiscipline.precedence"
          :options="
            globallyAllocatedDisciplines.filter(
              (d) => d.activityId !== currentDiscipline?.activityId
            )
          "
          label="Pré-requisitos"
          emit-value
          map-options
          option-label="name"
          outlined
          dense
          @update:model-value="
            HandledAddPrecedence(currentDiscipline.precedence)
          "
        />
      </q-card-section>

      <q-card-section>
        <q-list bordered>
          <q-item
            v-for="(precedente, index) in currentDiscipline.precendentes"
            :key="index"
          >
            <q-item-section>
              {{
                globallyAllocatedDisciplines.find(
                  (d) => d.id === precedente.prerequisiteId
                )?.name || "Não encontrada"
              }}
            </q-item-section>
            <q-item-section side>
              <q-btn
                dense
                flat
                icon="delete"
                color="red"
                :title="'Remover Disciplina'"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right">
        <slot name="actions"></slot>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { computed } from "vue";

const props = defineProps({
  precedenceDialog: { type: Boolean, required: true },
  currentDiscipline: { type: Object, required: true },
  allocatedDisciplines: { type: Object, require: true },
  HandledAddPrecedence: { type: Function, required: true },
});

const globallyAllocatedDisciplines = computed(() => {
  return Object.values(props.allocatedDisciplines)
    .flat()
    .map((d) => {
      return { id: d.id, activityId: d.activityId, name: d.activity.name };
    }); // ou d.disciplineId dependendo da estrutura real
});
</script>

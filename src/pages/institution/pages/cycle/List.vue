<template>
  <q-page padding>
    <div class="q-pa-md">
      <!-- Cabeçalho -->
      <div class="text-h6 q-mb-md">Lista de Ciclos</div>

      <!-- Mobile: QList com botões -->
      <q-list
        bordered
        class="rounded-borders bg-white shadow-1"
        v-if="$q.screen.lt.md"
      >
        <q-item
          v-for="cycle in cycles"
          :key="cycle.id"
          class="q-mb-sm"
          clickable
          v-ripple
        >
          <q-item-section>
            <q-item-label class="text-subtitle1 text-primary">
              {{ cycle.name }}
            </q-item-label>
            <q-item-label caption>
              {{ formatDate(cycle.startDate) }} até
              {{ formatDate(cycle.endDate) }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-btn
              dense
              flat
              round
              color="primary"
              icon="edit"
              @click.stop="editCycle(cycle)"
            />
            <q-btn
              dense
              flat
              round
              color="negative"
              icon="delete"
              @click.stop="deleteCycle(cycle)"
            />
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Desktop: QTable com botões -->
      <q-table
        v-else
        flat
        bordered
        :rows="cycles"
        :columns="columns"
        row-key="id"
        :pagination="{ rowsPerPage: 5 }"
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

          <q-btn
            color="primary"
            icon="add"
            label="Adicionar"
            no-caps
            class="q-ml-sm"
            @click="handleCreateCycle"
          />
        </template>
        <!-- Custom dates -->
        <template #body-cell-dates="{ row }">
          <q-td>
            {{ formatDate(row.startDate) }} até {{ formatDate(row.endDate) }}
          </q-td>
        </template>

        <!-- Ações -->
        <template #body-cell-actions="{ row }">
          <q-td>
            <q-btn
              dense
              flat
              round
              color="primary"
              icon="edit"
              @click="editCycle(row)"
            />
            <q-btn
              dense
              flat
              round
              color="negative"
              icon="delete"
              @click="deleteCycle(row)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { date } from "quasar";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/pages/auth/store";
import { useInstitutionStores } from "../../store";

/* router */
const router = useRouter()

/* stores */
const authStore = useAuthStore()
const institutionStores = useInstitutionStores()

// Dados de exemplo
const cycles = ref([]);

// Colunas para a QTable
const columns = [
  { name: "name", label: "Nome", field: "name", align: "left" },
  { name: "dates", label: "Período", field: "dates", align: "left" },
  { name: "actions", label: "Ações", field: "actions", align: "right" },
];

// Funções de formatação
function formatDate(val) {
  return date.formatDate(val, "DD/MM");
}

// Ações
const handleCreateCycle = () => {
  router.push({
    name: 'cycle-create'
  })
}
function editCycle(cycle) {
  console.log("Editar ciclo:", cycle);
  // abrir modal ou navegar para edição
}

function deleteCycle(cycle) {
  console.log("Deletar ciclo:", cycle);
  // confirmar e deletar
}

/* fetch data */
const fetchData = async () => {
  try {
    await institutionStores.listCycles(authStore.user?.institutionId)
    cycles.value = institutionStores.cycles
  } catch (error) {
    console.log(error)
  }
}
onMounted( async () => {
  await fetchData()
})
</script>

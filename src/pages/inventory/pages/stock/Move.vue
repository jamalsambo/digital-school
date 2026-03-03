<template>
  <q-page class="edigital-page">

    <!-- ── Top Bar ── -->
    <div class="page-topbar row items-center q-px-xl q-py-md">
      <q-btn flat round dense icon="arrow_back_ios_new" class="back-btn q-mr-md" @click="$router.back()">
        <q-tooltip>Voltar</q-tooltip>
      </q-btn>

      <div class="col">
        <q-breadcrumbs class="breadcrumb-nav" active-color="primary" separator="›">
          <q-breadcrumbs-el label="Dashboard" icon="home" to="/" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Estoque" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Resumo de Movimentos" class="breadcrumb-active" />
        </q-breadcrumbs>
        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="compare_arrows" size="1.3rem" color="white" />
          </div>
          <span>Resumo de Movimentos</span>
        </div>
      </div>

      <div class="col-auto row items-center q-gutter-sm">
        <q-btn flat round dense icon="refresh" color="grey-6" class="action-icon-btn" :loading="loading" @click="fetchStockMoves">
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>
      </div>
    </div>

    <div class="q-px-xl q-pb-xl">

      <!-- ── Stats ── -->
      <div class="row q-col-gutter-md q-mt-lg q-mb-lg">

        <div class="col-md-4 col-sm-6 col-xs-12">
          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(26,63,166,0.1)">
              <q-icon name="compare_arrows" size="1.3rem" style="color:#1a3fa6" />
            </div>
            <div>
              <div class="stat-value">{{ stockMoves.length }}</div>
              <div class="stat-label">Total de Movimentos</div>
            </div>
          </div>
        </div>

        <div class="col-md-4 col-sm-6 col-xs-12">
          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(33,181,115,0.1)">
              <q-icon name="arrow_downward" size="1.3rem" style="color:#21b573" />
            </div>
            <div>
              <div class="stat-value" style="color:#0d7040">
                {{ stockMoves.filter(m => m.type === 'in' || m.type === 'Entrada').length }}
              </div>
              <div class="stat-label">Entradas</div>
            </div>
          </div>
        </div>

        <div class="col-md-4 col-sm-6 col-xs-12">
          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(220,38,38,0.08)">
              <q-icon name="arrow_upward" size="1.3rem" style="color:#dc2626" />
            </div>
            <div>
              <div class="stat-value" style="color:#b91c1c">
                {{ stockMoves.filter(m => m.type === 'out' || m.type === 'Saida').length }}
              </div>
              <div class="stat-label">Saídas</div>
            </div>
          </div>
        </div>

      </div>

      <!-- ── Table ── -->
      <div class="section-block">
        <div class="section-header-bar row items-center justify-between q-px-lg q-py-md">
          <div class="row items-center">
            <div class="section-icon-wrap q-mr-sm">
              <q-icon name="table_view" size="1rem" color="white" />
            </div>
            <div>
              <div class="section-title">Lista de Movimentos</div>
              <div class="section-sub">{{ stockMoves.length }} movimento(s) registado(s)</div>
            </div>
          </div>

          <!-- Search inline -->
          <q-input
            v-model="search"
            outlined dense
            placeholder="Pesquisar..."
            style="max-width:220px"
            class="custom-input"
          >
            <template #prepend><q-icon name="search" color="grey-5" size="1rem" /></template>
            <template #append>
              <q-icon v-if="search" name="close" size="0.9rem" class="cursor-pointer" color="grey-5" @click="search = ''" />
            </template>
          </q-input>
        </div>

        <q-separator />

        <!-- Loading -->
        <div v-if="loading" class="column items-center q-pa-xl">
          <q-spinner-dots color="primary" size="2.5rem" />
          <div class="text-grey-5 q-mt-sm" style="font-size:0.85rem">A carregar movimentos...</div>
        </div>

        <!-- Empty -->
        <div v-else-if="!filteredMoves.length" class="empty-state">
          <q-icon name="compare_arrows" size="3.5rem" color="grey-3" class="q-mb-sm" />
          <div class="empty-title">Nenhum movimento encontrado</div>
          <div class="empty-sub">{{ search ? 'Tente outro termo de pesquisa' : 'Ainda não existem movimentos registados' }}</div>
        </div>

        <!-- Table -->
        <div v-else>
          <q-table
            :rows="filteredMoves"
            :columns="columns"
            row-key="id"
            flat
            :pagination="{ rowsPerPage: 10 }"
            class="edigital-table"
            :rows-per-page-options="[10, 25, 50]"
          >
            <!-- Type badge -->
            <template #body-cell-type="props">
              <q-td :props="props">
                <span class="type-badge"
                  :class="(props.value === 'in' || props.value === 'Entrada') ? 'badge-in' : 'badge-out'"
                >
                  <q-icon :name="(props.value === 'in' || props.value === 'Entrada') ? 'arrow_downward' : 'arrow_upward'" size="0.75rem" />
                  {{ (props.value === 'in' || props.value === 'Entrada') ? 'Entrada' : 'Saída' }}
                </span>
              </q-td>
            </template>
          </q-table>
        </div>

      </div>

    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useInventoryStores } from '../../stores';
import columns from './components/TableColumnsMove';

/* ── Stores ── */
const inventoryStores = useInventoryStores();

/* ── Data ── */
const stockMoves = ref([]);
const loading    = ref(false);
const search     = ref('');

/* ── Computed ── */
const filteredMoves = computed(() => {
  if (!search.value) return stockMoves.value;
  const needle = search.value.toLowerCase();
  return stockMoves.value.filter(m =>
    Object.values(m).some(v => String(v).toLowerCase().includes(needle))
  );
});

/* ── Fetch ── */
const fetchStockMoves = async () => {
  loading.value = true;
  try {
    await inventoryStores.findStockMove();
    stockMoves.value = inventoryStores.moves;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchStockMoves();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

.edigital-page {
  min-height: 100vh;
  background: #f0f4f8;
  font-family: 'DM Sans', sans-serif;
}

/* ── Top Bar ── */
.page-topbar {
  background: #ffffff;
  border-bottom: 1px solid #e8edf3;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 12px rgba(15,40,98,0.06);
}
.back-btn {
  background: #f0f4f8;
  color: #1a3fa6 !important;
  border-radius: 10px;
  width: 36px; height: 36px;
  transition: background 0.2s;
}
.back-btn:hover { background: #e0e8f7; }
.breadcrumb-nav { font-size: 0.78rem; }
.breadcrumb-link { color: #9ca3af !important; }
.breadcrumb-active { color: #1a3fa6 !important; font-weight: 600; }
.page-title {
  font-family: 'Sora', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f2862;
}
.title-icon-wrap {
  width: 32px; height: 32px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.action-icon-btn {
  background: #f0f4f8;
  border-radius: 10px;
  width: 36px; height: 36px;
  transition: background 0.2s;
}
.action-icon-btn:hover { background: #e0e8f7; }

/* ── Stat Cards ── */
.stat-card {
  background: white;
  border-radius: 14px;
  padding: 1rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  box-shadow: 0 2px 12px rgba(15,40,98,0.05);
  border: 1px solid #edf0f5;
  transition: box-shadow 0.2s, transform 0.15s;
}
.stat-card:hover { box-shadow: 0 6px 20px rgba(15,40,98,0.10); transform: translateY(-2px); }
.stat-icon {
  width: 48px; height: 48px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.stat-value {
  font-family: 'Sora', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: #0f2862;
  line-height: 1;
}
.stat-label { font-size: 0.78rem; color: #9ca3af; margin-top: 3px; font-weight: 500; }

/* ── Section Block ── */
.section-block {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(15,40,98,0.07);
  border: 1px solid #edf0f5;
}
.section-header-bar { background: #fafbfd; flex-wrap: wrap; gap: 0.5rem; }
.section-icon-wrap {
  width: 30px; height: 30px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.section-title {
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 0.92rem;
  color: #0f2862;
}
.section-sub { font-size: 0.74rem; color: #9ca3af; }

/* ── Search Input ── */
.custom-input :deep(.q-field__control) {
  border-radius: 10px;
  background: #f8fafc;
}

/* ── Table ── */
.edigital-table :deep(thead tr th) {
  font-family: 'Sora', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
  background: #fafbfd;
  padding: 12px 16px;
}
.edigital-table :deep(tbody tr:hover) { background: #f5f8ff !important; }
.edigital-table :deep(tbody tr td) {
  font-size: 0.875rem;
  color: #374151;
  padding: 11px 16px;
  border-bottom: 1px solid #f3f4f6;
}
.edigital-table :deep(.q-table__bottom) {
  font-size: 0.8rem;
  color: #9ca3af;
}

/* ── Type Badge ── */
.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}
.badge-in  { background: #dcfce7; color: #15803d; }
.badge-out { background: #fee2e2; color: #b91c1c; }

/* ── Empty State ── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 2rem;
  text-align: center;
}
.empty-title {
  font-family: 'Sora', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 4px;
}
.empty-sub { font-size: 0.8rem; color: #d1d5db; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar { padding: 0.75rem 1rem; flex-wrap: wrap; gap: 0.5rem; }
  .edigital-page .q-px-xl { padding-left: 1rem !important; padding-right: 1rem !important; }
}
</style>

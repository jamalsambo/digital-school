<template>
  <q-table
    title="Facturas"
    :rows="invoices"
    :columns="columns"
    row-key="id"
    flat
    bordered
    :pagination="{ rowsPerPage: 10 }"
    :grid="$q.screen.lt.md"
  >
    <!-- 🎯 MODO CARD (para mobile) -->
    <template v-slot:item="props">
      <q-card class="q-mb-sm col-xs-12">
        <q-card-section>
          <!-- Dados principais -->
          <div v-for="col in props.cols" :key="col.name" class="q-mb-xs">
            <div class="text-caption text-grey-8">{{ col.label }}</div>
            <div class="text-body2">{{ col.value }}</div>
          </div>

          <!-- Botão expandir -->
          <q-btn
            size="sm"
            color="primary"
            round
            class="q-mt-sm"
            @click.stop="props.expand = !props.expand"
            :icon="props.expand ? 'remove' : 'add'"
          />
        </q-card-section>

        <!-- Conteúdo expandido -->
        <q-slide-transition>
          <div v-show="props.expand" class="q-pa-sm bg-grey-2">
            <!-- Itens da factura -->
            <div v-if="props.row.items?.length">
              <div class="text-subtitle2 q-mb-sm">Items da factura</div>
              <q-list dense bordered>
                <q-item v-for="(item, idx) in props.row.items" :key="idx">
                  <q-item-section>
                    <q-item-label>{{ item.amount }}</q-item-label>
                    <q-item-label caption>{{ item.description }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <!-- Multas aplicadas -->
            <div v-if="props.row.penalts?.length" class="q-mt-sm">
              <div class="text-subtitle2 q-mb-sm">Multas Aplicadas</div>
              <q-list dense bordered>
                <q-item v-for="(fine, idx) in props.row.penalts" :key="idx">
                  <q-item-section>
                    <q-item-label>{{ fine.amount }}</q-item-label>
                    <q-item-label caption>{{ fine.paymentNote }}</q-item-label>
                    <q-item-label caption>{{ fine.createdAt }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <!-- Botão de ação -->
            <div v-if="!props.row.number" class="q-mt-sm">
              <q-btn
                color="primary"
                icon="check"
                label="Gerar factura"
                flat
                dense
                @click="handleRowClick(props.row.month, props.row.amount)"
              />
            </div>
          </div>
        </q-slide-transition>
      </q-card>
    </template>

    <!-- 🖥️ TABELA NORMAL (para desktop) -->
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
        </q-td>
        <q-td auto-width>
          <q-btn
            size="sm"
            color="primary"
            round
            @click.stop="props.expand = !props.expand"
            :icon="props.expand ? 'remove' : 'add'"
          />
        </q-td>
      </q-tr>

      <q-tr v-show="props.expand" :props="props">
        <q-td colspan="100%">
          <div class="q-pa-md bg-grey-2">
            <div v-if="props.row.items?.length">
              <div class="text-subtitle2 q-mb-sm">Items da factura</div>
              <q-list bordered>
                <q-item v-for="(item, idx) in props.row.items" :key="idx">
                  <q-item-section>
                    <q-item-label>{{ item.amount }}</q-item-label>
                    <q-item-label caption>{{ item.description }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <div v-if="props.row.penalts?.length" class="q-mt-sm">
              <div class="text-subtitle2 q-mb-sm">Multas Aplicadas</div>
              <q-list bordered>
                <q-item v-for="(fine, idx) in props.row.penalts" :key="idx">
                  <q-item-section>
                    <q-item-label>{{ fine.amount }}</q-item-label>
                    <q-item-label caption>{{ fine.paymentNote }}</q-item-label>
                    <q-item-label caption>{{ fine.createdAt }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <div v-if="!props.row.number" class="q-mt-sm">
              <q-btn
                color="primary"
                icon="check"
                label="Gerar factura"
                flat
                dense
                @click="handleRowClick(props.row.month, props.row.amount)"
              />
            </div>
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>
<script setup>
import columns from "../components/InvoiceColumns";
const props = defineProps({
  invoices: { type: Array, required: true },
  handleRowClick: { type: Function, required: false}
});
</script>

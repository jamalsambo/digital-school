<template>
  <q-page padding>
    <q-dialog v-model="medium" persistent>
      <q-card style="width: 900px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">Adicionar despesas</div>
        </q-card-section>
        <q-separator spaced />
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <div class="row q-col-gutter-sm">
            <q-select
              class="col-md-6 col-sm-12 col-xs-12"
              v-model="form.categoryId"
              :options="categories"
              label="Categoria"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              outlined
              dense
            />
            <q-input
              class="col-md-6 col-sm-12 col-xs-12"
              v-model="form.description"
              placeholder="Digite a despesa"
              outlined
              dense
              label="Despesa"
            />
            <q-input
              class="col-md-6 col-sm-12 col-xs-12"
              v-model="form.amount"
              placeholder="Digite o valor da despensa"
              outlined
              dense
              label="Valor da despesa"
            />
            <q-select
              class="col-md-6 col-sm-12 col-xs-12"
              v-model="form.paymentMethod"
              :options="[
                'Mpesa',
                'eMola',
                'mKesh',
                'Numerário',
                'Depósito Bancário',
                'Cartão Bancário',
                'Cheque Bancário',
                'Transferência',
              ]"
              label="Metodo de pagamento"
              outlined
              dense
            />
            <q-input
              class="col-md-6 col-sm-6 col-xs-12"
              v-model="form.date"
              type="date"
              label="Data da despensa"
              outlined
              dense
            />
            <q-select
              class="col-md-6 col-sm-12 col-xs-12"
              v-model="form.status"
              :options="['Pago', 'Atrasado', 'Pendente']"
              label="Estado"
              outlined
              dense
            />
            <q-input
              class="col-md-6 col-sm-6 col-xs-12"
              v-model="form.receipt"
              label="Comprovate de recebimento"
              outlined
              dense
            />
          </div>

          <div class="row justify-end q-gutter-sm">
            <q-btn
              label="Cancelar"
              color="negative"
              icon="close"
              outline
              @click="toggleModal"
              class="q-mr-sm"
              flat
            />
            <q-btn
              label="Guardar"
              color="positive"
              icon="save"
              type="submit"
              flat
            />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
    <Tables :columns="columns" :rows="expenses">
      <template #new>
        <q-btn
          color="primary"
          icon="add"
          label="Adicionar"
          no-caps
          @click="toggleModal"
          class="q-ml-sm"
        />
      </template>
    </Tables>
  </q-page>
</template>
<script setup>
import { onMounted, ref } from "vue";
import Tables from "src/components/Tables.vue";
import { useExpenseStores } from "../store";
import useNotify from "src/composables/UseNotify";
import columns from "../components/columns/expenses";

/* use store */
const expenseStores = useExpenseStores();
const { notifyError, notifySuccess } = useNotify();

/* data */
const expenses = ref([]);
const categories = ref([]);
const medium = ref(false);
const form = ref({
  categoryId: "",
  description: "",
  amount: "",
  paymentMethod: "",
  date: "",
  status: "",
  receipt: "",
});

/* Methods */
const onSubmit = async () => {
  try {
      await expenseStores.create(form.value);
      toggleModal();
      fetchExpenses();
      notifySuccess("Categoria criado com sucesso!");
    } catch (error) {
      console.error("Error adding category:", error);
    }
};
const toggleModal = () => {
  medium.value = !medium.value;
};

/* fetch data */
const fetchExpenses = async () => {
  try {
    await expenseStores.findAll();
    expenses.value = expenseStores.expenses;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};
const fetchCategories = async () => {
  try {
    await expenseStores.findCategory();
    categories.value = expenseStores.expenseCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

onMounted(() => {
  fetchExpenses();
  fetchCategories();
});
</script>

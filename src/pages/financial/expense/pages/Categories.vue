<template>
  <q-page padding>
    <q-dialog v-model="medium" persistent>
    <q-card style="width: 900px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Adicionar categoria da dispesa</div>
      </q-card-section>
      <q-separator spaced />
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <div class="row q-col-gutter-sm">
          <q-input
            class="col-md-12 col-sm-12 col-xs-12"
            v-model="name"
            placeholder="Digite o nome"
            outlined
            dense
            label="Nome da categoria da dispesa"
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
    <Tables :columns="columns" :rows="categories">
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

/* use store */
const expenseStores = useExpenseStores();
const { notifyError, notifySuccess } = useNotify();

/* data */
const categories = ref([]);
const medium = ref(false)
const name = ref()
const columns = [
  {
    label: "Category",
    field: "name",
    sortable: true,
    align: "left",
  },
];

/* Methods */
const onSubmit = async () => {
  if (name.value) {
    try {
      await expenseStores.createCategory({name: name.value});
      name.value = "";
      toggleModal();
      fetchCategories();
      notifySuccess("Categoria criado com sucesso!");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  }
};
const toggleModal = () => {
  medium.value = !medium.value;
};

/* fetch data */
const fetchCategories = async () => {
  try {
    await expenseStores.findCategory();
    categories.value = expenseStores.expenseCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

onMounted(() => {
  fetchCategories();
});
</script>

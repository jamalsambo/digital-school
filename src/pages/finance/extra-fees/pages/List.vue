<template>
  <q-dialog v-model="medium1" persistent>
    <q-card style="width: 900px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Adicionar pagamentos extras</div>
      </q-card-section>
      <q-separator spaced />

      <q-card-section>
        <q-list bordered>
          <q-item v-for="course in updatedCourses" :key="course.id">
            <q-item-section>
              <div
                class="text-bold text-uppercase bg-primary text-white q-pa-sm rounded-borders"
              >
                {{ course.name }}
              </div>
              <q-list padding bordered class="rounded-borders">
                <q-item v-for="(classe, index) in course.classes" :key="index">
                  <q-item-section>
                    <q-checkbox
                      right-label
                      v-model="classe.hasExtraFees"
                      :label="classe.name"
                      :val="classe.id"
                      @update:model-value="
                        onChange(classe.hasExtraFees, classe.id)
                      "
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <div class="row justify-end q-gutter-sm">
        <q-btn
          label="Cancelar"
          color="negative"
          icon="close"
          outline
          @click="toggleModal1"
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
    </q-card>
  </q-dialog>
  <!-- Modal para criacao de pagamentos extras -->
  <q-dialog v-model="medium" persistent>
    <q-card style="width: 900px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Adicionar pagamentos extras</div>
      </q-card-section>
      <q-separator spaced />
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <div class="row q-col-gutter-sm">
          <q-input
            class="col-md-6"
            v-model="form.name"
            placeholder="Digite o nome"
            outlined
            dense
            label="Nome d de pagamento"
          />
          <q-input
            class="col-md-6"
            v-model="form.amount"
            placeholder="Digite o valor"
            outlined
            dense
            label="Valor de pagamento"
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
  <q-page padding>
    <Tables :columns="columns" :rows="extraFees" :title="title">
      <template #new>
        <q-btn
          color="primary"
          icon="add"
          label="Adicionar"
          no-caps
          @click="addExtraFees"
          class="q-ml-sm"
        />
      </template>

      <template #actions="{ props }">
        <q-btn
          color="primary"
          icon="edit"
          @click="editExtrasFees(props)"
          flat=""
        />
        <q-btn
          color="primary"
          icon="login"
          @click="addToClass(props)"
          flat=""
        />
      </template>
    </Tables>
  </q-page>
</template>
<script setup>
import Tables from "src/components/Tables.vue";
import { useExtraFeeStores } from "../stores";
import { useCourseStores } from "src/pages/course/store";
import columns from "../components/columns/fees";
import { onMounted, ref } from "vue";
import useNotify from "src/composables/UseNotify";

/* use store */
const extraFeeStore = useExtraFeeStores();
const courseStore = useCourseStores();
const { notifyError, notifySuccess } = useNotify();

/* data */
const extraFees = ref([]);
const extraFee = ref();
const courses = ref([]);
const updatedCourses = ref([]);
const title = ref("Pagamentos extras");
const medium = ref();
const medium1 = ref();
const form = ref({
  name: "",
  amount: "",
});

/* Methods */
const onSubmit = async () => {
  try {
    if (extraFee.value) {
      console.log("edura");
    } else {
      await extraFeeStore.create(form.value);
      notifySuccess("Pagamentos extras criado com sucesso");
    }
    await fetchExtraFees();
    toggleModal();
  } catch (error) {
    notifyError("Erro ao criar pagamentos extras");
  }
};



const addExtraFees = () => {
  toggleModal();
};

const fetchExtraFees = async () => {
  try {
    await extraFeeStore.list();
    extraFees.value = extraFeeStore.extraFees;
  } catch (error) {
    console.error(error);
  }
};

const fetchCourses = async () => {
  try {
    await courseStore.list();
    courses.value = courseStore.courses;
  } catch (error) {
    console.error(error);
    notifyError("Erro ao carregar curso");
  }
};

const addToClass = (props) => {
  updatedCourses.value = courses.value.map((course) => ({
    ...course,
    classes: course.classes.map((classItem) => ({
      ...classItem,
      hasExtraFees: classItem.extraFees.some((fee) => fee.id === props.key && classItem.id),
    })),
  }));
  extraFee.value = props.key

  toggleModal1();
};

const toggleModal = () => {
  medium.value = !medium.value;
};
const toggleModal1 = () => {
  medium1.value = !medium1.value;
};
onMounted(() => {
  fetchExtraFees(), fetchCourses();
});
</script>

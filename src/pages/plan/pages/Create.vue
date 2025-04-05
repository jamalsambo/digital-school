<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Criar planos</div>
        <q-separator spaced />
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleSubmit">
          <div class="row q-col-gutter-sm">
            <q-input
              class="col-md-4 col grow col-sm-12 col-xs-12"
              v-model="form.name"
              label="Nome do sala"
              placeholder="Digite o nome do sala"
              outlined
              :rules="[(val) => !!val || 'O nome é obrigatório.']"
              dense
            />
            <q-input
              class="col-md-4 col grow col-sm-12 col-xs-12"
              v-model="form.price"
              label="Preço"
              type="number"
              placeholder="Digite o preço"
              outlined
              :rules="[(val) => !!val || 'O preço é obrigatório.']"
              dense
              suffix="MTN"
            />
            <q-select
              class="col-md-4 col grow col-sm-12 col-xs-12"
              v-model="form.educationLevelId"
              :options="educationLevels"
              option-label="name"
              option-value="id"
              label="Nível de ensino"
              outlined
              dense
              emit-value
              maps-values
            />
            <q-editor
              class="col-md-12 col grow col-sm-12 col-xs-12"
              v-model="form.benefits"
              min-height="150px"
              :toolbar="[
                ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
              ]"
              placeholder="Escreva sua mensagem aqui..."
            />
          </div>
          <div class="row justify-end q-gutter-sm">
            <q-btn
              label="Cancelar"
              color="negative"
              icon="close"
              outline
              @click="router.back()"
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
      </q-card-section>
      <q-separator space />
      <q-card-section v-if="planId">
        <div class="text-h6">Benificios</div>
        <q-separator spaced />
        <q-list bordered>
          <q-item
            v-for="permission in permissions"
            :key="permission.id"
            clickable
          >
            <q-item-section>
              <div class="row q-col-gutter-sm">
                <q-checkbox
                  class="col-md-4 col-sm-12 col-xs-12"
                  v-model="permission.checked"
                  :val="permission.id"
                  @update:model-value="
                    updateSelection(permission.id, permission.checked)
                  "
                  :label="permission.name"
                  dense
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useComposablesStores } from "src/composables";
import { usePlanStores } from "../stores";
import { useRoute, useRouter } from "vue-router";
import useNotify from "src/composables/UseNotify";

/* setup router */
const router = useRouter();
const route = useRoute();

/* setup stores */
const composablesStores = useComposablesStores();
const planStores = usePlanStores();
const { notifyError, notifySuccess } = useNotify();

/* setup data */
const { planId } = route.params;
const educationLevels = ref([]);
const permissions = ref([]);
const form = ref({
  name: "",
  price: "",
  benefits: "",
  educationLevelId: "",
});

/* setup methods */
const handleSubmit = async () => {
  const payload = {
    ...form.value,
    price: parseInt(form.value.price),
  };
  try {
    if (planId) {
      await planStores.update(planId, payload);
      notifySuccess("Plano de pagemento atualizado com sucesso");
    } else {
      await planStores.create(payload);
      notifySuccess("Plano de pagemento criado com sucesso");
    }
    router.back();
  } catch (error) {
    notifyError("Erro na criaçao de plano de pagemento");
  }
};

const updateSelection = async (permission, checked) => {
  try {
    if (checked) {
      await planStores.addPlanPermission(planId, permission)
    }else {

    }
  } catch (error) {
      notifyError("Erro na alocaçao de permissao");
  }
}

/* fetch data */
const fetchEducation = async () => {
  try {
    await composablesStores.findEducationLevels();
    educationLevels.value = composablesStores.educationLevels;
  } catch (error) {
    notifyError("Erro no carregamento de niveis de educaçao")
  }
};

const fetchPermissions = async () => {
  if(planId){
  try {
    await planStores.permissions();
    permissions.value = planStores.permissions.map((permission) => {
      const planPermissions = planStores.plan.permissions.find(
        (f) => f.id === permission.id
      );
      return {
        id: permission.id,
        name: permission.name,
        checked: planPermissions ? true : false,
      };
    });
  } catch (error) {
    notifyError("Erro a carregar permissoes");
  }
}
};

const fetchPlan = async () => {
  if (planId) {
    try {
      await planStores.findOne(planId);
      form.value = planStores.plan;
    } catch (error) {
      notifyError("Erro a carregar plano de pagemento");
    }
  }
};

onMounted(async () => {
  await fetchPlan();
  await fetchEducation();
  await fetchPermissions();
});
</script>

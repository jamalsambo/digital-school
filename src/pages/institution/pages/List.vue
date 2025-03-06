<template>
  <q-page padding>
    <SettingsInstitutionComponent
      ref="settingsChild"
      :education-level="educationLevel"
      :shifts="shifts"
      :id="institutionId"
    >
    </SettingsInstitutionComponent>
    <div class="row q-col-gutter-sm">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card class="text-grey-8 no-shadow" bordered>
          <q-card-section class="q-pa-none">
            <q-table
              class="no-shadow"
              :rows="institutions"
              title="Instituições"
              :columns="columns"
              row-key="id"
              :filter="filter"
              v-model:pagination="pagination"
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
                  @click="addInstitution"
                  class="q-ml-sm"
                />
              </template>

              <template v-slot:body-cell-actions="props">
                <q-btn
                  v-if="props.row.status === 'Activo'"
                  flat
                  round
                  icon="settings"
                  color="secondary"
                  @click="handleSettings(props.row)"
                >
                  <q-tooltip> Botão para configuração da instituição</q-tooltip>
                </q-btn>

                <q-btn
                  v-if="props.row.status === 'Activo'"
                  flat
                  round
                  icon="edit"
                  color="primary"
                  @click="editInstitution(props.row)"
                >
                  <q-tooltip> Botao de editar de Instituicao </q-tooltip>
                </q-btn>

                <q-btn
                  v-if="
                    props.row.status === 'Activo' ||
                    props.row.status === 'Suspenso'
                  "
                  flat
                  round
                  icon="delete"
                  color="negative"
                  @click="deleteInstitution(props.row)"
                >
                  <q-tooltip> Botao para deletar instituicao </q-tooltip>
                </q-btn>

                <q-btn
                  v-if="!props.row.parentId && props.row.status === 'Activo'"
                  flat
                  round
                  icon="escalator_warning"
                  color="primary"
                  @click="createSucursal(props.row)"
                >
                  <q-tooltip> Botao para adicionar sucursal </q-tooltip>
                </q-btn>

                <q-btn
                  flat
                  round
                  icon="language"
                  color="primary"
                  @click="handleSettingsSite(props.row)"
                >
                  <q-tooltip> Botao para adicionar sucursal </q-tooltip>
                </q-btn>

              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useInstitutionStores } from "../store";
import useNotify from "src/composables/UseNotify";
import SettingsInstitutionComponent from "../components/SettingsInstitution.vue";

// use store
const institutuinStores = useInstitutionStores();
const { notifyError, notifySuccess } = useNotify();

// data
const filter = ref("");
const router = useRouter();
const pagination = ref({
  rowsPerPage: 10,
});
const institutions = ref([]);
const institutionId = ref();
const educationLevel = ref([]);
const settingsChild = ref();
const shifts = ref([]);

const columns = [
  { name: "name", align: "left", label: "Nome", field: "name", sortable: true },
  {
    name: "status",
    align: "left",
    label: "Estado",
    field: "status",
    sortable: true,
  },
  {
    name: "district",
    align: "left",
    label: "Localizacao",
    field: (row) => row?.district?.name,
    sortable: true,
  },
  {
    name: "district",
    align: "left",
    label: "Filial?",
    field: (row) => (row?.parentId ? "sucursal" : "Sede"),
    sortable: true,
  },
  { name: "actions", align: "left", label: "Ações", field: "actions" },
];

const addInstitution = () => {
  router.push({ name: "institution-create" });
};

const editInstitution = (institution) => {
  router.push({ name: "institution-edit", params: { id: institution.id } });
};

const createSucursal = async (institution) => {
  router.push({
    name: "create-branch",
    params: { parent: institution.id },
    state: { name: institution.name },
  });
};

const deleteInstitution = async (institution) => {
  try {
    await institutuinStores.update(institution.id, { status: "Desactivo" });
    notifySuccess(`Instituição "${institution.name}" excluída com sucesso!`);
    fetchInstitutions();
  } catch (error) {
    notifyError("Erro ao excluir instituição.");
  }
};

const handleSettings = (institution) => {
  const allEducationLevels = educationLevel.value;
  const disc = allEducationLevels.map((d) => {
    const educationFromInstitution = institution.educationsLevels;

    const isAssociated = educationFromInstitution.some(
      (emp) => emp.id === d.id
    );
    return {
      id: d.id,
      name: d.name,
      checked: !!isAssociated,
    };
  });

  educationLevel.value = disc;
  shifts.value = institution.shifts;
  institutionId.value = institution.id;
  settingsChild.value.medium = true;
};

const fetchEducationLevel = async () => {
  try {
    await institutuinStores.findEducationLevel();
    educationLevel.value = institutuinStores.educationLevel;
  } catch (error) {
    console.error(error);
  }
};

const fetchInstitutions = async () => {
  try {
    await institutuinStores.list();
    institutions.value = institutuinStores.institutions;
  } catch (error) {
    notifyError("Erro ao carregar Instituições");
  }
};

const handleSettingsSite = (row) => {
  router.push({
    name: "settings-site",
    params: { id: row.id },
  })
}

onMounted(() => {
  fetchInstitutions();
  fetchEducationLevel();
});
</script>

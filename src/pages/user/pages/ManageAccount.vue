<template>
  <q-page class="edigital-page">

    <!-- Top Bar -->
    <div class="page-topbar row items-center q-px-xl q-py-md">
      <q-btn
        flat round dense
        icon="arrow_back_ios_new"
        class="back-btn q-mr-md"
        @click="$router.back()"
      />

      <div class="col">
        <q-breadcrumbs class="breadcrumb-nav" active-color="primary" separator="›">
          <q-breadcrumbs-el label="Dashboard" icon="home" to="/" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Utilizadores" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Gestão de Acesso" class="breadcrumb-active" />
        </q-breadcrumbs>

        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="manage_accounts" size="1.3rem" color="white" />
          </div>
          <span>Gestão de Acesso — {{ user?.displayName }}</span>
        </div>
      </div>
    </div>

    <div class="q-px-xl q-pt-lg q-pb-xl q-gutter-lg">

      <!-- Card: Credenciais -->
      <q-card class="form-card" flat>

        <div class="form-card-header row items-center q-px-lg q-py-md">
          <div class="form-header-icon q-mr-md">
            <q-icon name="lock" size="1.2rem" color="white" />
          </div>
          <div>
            <div class="form-header-title">Credenciais de Acesso</div>
            <div class="form-header-sub">Actualize a palavra-passe do utilizador</div>
          </div>
        </div>

        <q-separator />

        <q-card-section class="q-pa-lg">
          <q-form ref="formRef" @submit.prevent="handleSubmit">

            <div class="section-label q-mb-md">Informações do Utilizador</div>

            <div class="row q-col-gutter-md q-mb-lg">

              <!-- Username -->
              <div class="col-md-4 col-12">
                <div class="field-label">Utilizador</div>
                <q-input
                  v-model="user.username"
                  outlined dense
                  class="edigital-input"
                  disable
                >
                  <template #prepend>
                    <q-icon name="person" color="grey-5" size="1rem" />
                  </template>
                </q-input>
              </div>

              <!-- Password -->
              <div class="col-md-4 col-12">
                <div class="field-label">Palavra-passe <span class="required">*</span></div>
                <q-input
                  v-model="form.password"
                  :type="isPwd ? 'password' : 'text'"
                  placeholder="Nova palavra-passe"
                  outlined dense
                  class="edigital-input"
                  :rules="[(val) => !!val || 'Campo obrigatório.']"
                >
                  <template #prepend>
                    <q-icon name="lock" color="grey-5" size="1rem" />
                  </template>
                  <template #append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      color="grey-5"
                      size="1rem"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>

              <!-- Confirm Password -->
              <div class="col-md-4 col-12">
                <div class="field-label">Confirmação da Palavra-passe <span class="required">*</span></div>
                <q-input
                  v-model="form.passwordConfirm"
                  :type="isPwd ? 'password' : 'text'"
                  placeholder="Confirme a palavra-passe"
                  outlined dense
                  class="edigital-input"
                  :rules="[validaSenha]"
                >
                  <template #prepend>
                    <q-icon name="lock_reset" color="grey-5" size="1rem" />
                  </template>
                  <template #append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      color="grey-5"
                      size="1rem"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>

            </div>

            <q-separator class="q-mb-lg" />

            <div class="row justify-end q-gutter-sm">
              <q-btn
                label="Cancelar"
                icon="close"
                class="cancel-btn"
                no-caps flat
                @click="$router.back()"
              />
              <q-btn
                label="Guardar"
                icon="save"
                class="save-btn"
                no-caps
                type="submit"
                :loading="loading"
              />
            </div>

          </q-form>
        </q-card-section>
      </q-card>

      <!-- Card: Permissões -->
      <q-card class="form-card" flat>

        <div class="form-card-header row items-center q-px-lg q-py-md">
          <div class="form-header-icon q-mr-md">
            <q-icon name="admin_panel_settings" size="1.2rem" color="white" />
          </div>
          <div class="col">
            <div class="form-header-title">Permissões</div>
            <div class="form-header-sub">{{ selected.length }} permissão(ões) atribuída(s)</div>
          </div>
          <!-- Pill de contagem -->
          <div class="permissions-count-pill">
            <q-icon name="verified_user" size="0.9rem" color="white" class="q-mr-xs" />
            {{ selected.length }}
          </div>
        </div>

        <q-separator />

        <q-card-section class="q-pa-lg">

          <div class="section-label q-mb-md">Atribuir Permissões</div>

          <q-select
            outlined
            v-model="selected"
            multiple
            :options="options"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            use-chips
            stack-label
            placeholder="Selecione as permissões..."
            dense
            class="edigital-input"
          >
            <template #prepend>
              <q-icon name="security" color="grey-5" size="1rem" />
            </template>

            <template #selected-item="scope">
              <q-chip
                dense removable
                class="permission-chip"
                @remove="toggleSelection(scope.opt)"
              >
                {{ scope.opt.label }}
              </q-chip>
            </template>

            <template #option="scope">
              <q-item
                v-if="scope.opt.isGroup"
                dense
                class="permission-group-item"
              >
                <q-item-section>
                  <q-item-label class="permission-group-label">
                    {{ scope.opt.label }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                v-else
                clickable v-ripple
                class="permission-item"
                @click="toggleSelection(scope.opt)"
              >
                <q-item-section>
                  <q-item-label class="permission-item-label">
                    {{ scope.opt.label }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon
                    v-if="isSelected(scope.opt)"
                    name="check_circle"
                    color="primary"
                    size="1rem"
                  />
                </q-item-section>
              </q-item>
            </template>
          </q-select>

        </q-card-section>
      </q-card>

    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useUserStores } from "../store";
import { useInstitutionStores } from "src/pages/institution/store";
import { useRoute, useRouter } from "vue-router";
import useNotify from "src/composables/UseNotify";

/* ── Router / Store ── */
const route = useRoute();
const router = useRouter();
const userStores = useUserStores();
const institutionStores = useInstitutionStores();
const { notifyError, notifySuccess } = useNotify();

/* ── Params ── */
const { userId } = route.params;

/* ── State ── */
const institutionPermissions = ref([]);
const selected = ref([]);
const loading = ref(false);
const isPwd = ref(true);
const formRef = ref(null);

const form = ref({
  password: "",
  passwordConfirm: "",
});

/* ── Computed ── */
const user = computed(() => userStores.user);

const options = computed(() =>
  institutionPermissions.value.flatMap((group) => [
    {
      label: group.name,
      isGroup: true,
      value: null,
    },
    ...group.items.map((item) => ({
      id: item.id,
      label: `${item.name}`,
      value: item.key,
      isGroup: false,
    })),
  ])
);

/* ── Methods ── */
const validaSenha = (val) =>
  val === form.value.password || "As palavras-passe não coincidem!";

const handleSubmit = async () => {
  const valid = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    await userStores.updatePassword(userId, { password: form.value.password });
    notifySuccess("Palavra-passe actualizada com sucesso!");
    form.value = { password: "", passwordConfirm: "" };
  } catch (error) {
    notifyError("Erro ao actualizar a palavra-passe");
  } finally {
    loading.value = false;
  }
};

const toggleSelection = async (option) => {
  if (option.isGroup || option.value === null) return;
  const index = selected.value.indexOf(option.value);
  try {
    if (index === -1) {
      await userStores.addPermissions(userId, { permissionItemId: option.id });
      selected.value.push(option.value);
    } else {
      await userStores.removePermissions(userId, option.id);
      selected.value.splice(index, 1);
    }
  } catch (error) {
    notifyError("Erro ao actualizar permissões");
  }
};

const isSelected = (option) => selected.value.includes(option.value);

const fetchData = async () => {
  try {
    await userStores.findOne(userId);
    await institutionStores.findPermissions(user.value.institutionId);
    institutionPermissions.value = institutionStores.permissions;
    selected.value = userStores.user.permissionsItems?.map((up) => up.key) ?? [];
  } catch (error) {
    notifyError("Erro ao carregar dados do utilizador");
  }
};

/* ── Lifecycle ── */
onMounted(async () => await fetchData());
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap");

.edigital-page {
  min-height: 100vh;
  background: #f0f4f8;
  font-family: "DM Sans", sans-serif;
}

/* ── Top Bar ── */
.page-topbar {
  background: #ffffff;
  border-bottom: 1px solid #e8edf3;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 12px rgba(15, 40, 98, 0.06);
}
.back-btn {
  background: #f0f4f8;
  color: #1a3fa6 !important;
  border-radius: 10px;
  width: 36px;
  height: 36px;
  transition: background 0.2s;
}
.back-btn:hover { background: #e0e8f7; }

.breadcrumb-nav { font-size: 0.78rem; }
.breadcrumb-link { color: #9ca3af !important; }
.breadcrumb-active { color: #1a3fa6 !important; font-weight: 600; }

.page-title {
  font-family: "Sora", sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f2862;
}
.title-icon-wrap {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Form Card ── */
.form-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(15, 40, 98, 0.07);
  border: 1px solid #edf0f5;
}
.form-card-header {
  background: #fafbfd;
  border-bottom: 1px solid #f0f0f0;
}
.form-header-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.form-header-title {
  font-family: "Sora", sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #0f2862;
}
.form-header-sub { font-size: 0.78rem; color: #9ca3af; margin-top: 2px; }

/* ── Form Fields ── */
.section-label {
  font-family: "Sora", sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
}
.field-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}
.required { color: #ef4444; }

.edigital-input :deep(.q-field__control) {
  border-radius: 10px;
  background: #f8fafc;
}
.edigital-input :deep(.q-field__control:hover) { border-color: #1a3fa6; }

/* ── Buttons ── */
.cancel-btn {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  color: #6b7280 !important;
  padding: 0 20px;
  height: 40px;
  font-weight: 600;
  transition: background 0.2s;
}
.cancel-btn:hover { background: #f3f4f6 !important; }

.save-btn {
  background: linear-gradient(135deg, #1a3fa6 0%, #0f2862 100%);
  color: white !important;
  border-radius: 10px;
  padding: 0 24px;
  height: 40px;
  font-family: "Sora", sans-serif;
  font-weight: 600;
  font-size: 0.88rem;
  transition: box-shadow 0.2s, transform 0.15s;
}
.save-btn:hover {
  box-shadow: 0 6px 18px rgba(26, 63, 166, 0.35);
  transform: translateY(-1px);
}

/* ── Permissions ── */
.permissions-count-pill {
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  color: white;
  border-radius: 20px;
  padding: 4px 12px;
  font-family: "Sora", sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
}

.permission-chip {
  background: #eff6ff;
  color: #1a3fa6;
  font-weight: 600;
  font-size: 0.75rem;
  border-radius: 8px;
}

.permission-group-item {
  background: #f8fafc;
  border-top: 1px solid #edf0f5;
  padding: 6px 16px;
}
.permission-group-label {
  font-family: "Sora", sans-serif;
  font-weight: 700;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #1a3fa6;
}

.permission-item { padding: 8px 16px; }
.permission-item:hover { background: #f5f8ff; }
.permission-item-label {
  font-size: 0.85rem;
  color: #374151;
  padding-left: 8px;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar { padding: 0.75rem 1rem; flex-wrap: wrap; }
  .edigital-page .q-px-xl {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
}
</style>

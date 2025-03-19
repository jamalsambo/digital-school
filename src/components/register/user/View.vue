<template>
  <q-card flat bordered class="q-pa-md shadow-2">
    <q-separator spaced />
    <q-form @submit="handleSubmit" class="q-gutter-md q-pt-sm">
      <div class="row q-col-gutter-sm">
        <!-- Select Tipo -->
        <q-input
          class="col grow"
          label="Usuario"
          v-model="form.username"
          outlined
          required
          dense
          disable=""
        />
        <q-input
          class="col grow"
          label="Palavra-passe *"
          v-model="form.password"
          outlined
          required
          dense
          :type="isPwd ? 'password' : 'text'"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-input
          class="col grow"
          label="Confirmação da Senha *"
          v-model="form.passwordConfirm"
          outlined
          required
          dense
          :type="isPwd ? 'password' : 'text'"
          :rules="[validaSenha]"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </div>
      <slot name="actions"></slot>
    </q-form>
  </q-card>
</template>

<script setup>
import { computed, ref, watchEffect } from "vue";
import { useStudentStores } from "src/pages/student/store";
import { useUserStores } from "src/pages/user/store";
import { useEmployeeStores } from "src/pages/employee/stores";
import useNotify from "src/composables/UseNotify";

const props = defineProps({
  data: { type: Object, required: true },
  entity: { type: String, required: true },
  userTypeId: { type: String, required: true },
  institutionId: { type: String, required: true },

});

const studentStore = useStudentStores();
const employeeStore = useEmployeeStores();
const userStore = useUserStores();
const { notifyError, notifySuccess, notifyInfo } = useNotify();

const student = computed(() => studentStore.student);
const employee = computed(() => employeeStore.employee);
const isPwd = ref(true);
const userId = ref(props.data?.user?.id);

const form = ref({

  displayName: "",
  username: "",
  password: "",
  passwordConfirm: "",
  userTypeId: props.userTypeId,
});

const validaSenha = (val) => {
  return val === form.value.password || "As senhas não coincidem!";
};

const handleSubmit = async () => {
  try {
    if (form.value.password === form.value.passwordConfirm) {
      if (userId.value) {
        userStore.update(userId.value, {...form.value});
        notifySuccess("Senha recuperada com sucesso!");
      } else {
        await userStore.create({...form.value,  institutionId: employee.value.institutionId});

        if (userStore.user.id) {
          /* Se o usuario for estudante */
          if (props.entity === "student") {
            studentStore.update(student.value.id, {
              userId: userStore.user.id,
            });
          } else if (props.entity === "employee"){
            /* Se o usuario for funcionario */
            employeeStore.update(employee.value.id, {
              userId: userStore.user.id,
            });
            notifySuccess("Usuario criado com sucesso!");
          }
        }
      }
    } else {
      notifyInfo("As senhas não coincidem!");
    }
  } catch (error) {
    notifyError("Erro ao criar usuario");
  }
};

watchEffect(() => {
  if (props.entity === "student") {
    form.value.displayName = props.data?.basicInformation?.fullName;
    form.value.username = props.data?.number;
  } else if (props.entity === "employee") {
    form.value.displayName = props.data?.basicInformation?.fullName;
    form.value.username = props.data?.number;
  } else if (props.entity === "guardian"){
     form.value.displayName = props.data.find((val) => val.type === 'Principal' && val.owner === 'Encarregado').owner;
     form.value.username = props.data.find((val) => val.type === 'Principal' && val.owner === 'Encarregado').number
  }
});
</script>

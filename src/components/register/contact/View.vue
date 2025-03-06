<template>
  <!-- Exibição dos Contactos -->
  <div v-if="!isEditing">
    <q-card flat bordered class="q-pa-md shadow-2">
      <div class="row items-center justify-between">
        <div class="text-h6 text-primary">Contactos</div>
        <q-btn
          color="primary"
          icon="add"
          label="Adicionar"
          class="q-mr-sm"
          @click="toggleEdit"
          flat
        />
      </div>
      <q-separator spaced />
      <div class="q-pt-sm">
        <div v-if="contacts.length" class="q-mb-md">
          <q-list bordered>
            <q-item v-for="(item, index) in contacts" :key="index">
              <q-item-section>
                <div>
                  <span class="text-weight-bold">Contato {{ item.type }}</span
                  >: {{ item.number }}
                </div>
              </q-item-section>
              <q-item-section>
                <div>
                  <span class="text-weight-bold">Proprietário</span>:
                  {{ item.owner }}
                </div>
              </q-item-section>
              <q-item-section side v-if="item.type === 'Principal' && item.owner === 'Encarregado'">
                <q-btn
                  flat
                  dense
                  round
                  icon="person"
                  color="negative"
                  @click="createUser(item)"
                />
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  dense
                  round
                  icon="delete"
                  color="negative"
                  @click="removeContact(item)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-card>
  </div>

  <!-- Formulário de Edição -->
  <div v-else>
    <q-card flat bordered class="q-pa-md shadow-2">
      <div class="text-h6 text-primary">Editar Contacto</div>
      <q-separator spaced />
      <q-form @submit="addContact" class="q-gutter-md q-pt-sm">
        <div class="row q-col-gutter-sm">
          <!-- Select Tipo -->
          <q-select
            class="col-md-3 col-sm-12 col-xs-12"
            label="Tipo *"
            v-model="form.type"
            option-label="name"
            option-value="id"
            :options="['Principal', 'Alternativo', 'Email', 'Outro']"
            outlined
            required
            dense
          />

          <!-- Select Proprietário -->
          <q-select
            class="col-md-3 col-sm-12 col-xs-12"
            label="Proprietário *"
            v-model="form.owner"
            :options="['Estudante', 'Funcionario', 'Encarregado', 'Familiar']"
            outlined
            required
            dense
          />

          <!-- Input Número de Telefone -->
          <div
            class="col-md-6 col-sm-12 col-xs-12 row items-center q-gutter-sm"
          >
            <q-input
              class="col grow"
              label="Número de Telefone *"
              v-model="form.number"
              outlined
              required
              dense
            />
          </div>
        </div>
        <slot name="actions"></slot>
      </q-form>
    </q-card>
  </div>
</template>
<script setup>
// imports
import { ref } from "vue";
import { useContactStores } from "./store";
import useNotify from "src/composables/UseNotify";

// use store
const contactStore = useContactStores();
const { notifyError, notifySuccess } = useNotify();

// Props
const props = defineProps({
  contacts: { type: Array, required: true },
});

// Data
const isEditing = ref(false);
const form = ref({ type: "", owner: "", number: "" });

// Methods
const addContact = async (owner) => {
  const entity =
    owner.owner === "employee"
      ? { employeeId: owner.id }
      : { studentId: owner.id };

  try {
    await contactStore.create(form.value);
    if (contactStore.contact.id) {
      // Associa o contato ao proprietário
      await contactStore.addToOwner(
        JSON.stringify({
          contactId: contactStore.contact.id,
          ...entity,
        })
      );
      notifySuccess("Contato adicionado com sucesso!");
      props.contacts.push(form.value)
    } else {
      notifyError("Falha ao adicionar contato! ID não gerado.");
    }
  } catch (error) {
    notifyError(`Erro ao adicionar contato: ${error.message}`);
  }
};

const removeContact = async (contactToRemove) => {
  try {
    const index = props.contacts.findIndex(
      (contact) => contact.id === contactToRemove.id
    );

    if (index !== -1) {
      // Remove contato da lista local
      props.contacts.splice(index, 1);

      // Remove contato do backend
      await contactStore.delete(contactToRemove.id);
      notifySuccess("Contato removido com sucesso!");
    } else {
      notifyError("Contato não encontrado!");
    }
  } catch (error) {
    notifyError(`Erro ao remover contato: ${error.message}`);
  }
};

const createUser = async (item) => {
 console.log(item)
}

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

defineExpose({
  addContact,
  toggleEdit,
});
</script>

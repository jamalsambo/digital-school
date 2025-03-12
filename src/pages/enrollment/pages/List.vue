<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card class="text-grey-8 no-shadow" bordered>
          <q-card-section>
            <Tables
              :rows="rows"
              title="Matriculas"
              :columns="columns"
            >
              <template #new>
                <q-btn
                  color="primary"
                  icon="add"
                  label="Nova"
                  no-caps
                  @click="newEnrollment"
                  class="q-ml-sm"
                />
              </template>

              <template #actions="{ props }">
                <q-btn
                  flat
                  round
                  icon="settings"
                  color="secondary"
                  @click="settings(props.row)"
                />
                <q-btn
                  flat
                  round
                  icon="edit"
                  color="primary"
                  @click="editCurriculumPlans(props.row)"
                />
              </template>
            </Tables>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { ref } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import Tables from 'src/components/Tables.vue';


/* setup route */
const route = useRoute()
const router = useRouter()

/* setup store */


/* setup data */
const { educationId } = route.params
const educationIdUpdated = ref(route.params.educationId || educationId);
const rows = ref([])
const columns = ref([])

/* setup methods */
const newEnrollment = () => {
  router.push({
    name: 'create-enrollment',
    params: { educationId: educationIdUpdated.value}
  })
}

onBeforeRouteUpdate((to) => {
  educationIdUpdated.value = to.params.educationId || educationId;

});


</script>

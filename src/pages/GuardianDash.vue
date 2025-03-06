<template>
  <q-page padding>
    <!-- Card de Notificações -->
    <q-card class="my-4">
      <q-card-section>
        <div class="text-h6">Notificações</div>
      </q-card-section>
      <q-card-section>
        <q-list>
          <q-item v-for="(notificacao, index) in notificacoes" :key="index">
            <q-item-section>
              <div><strong>{{ notificacao.titulo }}</strong></div>
              <div>{{ notificacao.mensagem }}</div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'DashboardEncarregado',
  data() {
    return {
      // Tarefas pendentes do aluno
      tarefasPendentes: [
        { nome: 'Trabalho de História', dataEntrega: '2025-02-20' },
        { nome: 'Trabalho de Matemática', dataEntrega: '2025-02-21' }
      ],

      // Informações de presenças
      presencas: 92, // Taxa de presença
      ausencias: [
        { nome: 'Matemática', data: '2025-02-18' },
        { nome: 'História', data: '2025-02-17' }
      ],

      // Notificações
      notificacoes: [
        { titulo: 'Reunião de Pais', mensagem: 'Reunião agendada para 20/02.' },
        { titulo: 'Prova de Física', mensagem: 'Prova de física no dia 22/02.' }
      ],

      // Dados de progresso acadêmico
      dadosProgresso: {
        labels: ['Matemática', 'Física', 'História'],
        datasets: [
          {
            label: 'Notas',
            data: [85, 90, 78],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      }
    };
  }
};
</script>

<style scoped>
.q-card {
  margin-bottom: 20px;
}
</style>

<template>
  <q-layout view="hHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img :src="'http://localhost:4000/upload/file-1740492824217-507742971.png'" />
          </q-avatar>
          EscolaTech Gestão
        </q-toolbar-title>

        <q-space />

        <q-btn flat round dense icon="menu" class="q-mr-xs" />
        <div class="q-gutter-sm gt-sm">
          <q-btn flat label="Sobre" @click="scrollTo('sobre')" />
          <q-btn flat label="Vantagens" @click="scrollTo('vantagens')" />
          <q-btn flat label="Contacto" @click="scrollTo('clientes')" />
          <q-btn flat label="Preços" @click="scrollTo('precos')" />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Hero Section -->
    <section class="q-pa-xl text-center">
      <q-parallax src="../../assets/background.jpg" :height="600">
        <h1 class="text-h2 text-white q-ma-none">
          Transforme sua instituição de ensino
        </h1>
        <q-btn
          color="secondary"
          label="Experimente Grátis"
          class="q-mt-md"
          size="lg"
        />
      </q-parallax>
    </section>

    <!-- Sobre o Sistema -->
    <section id="sobre" class="q-pa-xl">
      <q-section>
        <h2 class="text-h4 q-mb-md">Sistema Completo de Gestão Escolar</h2>
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-6">
            <q-card>
              <q-card-section>
                <p class="text-body1">
                  Nosso sistema integrado oferece soluções completas para:
                </p>
                <q-list bordered>
                  <q-item v-for="(feature, index) in features" :key="index">
                    <q-item-section avatar>
                      <q-icon color="primary" :name="feature.icon" />
                    </q-item-section>
                    <q-item-section>
                      {{ feature.text }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-6">
            <q-img src="../../assets/Dashboard.png" />
          </div>
        </div>
      </q-section>
    </section>

    <!-- Vantagens -->
    <section id="vantagens" class="q-pa-xl bg-grey-3">
      <div class="text-center q-mb-xl">
        <h2 class="text-h4">Vantagens</h2>
      </div>
      <div class="row q-col-gutter-lg">
        <div
          v-for="(benefit, index) in benefits"
          :key="index"
          class="col-12 col-md-4"
        >
          <q-card class="full-height">
            <q-card-section class="text-center">
              <q-icon :name="benefit.icon" color="primary" size="xl" />
              <h3 class="text-h6 q-mt-sm">{{ benefit.title }}</h3>
              <p class="text-caption">{{ benefit.description }}</p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>

    <!-- Clientes -->
    <section id="clientes" class="q-pa-xl">
      <div class="text-center q-mb-xl">
        <h2 class="text-h4">Instituições que confiam</h2>
      </div>
      <!-- Contato -->
    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h5">Entre em Contato</div>
        <q-input v-model="contact.name" label="Nome" class="q-mt-md" outlined />
        <q-input v-model="contact.email" label="E-mail" class="q-mt-md" outlined />
        <q-input v-model="contact.message" label="Mensagem" type="textarea" class="q-mt-md" outlined />
        <q-btn label="Enviar" color="primary" class="q-mt-md" @click="sendContact" />
      </q-card-section>
    </q-card>
    </section>

    <!-- Preços -->
    <section id="precos" class="q-pa-xl bg-grey-3">
    <div class="text-center q-mb-xl">
      <h2 class="text-h3 text-primary">Planos Acessíveis para Moçambique</h2>
      <q-toggle
        v-model="annualPayment"
        label="Pagamento Anual (15% desconto)"
        color="primary"
      />
    </div>

    <div class="row q-col-gutter-lg justify-center">
      <!-- Plano Básico -->
      <div class="col-12 col-md-3">
        <q-card class="q-pa-md text-center">
          <q-card-section>
            <div class="text-h5 text-weight-bold">Escola Digital</div>
            <div class="text-h4 q-my-lg text-primary">
              {{ annualPayment ? '25.500 MTN' : '2.500 MTN' }}<span class="text-caption">/mês</span>
            </div>
            <q-list dense class="text-left">
              <q-item v-for="(feat, index) in basicFeatures" :key="index">
                <q-item-section avatar>
                  <q-icon name="check" color="positive" />
                </q-item-section>
                <q-item-label>{{ feat }}</q-item-label>
              </q-item>
            </q-list>
          </q-card-section>
          <q-btn
            color="primary"
            label="Começar Agora"
            class="q-mb-md"
            unelevated
          />
        </q-card>
      </div>

      <!-- Plano Intermediário -->
      <div class="col-12 col-md-3">
        <q-card class="q-pa-md text-center border-primary">
          <q-badge color="orange" floating>Mais Popular</q-badge>
          <q-card-section>
            <div class="text-h5 text-weight-bold">Gestão Completa</div>
            <div class="text-h4 q-my-lg text-primary">
              {{ annualPayment ? '66.300 MTN' : '6.500 MTN' }}<span class="text-caption">/mês</span>
            </div>
            <q-list dense class="text-left">
              <q-item v-for="(feat, index) in intermediateFeatures" :key="index">
                <q-item-section avatar>
                  <q-icon name="check" color="positive" />
                </q-item-section>
                <q-item-label>{{ feat }}</q-item-label>
              </q-item>
            </q-list>
          </q-card-section>
          <q-btn
            color="primary"
            label="Experimente Grátis"
            class="q-mb-md"
            unelevated
          />
        </q-card>
      </div>

      <!-- ... (Adicionar outros planos seguindo mesmo padrão) ... -->
    </div>

    <div class="q-mt-xl text-center text-caption">
      <p>✅ Todos planos incluem website grátis + treinamento inicial</p>
      <p>✅ Preços em MTN (Metical moçambicano) - Isentos de IVA</p>
      <p>✅ Pagamentos via M-Pesa, E-Mola ou Transferência Bancária</p>
    </div>
  </section>


    <!-- Footer -->
    <footer class="q-pa-xl bg-dark text-white">
          <div class="container">
            <div class="row q-col-gutter-xl">
              <div class="col-12 col-md-4">
                <h5 class="text-weight-bold">Contato</h5>
                <q-list dense>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="mail" />
                    </q-item-section>
                    <q-item-section>contato@escolatech.com</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="phone" />
                    </q-item-section>
                    <q-item-section>(11) 99999-9999</q-item-section>
                  </q-item>
                </q-list>
              </div>

              <div class="col-12 col-md-4">
                <h5 class="text-weight-bold">Redes Sociais</h5>
                <div class="q-gutter-md">
                  <q-btn
                    round
                    color="white"
                    text-color="dark"
                    icon="facebook"
                    href="#"
                  />
                  <q-btn
                    round
                    color="white"
                    text-color="dark"
                    icon="instagram"
                    href="#"
                  />
                  <q-btn
                    round
                    color="white"
                    text-color="dark"
                    icon="linkedin"
                    href="#"
                  />
                </div>
              </div>
            </div>

            <div class="text-center q-mt-xl text-caption">
              © 2024 EscolaTech - Todos os direitos reservados
            </div>
          </div>
        </footer>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";

const annualPayment = ref(false);

const features = ref([
  { icon: "school", text: "Gestão de Alunos" },
  { icon: "date_range", text: "Controle Acadêmico" },
  { icon: "payments", text: "Financeiro Integrado" },
  { icon: "assessment", text: "Relatórios Personalizados" },
]);

const benefits = ref([
  {
    icon: "cloud",
    title: "Acesso Remoto",
    description: "Acesse de qualquer dispositivo com internet 24/7",
  },
  {
    icon: "security",
    title: "Segurança de Dados",
    description: "Criptografia avançada e backups diários",
  },
  {
    icon: "update",
    title: "Atualizações Constantes",
    description: "Melhorias contínuas sem custo adicional",
  },
  {
    icon: "support_agent",
    title: "Suporte Especializado",
    description: "Equipe técnica disponível 12h/dia",
  },
]);

const partners = ref([
  { logo: "../../assets/products/giorgio-trovato-K62u25Jk6vo-unsplash.jpg" },
  { logo: "../../assets/products/giorgio-trovato-K62u25Jk6vo-unsplash.jpg" },
  { logo: "../../assets/products/giorgio-trovato-K62u25Jk6vo-unsplash.jpg" },
  { logo: "../../assets/products/giorgio-trovato-K62u25Jk6vo-unsplash.jpg" },
]);

const institutions = ref([
  [
    { logo: "../../assets/products/giorgio-trovato-K62u25Jk6vo-unsplash.jpg" },
    "../../assets/products/giorgio-trovato-K62u25Jk6vo-unsplash.jpg",
    "../../assets/products/john-fornander-m2WpKnlLcEc-unsplash.jpg",
  ],
]);

const basicFeatures = ref([
  "Até 100 estudantes",
  "5 turmas & 3 disciplinas",
  "Controle de pagamentos",
  "Website básico (5 páginas)",
  "Suporte por email",
]);

const intermediateFeatures = ref([
  "Até 500 estudantes",
  "Turmas & disciplinas ilimitadas",
  "Integração com WhatsApp",
  "Relatórios financeiros",
  "Suporte prioritário",
]);
const contact = ref({ name: '', email: '', message: '' });
const steps = ref([
  {
    title: "Cadastro",
    content: "Registre sua instituição em nosso sistema",
  },
]);

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
  });
};
</script>


<style scoped>
.q-stepper__step-inner {
  padding: 24px;
}
</style>

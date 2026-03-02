<template>
  <q-layout>
    <q-page-container>
      <q-page class="login-page flex">

        <!-- Left Panel - Branding -->
        <div class="brand-panel flex flex-center column">
          <div class="brand-content">
            <div class="brand-logo">
              <div class="logo-ring">
                <q-icon name="bolt" size="2.5rem" color="white" />
              </div>
            </div>
            <h1 class="brand-title">E-Digital</h1>
            <p class="brand-subtitle">Plataforma Institucional de Gestão Digital</p>
            <div class="brand-divider"></div>
            <div class="brand-features">
              <div class="feature-item" v-for="f in features" :key="f.icon">
                <q-icon :name="f.icon" size="1.1rem" color="rgba(255,255,255,0.7)" />
                <span>{{ f.label }}</span>
              </div>
            </div>
          </div>
          <div class="brand-circles">
            <div class="circle c1"></div>
            <div class="circle c2"></div>
            <div class="circle c3"></div>
          </div>
        </div>

        <!-- Right Panel - Login Form -->
        <div class="form-panel flex flex-center">
          <q-card class="login-card" flat>
            <q-card-section class="q-pb-none">
              <div class="form-header">
                <p class="form-welcome">Bem-vindo de volta</p>
                <h2 class="form-title">Iniciar Sessão</h2>
                <p class="form-desc">Aceda à sua conta institucional para continuar</p>
              </div>
            </q-card-section>

            <q-card-section class="q-pt-lg">
              <q-form class="login-form" @submit.prevent="handleLogin">

                <div class="field-group">
                  <label class="field-label">Utilizador</label>
                  <q-input
                    v-model="form.username"
                    outlined
                    dense
                    placeholder="Digite o seu utilizador"
                    lazy-rules
                    :rules="[val => val && val.length > 0 || 'Campo obrigatório']"
                    class="custom-input"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person_outline" color="primary" />
                    </template>
                  </q-input>
                </div>

                <div class="field-group q-mt-md">
                  <label class="field-label">Palavra-passe</label>
                  <q-input
                    v-model="form.password"
                    outlined
                    dense
                    :type="showPass ? 'text' : 'password'"
                    placeholder="Digite a sua palavra-passe"
                    lazy-rules
                    :rules="[val => val && val.length > 0 || 'Campo obrigatório']"
                    class="custom-input"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock_outline" color="primary" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="showPass ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        color="grey-6"
                        @click="showPass = !showPass"
                      />
                    </template>
                  </q-input>
                </div>

                <div class="row justify-between items-center q-mt-sm">
                  <q-checkbox v-model="rememberMe" label="Lembrar-me" color="primary" dense />
                  <a class="forgot-link" href="#">Esqueceu a palavra-passe?</a>
                </div>

                <q-btn
                  label="Entrar"
                  type="submit"
                  unelevated
                  class="login-btn q-mt-lg full-width"
                  :loading="loading"
                  no-caps
                >
                  <template v-slot:loading>
                    <q-spinner-dots color="white" />
                  </template>
                </q-btn>

              </q-form>
            </q-card-section>

            <q-card-section class="text-center q-pt-sm">
              <p class="footer-text">
                Problemas de acesso? Contacte o
                <a class="support-link" href="#">suporte técnico</a>
              </p>
            </q-card-section>

            <div class="card-badge">
              <q-icon name="verified_user" size="0.85rem" />
              <span>Acesso Seguro SSL</span>
            </div>
          </q-card>
        </div>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '/src/pages/auth/store'
import { useUserStores } from 'src/pages/user/store'
import useNotify from 'src/composables/UseNotify'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()
const useStores = useUserStores()
const { notifyError, notifySuccess } = useNotify()

const form = ref({ username: '', password: '' })
const showPass = ref(false)
const rememberMe = ref(false)
const loading = ref(false)

const features = [
  { icon: 'dashboard', label: 'Gestão Centralizada' },
  { icon: 'security', label: 'Acesso Seguro e Controlado' },
  { icon: 'analytics', label: 'Relatórios em Tempo Real' },
]

const handleLogin = async () => {
  loading.value = true
  try {
    await auth.Actionlogin(form.value)
    notifySuccess('Login efectuado com sucesso')
    router.push({ name: 'home' })
  } catch (error) {
    notifyError(error.response?.data?.msg || 'Erro ao iniciar sessão')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

.login-page {
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  background: #f0f4f8;
}

/* ── Brand Panel ── */
.brand-panel {
  width: 42%;
  min-height: 100vh;
  background: linear-gradient(155deg, #0f2862 0%, #1a3fa6 45%, #1565c0 100%);
  position: relative;
  overflow: hidden;
  padding: 3rem;
}

.brand-content {
  position: relative;
  z-index: 2;
  color: white;
}

.brand-logo {
  margin-bottom: 1.5rem;
}

.logo-ring {
  width: 72px;
  height: 72px;
  border: 2.5px solid rgba(255,255,255,0.4);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}

.brand-title {
  font-family: 'Sora', sans-serif;
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -1px;
  margin: 0 0 0.5rem 0;
  line-height: 1;
}

.brand-subtitle {
  font-size: 0.95rem;
  opacity: 0.75;
  font-weight: 300;
  margin: 0 0 2rem 0;
  max-width: 280px;
  line-height: 1.5;
}

.brand-divider {
  width: 48px;
  height: 3px;
  background: rgba(255,255,255,0.35);
  border-radius: 2px;
  margin-bottom: 1.5rem;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.88rem;
  color: rgba(255,255,255,0.8);
  font-weight: 400;
}

/* Decorative circles */
.brand-circles {
  position: absolute;
  inset: 0;
  z-index: 1;
}
.circle {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.08);
}
.c1 { width: 320px; height: 320px; bottom: -80px; right: -80px; }
.c2 { width: 200px; height: 200px; bottom: 60px; right: 20px; background: rgba(255,255,255,0.03); }
.c3 { width: 100px; height: 100px; top: 40px; right: 40px; }

/* ── Form Panel ── */
.form-panel {
  flex: 1;
  padding: 2rem;
  background: #f0f4f8;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 40px rgba(15, 40, 98, 0.10);
  padding: 0.5rem;
  position: relative;
  overflow: visible;
}

.form-header {
  padding-bottom: 0.5rem;
}

.form-welcome {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #1a3fa6;
  margin: 0 0 0.3rem 0;
}

.form-title {
  font-family: 'Sora', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #0f2862;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.5px;
}

.form-desc {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

/* Fields */
.field-label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.4rem;
  letter-spacing: 0.02em;
}

.custom-input :deep(.q-field__control) {
  border-radius: 10px;
  background: #f8fafc;
}

.custom-input :deep(.q-field--outlined .q-field__control:before) {
  border-color: #e5e7eb;
}

.custom-input :deep(.q-field--focused .q-field__control:before) {
  border-color: #1a3fa6;
}

/* Checkbox & Forgot */
.forgot-link {
  font-size: 0.82rem;
  color: #1a3fa6;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}
.forgot-link:hover { opacity: 0.7; }

/* Login Button */
.login-btn {
  background: linear-gradient(135deg, #1a3fa6 0%, #0f2862 100%);
  color: white;
  border-radius: 10px;
  height: 46px;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  font-family: 'Sora', sans-serif;
  transition: box-shadow 0.25s, transform 0.15s;
}
.login-btn:hover {
  box-shadow: 0 8px 20px rgba(26, 63, 166, 0.35);
  transform: translateY(-1px);
}

/* Footer */
.footer-text {
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0;
}
.support-link {
  color: #1a3fa6;
  font-weight: 500;
  text-decoration: none;
}
.support-link:hover { text-decoration: underline; }

/* SSL Badge */
.card-badge {
  position: absolute;
  bottom: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0369a1;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  letter-spacing: 0.04em;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .login-page { flex-direction: column; }
  .brand-panel {
    width: 100%;
    min-height: auto;
    padding: 2.5rem 2rem 2rem;
  }
  .brand-title { font-size: 2rem; }
  .brand-features { display: none; }
  .form-panel { padding: 2.5rem 1.5rem; }
  .login-card { max-width: 100%; }
}
</style>

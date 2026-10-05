<template>
  <div class="login-page">
    <!-- Formas geométricas de fundo (conforme screenshot) -->
    <div class="bg-shape bg-shape-top-right" aria-hidden="true"></div>
    <div class="bg-shape bg-shape-bottom-left" aria-hidden="true"></div>

    <!-- Card Principal de Login -->
    <main class="login-card">
      <!-- Painel Esquerdo: Boas-vindas e Marca ToolTrack -->
      <section class="card-left-panel">
        <h2 class="welcome-heading">Bem-vindo de volta!</h2>

        <div class="logo-container relative w-full max-w-[280px] aspect-square flex items-center justify-center">
          <!-- Logo ToolTrack (Caixa com disco e borda branca) -->
          <img
            src="@/assets/logo-borda-branca.png"
            alt="Logo ToolTrack"
            class="object-cover w-full h-full select-none"
          />

          <!-- Nome ToolTrack (Texto com borda) -->
          <img
            src="@/assets/texto-branco.png"
            alt="ToolTrack"
            class="object-cover w-full h-full absolute inset-0 select-none pointer-events-none texto"
          />
        </div>

        <!-- Espaçador para equilíbrio estético -->
        <div class="left-spacer" aria-hidden="true"></div>
      </section>

      <!-- Painel Direito: Formulário de Login -->
      <section class="card-right-panel">
        <h1 class="login-title">Login</h1>

        <!-- Mensagem de erro caso a action retorne falha futura -->
        <div v-if="error" class="error-banner" role="alert">
          <span>{{ error }}</span>
          <button type="button" class="btn-clear-error" @click="authStore.clearError">✕</button>
        </div>

        <form class="login-form" @submit.prevent="handleLogin">
          <!-- Campo Nome -->
          <InputField
            id="nome"
            v-model="credentials.name"
            placeholder="Nome"
            icon="user"
            type="text"
            required
            :disabled="isLoading"
          />

          <!-- Campo Email -->
          <InputField
            id="email"
            v-model="credentials.email"
            placeholder="Email"
            icon="email"
            type="email"
            required
            :disabled="isLoading"
          />

          <!-- Campo Senha -->
          <InputField
            id="senha"
            v-model="credentials.password"
            placeholder="Senha"
            icon="lock"
            type="password"
            required
            :disabled="isLoading"
          />

          <!-- Botão Entrar -->
          <div class="btn-wrapper">
            <button
              type="submit"
              class="btn-entrar"
              :class="{ 'is-loading': isLoading }"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">Entrar</span>
              <span v-else class="loader-spinner" aria-label="Carregando..."></span>
            </button>
          </div>
        </form>
      </section>
    </main>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/authStore'
import InputField from '../components/InputField.vue'

const authStore = useAuthStore()
const { credentials, isLoading, error } = storeToRefs(authStore)

/**
 * Dispara a ação de login na store do Pinia.
 * A função na store está pronta e vazia, aguardando o back-end real.
 */
async function handleLogin() {
  try {
    await authStore.login(credentials.value)
  } catch (err) {
    console.error('Falha no login:', err)
  }
}
</script>

<style scoped>
/* Container Geral da Página */
.login-page {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
}

/* Formas Abstratas de Fundo (Conforme o layout fornecido) */
.bg-shape {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
}

.bg-shape-top-right {
  width: 420px;
  height: 420px;
  background-color: #4b4c67;
  top: -120px;
  right: -90px;
}

.bg-shape-bottom-left {
  width: 480px;
  height: 480px;
  background-color: #84849c;
  bottom: -180px;
  left: -120px;
}

/* Card Principal */
.login-card {
  position: relative;
  z-index: 2;
  display: flex;
  width: 860px;
  max-width: 95vw;
  min-height: 510px;
  background-color: #ffffff;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

/* Painel Esquerdo (Azul Marinho) */
.card-left-panel {
  flex: 0 0 42%;
  background-color: #121634;
  padding: 42px 36px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.welcome-heading {
  margin: 0;
  width: 100%;
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.2px;
  text-align: left;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px 0;
}

.texto{
  margin-top: 40px;
}

.left-spacer {
  height: 24px;
  width: 100%;
}

/* Painel Direito (Branco) */
.card-right-panel {
  flex: 1;
  background-color: #ffffff;
  padding: 48px 44px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-title {
  margin: 0 0 32px 0;
  color: #121634;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.5px;
  text-align: center;
}

/* Formulário */
.login-form {
  width: 100%;
  max-width: 310px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Botão Entrar com anel externo (conforme screenshot) */
.btn-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.btn-entrar {
  position: relative;
  background-color: #121634;
  color: #ffffff;
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  font-size: 15px;
  font-weight: 600;
  padding: 9px 38px;
  border-radius: 9999px;
  border: 2px solid #121634;
  outline: 1.5px solid #121634;
  outline-offset: 2.5px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 130px;
}

.btn-entrar:hover:not(:disabled) {
  background-color: #1e2452;
  transform: translateY(-1px);
}

.btn-entrar:active:not(:disabled) {
  transform: translateY(0);
}

.btn-entrar:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Spinner animado no botão */
.loader-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Banner de Erro */
.error-banner {
  width: 100%;
  max-width: 310px;
  background-color: #fff2f2;
  border: 1px solid #ffcdd2;
  color: #c62828;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.btn-clear-error {
  background: none;
  border: none;
  color: #c62828;
  font-size: 14px;
  cursor: pointer;
  padding: 0 4px;
}

/* Responsividade para telas menores */
@media (max-width: 768px) {
  .login-card {
    flex-direction: column;
    width: 100%;
    max-width: 420px;
    min-height: auto;
  }

  .card-left-panel {
    flex: none;
    padding: 32px 24px;
  }

  .welcome-heading {
    text-align: center;
    margin-bottom: 12px;
  }

  .card-right-panel {
    padding: 36px 24px;
  }
}
</style>

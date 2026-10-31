<template>
  <div style="max-width: 400px; padding: 20px; font-family: sans-serif; margin: 40px auto; border: 1px solid #333; border-radius: 8px; background: #000; color: #fff;">
    <h2>Wishlist App</h2>

    <!-- Tabknoppen -->
    <div style="display: flex; margin-bottom: 20px; border-bottom: 2px solid #222;">
      <button
          @click="activeTab = 'login'"
          :style="{
          flex: 1,
          padding: '10px',
          background: 'none',
          border: 'none',
          color: '#fff',
          borderBottom: activeTab === 'login' ? '2px solid #00dc82' : 'none',
          fontWeight: activeTab === 'login' ? 'bold' : 'normal',
          cursor: 'pointer'
        }"
      >
        Inloggen
      </button>
      <button
          @click="activeTab = 'register'"
          :style="{
          flex: 1,
          padding: '10px',
          background: 'none',
          border: 'none',
          color: '#fff',
          borderBottom: activeTab === 'register' ? '2px solid #00dc82' : 'none',
          fontWeight: activeTab === 'register' ? 'bold' : 'normal',
          cursor: 'pointer'
        }"
      >
        Registreren
      </button>
    </div>

    <!-- ================= INLOGGEN FORMULIER ================= -->
    <div v-if="activeTab === 'login'">
      <h3>Inloggen</h3>
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">E-mailadres</label>
        <input
            v-model="loginEmail"
            type="email"
            placeholder="jouw@email.nl"
            style="width: 100%; padding: 10px; box-sizing: border-box; border-radius: 6px; border: 1px solid #444; background: #111; color: #fff;"
        />
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Wachtwoord</label>
        <input
            v-model="loginPassword"
            type="password"
            placeholder="••••••••"
            style="width: 100%; padding: 10px; box-sizing: border-box; border-radius: 6px; border: 1px solid #444; background: #111; color: #fff;"
        />
      </div>

      <button
          @click="handleLogin"
          style="width: 100%; padding: 12px; background: #00dc82; color: #000; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;"
      >
        Inloggen
      </button>
    </div>

    <!-- ================= REGISTREREN FORMULIER ================= -->
    <div v-if="activeTab === 'register'">
      <h3>Account aanmaken</h3>
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">E-mailadres</label>
        <input
            v-model="registerEmail"
            type="email"
            placeholder="jouw@email.nl"
            style="width: 100%; padding: 10px; box-sizing: border-box; border-radius: 6px; border: 1px solid #444; background: #111; color: #fff;"
        />
      </div>

      <div style="margin-bottom: 10px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Wachtwoord</label>
        <input
            v-model="registerPassword"
            type="password"
            placeholder="••••••••"
            @focus="isPasswordFocused = true"
            @blur="isPasswordFocused = false"
            style="width: 100%; padding: 10px; box-sizing: border-box; border-radius: 6px; border: 1px solid #444; background: #111; color: #fff;"
        />
      </div>

      <!-- Gereserveerde ruimte met Vloeiende Transition -->
      <div style="height: 160px; margin-bottom: 15px;">
        <div
            :class="['requirements-box', { visible: isPasswordFocused }]"
        >
          <p style="margin: 0 0 8px 0; font-weight: bold; color: #aaa;">Wachtwoord vereisten:</p>
          <ul style="list-style: none; padding: 0; margin: 0; line-height: 1.5;">
            <li :style="{ color: hasMinLength ? '#00dc82' : '#888' }">
              <span :style="{ color: hasMinLength ? '#00dc82' : '#ff4d4f' }">●</span> Minimaal 8 karakters
            </li>
            <li :style="{ color: hasLowerCase ? '#00dc82' : '#888' }">
              <span :style="{ color: hasLowerCase ? '#00dc82' : '#ff4d4f' }">●</span> Lowercase letter (a-z)
            </li>
            <li :style="{ color: hasUpperCase ? '#00dc82' : '#888' }">
              <span :style="{ color: hasUpperCase ? '#00dc82' : '#ff4d4f' }">●</span> Uppercase letter (A-Z)
            </li>
            <li :style="{ color: hasDigit ? '#00dc82' : '#888' }">
              <span :style="{ color: hasDigit ? '#00dc82' : '#ff4d4f' }">●</span> Digits (0-9)
            </li>
            <li :style="{ color: hasSymbol ? '#00dc82' : '#888' }">
              <span :style="{ color: hasSymbol ? '#00dc82' : '#ff4d4f' }">●</span> Symbols (speciale tekens)
            </li>
          </ul>
        </div>
      </div>

      <button
          @click="handleSignUp"
          :disabled="!isPasswordValid"
          :style="{ opacity: isPasswordValid ? 1 : 0.4, cursor: isPasswordValid ? 'pointer' : 'not-allowed' }"
          style="width: 100%; padding: 12px; background: #00dc82; color: #000; border: none; border-radius: 6px; font-weight: bold; transition: opacity 0.2s;"
      >
        Registreren
      </button>
    </div>

    <!-- Meldingen -->
    <p v-if="statusMessage" style="color: #00dc82; font-weight: bold; margin-top: 15px;">{{ statusMessage }}</p>
    <p v-if="errorMessage" style="color: #ff4d4f; font-weight: bold; margin-top: 15px;">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const supabase = useSupabase()

const activeTab = ref('login')

const loginEmail = ref('')
const loginPassword = ref('')

const registerEmail = ref('')
const registerPassword = ref('')
const isPasswordFocused = ref(false)

const statusMessage = ref('')
const errorMessage = ref('')

// Wachtwoord checks
const hasMinLength = computed(() => registerPassword.value.length >= 8)
const hasLowerCase = computed(() => /[a-z]/.test(registerPassword.value))
const hasUpperCase = computed(() => /[A-Z]/.test(registerPassword.value))
const hasDigit = computed(() => /[0-9]/.test(registerPassword.value))
const hasSymbol = computed(() => /[\W_]/.test(registerPassword.value))

const isPasswordValid = computed(() => {
  return hasMinLength.value &&
      hasLowerCase.value &&
      hasUpperCase.value &&
      hasDigit.value &&
      hasSymbol.value
})

const handleLogin = async () => {
  errorMessage.value = ''
  statusMessage.value = ''

  const { data, error } = await supabase.auth.signInWithPassword({
    email: loginEmail.value,
    password: loginPassword.value,
  })

  if (error) {
    errorMessage.value = error.message
  } else {
    statusMessage.value = 'Succesvol ingelogd!'
  }
}

const handleSignUp = async () => {
  errorMessage.value = ''
  statusMessage.value = ''

  const { data, error } = await supabase.auth.signUp({
    email: registerEmail.value,
    password: registerPassword.value,
  })

  if (error) {
    errorMessage.value = error.message
  } else {
    statusMessage.value = 'Registratie gelukt!'
  }
}
</script>

<style scoped>
/* CSS Transitions voor het soepel in-/uitfaden van de vereisten */
.requirements-box {
  background: #181818;
  border: 1px solid #333;
  padding: 12px;
  border-radius: 6px;
  font-size: 13px;
  height: 100%;
  box-sizing: border-box;

  /* Animatie instellingen */
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 0.25s ease, transform 0.25s ease;
  pointer-events: none;
}

.requirements-box.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
</style>
<template>
  <div class="input-pill-wrapper" :class="{ 'is-focused': isFocused, 'has-error': hasError }">
    <!-- Icon Container -->
    <div class="icon-slot">
      <!-- User / Profile Icon -->
      <svg
        v-if="icon === 'user'"
        class="input-icon"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8V21.6h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>

      <!-- Email / Mail Icon -->
      <svg
        v-else-if="icon === 'email'"
        class="input-icon"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>

      <!-- Password / Lock Icon -->
      <svg
        v-else-if="icon === 'lock'"
        class="input-icon"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
      </svg>
    </div>

    <!-- HTML Input -->
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      autocomplete="off"
      class="pill-input"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  id: {
    type: String,
    default: ''
  },
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  icon: {
    type: String,
    default: 'user' // 'user' | 'email' | 'lock'
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  hasError: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

const isFocused = ref(false)
</script>

<style scoped>
.input-pill-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  background-color: #ebe7e8;
  border-radius: 9999px;
  padding: 0 18px;
  box-sizing: border-box;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1.5px solid transparent;
}

.input-pill-wrapper:hover {
  background-color: #e5e0e3;
}

.input-pill-wrapper.is-focused {
  background-color: #f3eff1;
  border-color: #13193a;
  box-shadow: 0 0 0 3px rgba(19, 25, 58, 0.12);
}

.input-pill-wrapper.has-error {
  border-color: #e53e3e;
  background-color: #fff5f5;
}

.icon-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: #717079;
  flex-shrink: 0;
}

.input-icon {
  width: 20px;
  height: 20px;
  transition: color 0.2s ease;
}

.input-pill-wrapper.is-focused .icon-slot {
  color: #13193a;
}

.pill-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: #2b2b36;
  width: 100%;
}

.pill-input::placeholder {
  color: #75747e;
  font-weight: 500;
  opacity: 1;
}

.pill-input:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>

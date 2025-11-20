<template>
  <Transition name="fade">
    <div v-if="show" class="modal-backdrop-custom">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark text-white shadow-lg">

          <!-- Header -->
          <div class="modal-header border-secondary">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close btn-close-white" @click="$emit('cancel')"></button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <p>{{ body }}</p>
          </div>

          <!-- Footer -->
          <div class="modal-footer border-secondary">
            <button class="btn btn-secondary" @click="$emit('cancel')">Cancel</button>

            <button class="btn btn-danger" @click="$emit('confirm')">
              {{ confirmText }}
            </button>
          </div>

        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: { type: Boolean, required: true },
  title: { type: String, default: "Confirm Action" },
  body: { type: String, default: "Are you sure you want to proceed?" },
  confirmText: { type: String, default: "Confirm" }
});

defineEmits(["confirm", "cancel"]);
</script>

<style scoped>
/* Background fade */
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1200;
}

/* Adjust modal width and padding */
.modal-dialog {
  max-width: 420px;
  width: 90%;
}

.modal-content {
  border-radius: 12px;
  padding: 5px 0;
  /* keeps internal bootstrap spacing consistent */
}

.modal-header,
.modal-body,
.modal-footer {
  padding: 1rem 1.25rem;
  /* restore proper padding */
}

/* Footer button spacing */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  /* ← THIS is what separates the buttons */
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

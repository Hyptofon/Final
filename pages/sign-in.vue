<template>
  <GoogleSignInButton
      @success="handleLoginSuccess"
      @error="handleLoginError"
  ></GoogleSignInButton>
</template>

<script setup lang="ts">
import {
  GoogleSignInButton,
  type CredentialResponse,
  decodeCredential
} from "vue3-google-signin";
import {useUserStore} from "~/stores/useUserStore";

definePageMeta({
  layout: 'auth'
})

const userStore = useUserStore();
const { user, accessToken } = storeToRefs(userStore);

// handle success event
const handleLoginSuccess = async (response: CredentialResponse) => {
  const { credential } = response;
  user.value = decodeCredential(credential);
  accessToken.value = credential;
  await navigateTo('/documents');
};

// handle an error event
const handleLoginError = () => {
  console.error("Login failed");
};
</script>


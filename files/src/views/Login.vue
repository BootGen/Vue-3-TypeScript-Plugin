<template>
  <div class="container-fluid">
    <form>
      <div class="mb-3">
        <label for="email" class="form-label">Email address</label>
        <input
          v-model="email"
          type="email"
          class="form-control"
          id="email"
          placeholder="name@example.com"
        />
        <span>{{ emailError }}</span>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          id="password"
        />
        <span>{{ passwordError }}</span>
      </div>
      <div class="alert alert-danger" role="alert" v-if="errorMsg">
        {{ errorMsg }}
      </div>
      <input
        class="btn btn-primary"
        type="button"
        value="Sign in"
        @click="onSubmit"
      />
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { State } from '../store';

export default defineComponent({
  setup() {
    const simpleSchema = {
      email(value: string | undefined): boolean | string {
        if (value && value.trim()) {
          return true;
        }

        return 'This is required';
      },
      password(value: string | undefined): boolean | string {
        if (value && value.trim()) {
          return true;
        }

        return 'This is required';
      },
    };

    const { handleSubmit } = useForm({
      validationSchema: simpleSchema,
    });
    const { value: email, errorMessage: emailError } = useField('email');
    const { value: password, errorMessage: passwordError } =
      useField('password');
    let store = useStore<State>();
    let errorMsg = ref('');
    const router = useRouter();

    const onSubmit = handleSubmit(async () => {
      try {
        await store.dispatch('login', {
          email: email.value,
          password: password.value,
        });
        router.push('profile');
      } catch (reason) {
        errorMsg.value = 'incorrect email or password';
      }
    });

    return {
      onSubmit,
      email,
      emailError,
      password,
      passwordError,
      errorMsg,
    };
  },
});
</script>
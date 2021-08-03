<template>
  <div class="container-fluid">
    <form>
      <div class="mb-3">
        <label for="password" class="form-label">Old Password</label>
        <input
          v-model="oldPassword"
          type="password"
          class="form-control"
          id="password"
        />
        <span>{{ oldPasswordError }}</span>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">New Password</label>
        <input
          v-model="newPassword"
          type="password"
          class="form-control"
          id="password"
        />
        <span>{{ newPasswordError }}</span>
      </div>
      <div class="mb-3">
        <label for="password2" class="form-label">Confirm New Password</label>
        <input
          v-model="password2"
          type="password"
          class="form-control"
          id="password2"
          rules="confirmed:@password"
        />
        <span>{{ passwordError2 }}</span>
      </div>
      <div class="alert alert-danger" role="alert" v-if="errorMsg">
        {{ errorMsg }}
      </div>
      <input
        class="btn btn-primary"
        type="button"
        value="Change Password"
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
import api from '../api';

export default defineComponent({
  setup() {
    const simpleSchema = {
      oldPassword(value: string | undefined): boolean | string {
        if (value && value.trim()) {
          return true;
        }

        return 'This is required';
      },
      newPassword(value: string | undefined): boolean | string {
        if (value && value.trim()) {
          return true;
        }

        return 'This is required';
      },
      password2(value: string | undefined): boolean | string {
        if (value === newPassword.value) {
          return true;
        }

        return 'The given passwords do not match!';
      },
    };

    const { handleSubmit } = useForm({
      validationSchema: simpleSchema,
    });
    const { value: oldPassword, errorMessage: oldPasswordError } = useField<string>('oldPassword');
    const { value: newPassword, errorMessage: newPasswordError } =
      useField<string>('newPassword');
    const { value: password2, errorMessage: passwordError2 } =
      useField<string>('password2');
    let store = useStore<State>();
    let errorMsg = ref('');
    const router = useRouter();

    const onSubmit = handleSubmit(async () => {
      try {
        await api.changePassword({
          oldPassword: oldPassword.value,
          newPassword: newPassword.value
        }, store.state.auth.jwt);
        router.push('profile');
      } catch (reason) {
        errorMsg.value = 'incorrect password';
      }
    });

    return {
      onSubmit,
      oldPassword,
      oldPasswordError,
      newPassword,
      newPasswordError,
      password2,
      passwordError2,
      errorMsg,
    };
  },
});
</script>

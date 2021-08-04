<template>
  <div class="container-fluid">
    <form>
      <div class="mb-3">
        <label for="userName" class="form-label">Name</label>
        <input
          v-model="userName"
          type="text"
          class="form-control"
          id="userName"
        />
        <span>{{ userNameError }}</span>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          v-model="email"
          type="email"
          class="form-control"
          id="email"
        />
        <span>{{ emailError }}</span>
      </div>
      <div class="alert alert-danger" role="alert" v-if="errorMsg">
        {{ errorMsg }}
      </div>
      <input
        class="btn btn-primary"
        type="button"
        value="Save"
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
      userName(value: string | undefined): boolean | string {
        if (value && value.trim()) {
          return true;
        }
        return 'This is required';
      },
      email(value: string | undefined): boolean | string {
        if (value && value.trim()) {
          return (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value));
        }
        return 'This is required';
      },
    };
    const { handleSubmit } = useForm({
      validationSchema: simpleSchema,
    });
    const { value: userName, errorMessage: userNameError } = useField<string>('userName');
    const { value: email, errorMessage: emailError } = useField<string>('email');
    let store = useStore<State>();
    if(store.state.auth.user !== null){
      userName.value = store.state.auth.user.userName;
      email.value = store.state.auth.user.email;
    }
    let errorMsg = ref('');
    const router = useRouter();
    const onSubmit = handleSubmit(async () => {
      try {
        if(store.state.auth.user !== null){
          await api.updateProfile({
            id: store.state.auth.user.id,
            userName: userName.value,
            email: email.value
          }, store.state.auth.jwt);
          store.dispatch('profile');
          router.push('profile');
        }
      } catch (reason) {
        if (reason.isUserNameInUse) {
          errorMsg.value = 'This user name already exists!';
        } else if (reason.isEmailInUse) {
          errorMsg.value = 'This email already exists!';
        } else {
          errorMsg.value = '';
        }
      }
    });
    return {
      onSubmit,
      userName,
      userNameError,
      email,
      emailError,
      errorMsg
    };
  },
});
</script>
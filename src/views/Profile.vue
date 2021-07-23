<template>
  <v-container fluid>
    <v-row>
      <v-col cols="8" v-if="$store.state.auth.user">
        <h2>{{ $store.state.auth.user.userName }}</h2>
        <h3>{{ $store.state.auth.user.email }}</h3>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data: function () {
    return {};
  },
  methods: {},
});
</script>
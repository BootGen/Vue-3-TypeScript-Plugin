<template>
<span>
  <v-text-field type="date" v-model="date" dense></v-text-field>
  <v-text-field type="time" v-model="time" dense></v-text-field>
</span>
</template>

<script>
export default {
  name: 'DateTimePicker',
  props: {
    value: {
      type: Date
    }
  },
  data: function () {
    return {
      date: '',
      time: ''
    }
  },
  watch: {
    date: function (){
      this.onChanged();
    },
    time: function (){
      this.onChanged();
    }
  },
  created: function () {
    const isoString = this.value.toISOString();
    this.date = isoString.substr(0, 10);
    this.time = isoString.substr(11, 5);
  },
  methods: {
    onChanged: function () {
      this.$emit('input', new Date(`${this.date}T${this.time}`));
    }
  }
}
</script>

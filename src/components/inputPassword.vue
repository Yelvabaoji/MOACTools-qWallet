<template>
  <q-input class='q-mt-md q-mb-none' filled v-model="password"
    :label="msg"
    counter lazy-rules
    :type="isPwd ? 'password' : 'text'"
    @input="hasInput()"
    :rules="[ val => val.length >= 4 || '长度不对']"
  >
    <template v-slot:append>
      <q-icon
        :name="isPwd ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="isPwd = !isPwd"
      />
    </template>
  </q-input>
</template>

<style>
</style>

<script>

export default {
  data () {
    return {
      password: '',
      isPwd: true
    }
  },
  props: ['msg'],
  methods: {
    hasInput () {
      this.$emit('getPassword', this.password)
    }
  }
}
</script>

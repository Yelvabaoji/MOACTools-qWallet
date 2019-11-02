<template>
  <q-input class='q-mt-md q-mb-none' v-model="privateKey"
    label="请妥善备份私钥"
    readonly borderless filled
    :type="isPwd ? 'password' : 'text'"
  >
    <template v-slot:append>
      <q-icon :name="isPwd ? 'visibility_off' : 'visibility'"
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
      isPwd: true
    }
  },
  props: ['privateKey'],
  methods: {
  }
}
</script>

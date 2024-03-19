<template>
  <router-view></router-view>
  <notifications />
</template>

<script setup lang="ts">
import {Notifications} from "@kyvg/vue3-notification"
</script>

<style>
#app {
  overflow: hidden;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'

const config = useRuntimeConfig()
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)

const instruments = ref([])

async function getInstruments() {
  const { data } = await supabase.from('instruments').select()
  instruments.value = data
}

onMounted(() => {
  getInstruments()
})
</script>

<template>
  <AppHeader/>

  <ul>
    <li v-for="instrument in instruments" :key="instrument.id">{{ instrument.name }}</li>
  </ul>
</template>
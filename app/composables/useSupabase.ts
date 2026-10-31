import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Geef expliciet aan dat het om een SupabaseClient of null gaat
let supabase: SupabaseClient | null = null

export const useSupabase = () => {
    if (!supabase) {
        const config = useRuntimeConfig()
        supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)
    }
    return supabase
}
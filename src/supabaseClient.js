import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oajlmdrwoakaoanatzhq.supabase.co'
const supabaseKey = 'sb_publishable_wpKznkXKZa-F-0D0ffHbgg__iW5wl2d'

export const supabase = createClient(supabaseUrl, supabaseKey)

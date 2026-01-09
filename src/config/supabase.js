import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Cliente para o banco de dados principal (clientes e cobranças)
export const supabaseMain = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Cliente para o banco de dados do bot (logs e configurações)
export const supabaseBot = createClient(
  process.env.BOT_SUPABASE_URL,
  process.env.BOT_SUPABASE_KEY
);

console.log('✅ Conexões Supabase configuradas');


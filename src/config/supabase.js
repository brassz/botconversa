import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Validar variáveis de ambiente
const requiredEnvVars = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  BOT_SUPABASE_URL: process.env.BOT_SUPABASE_URL,
  BOT_SUPABASE_KEY: process.env.BOT_SUPABASE_KEY
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('❌ Variáveis de ambiente faltando:', missingVars.join(', '));
  console.error('📋 Configuradas:', Object.keys(requiredEnvVars).filter(key => requiredEnvVars[key]));
  throw new Error(`Variáveis de ambiente obrigatórias não configuradas: ${missingVars.join(', ')}`);
}

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

console.log('✅ Conexões Supabase configuradas com sucesso!');


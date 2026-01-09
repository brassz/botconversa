import { supabaseMain } from '../config/supabase.js';
import { STATUS } from '../config/constants.js';

/**
 * Busca clientes com status específico
 * @param {string} status - overdue, due_today ou active
 */
export async function getClientsByStatus(status) {
  try {
    const { data, error } = await supabaseMain
      .from('clientes')
      .select('*')
      .eq('status', status);

    if (error) throw error;

    console.log(`📊 Encontrados ${data?.length || 0} clientes com status: ${status}`);
    return data || [];
  } catch (error) {
    console.error('❌ Erro ao buscar clientes:', error);
    throw error;
  }
}

/**
 * Busca clientes atrasados
 */
export async function getOverdueClients() {
  return await getClientsByStatus(STATUS.OVERDUE);
}

/**
 * Busca clientes que vencem hoje
 */
export async function getDueTodayClients() {
  return await getClientsByStatus(STATUS.DUE_TODAY);
}

/**
 * Busca clientes ativos (para lembrete de vencimento amanhã)
 */
export async function getActiveClients() {
  return await getClientsByStatus(STATUS.ACTIVE);
}

/**
 * Busca todos os clientes que precisam receber mensagens
 */
export async function getAllClientsForReminder() {
  try {
    const { data, error } = await supabaseMain
      .from('clientes')
      .select('*')
      .in('status', [STATUS.OVERDUE, STATUS.DUE_TODAY, STATUS.ACTIVE]);

    if (error) throw error;

    console.log(`📊 Total de clientes para lembrete: ${data?.length || 0}`);
    return data || [];
  } catch (error) {
    console.error('❌ Erro ao buscar clientes:', error);
    throw error;
  }
}

/**
 * Calcula dias de atraso
 */
export function calcularDiasAtraso(dataVencimento) {
  const hoje = new Date();
  const vencimento = new Date(dataVencimento);
  const diferenca = hoje - vencimento;
  return Math.floor(diferenca / (1000 * 60 * 60 * 24));
}

/**
 * Formata data para exibição
 */
export function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR');
}

/**
 * Formata valor monetário
 */
export function formatarValor(valor) {
  return parseFloat(valor).toFixed(2).replace('.', ',');
}


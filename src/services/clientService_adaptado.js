import { supabaseMain } from '../config/supabase.js';
import { STATUS } from '../config/constants.js';

/**
 * VERSÃO ADAPTADA PARA TABELAS EXISTENTES: loans + clients
 * 
 * Ajuste os nomes dos campos conforme seu banco:
 * - loans.amount ou loans.valor
 * - loans.due_date ou loans.data_vencimento
 * - clients.name ou clients.nome
 * - clients.phone ou clients.telefone
 */

// ⚠️ CONFIGURE AQUI OS NOMES DAS COLUNAS DO SEU BANCO
const FIELD_MAPPING = {
  // Tabela clients
  clientName: 'name',        // ou 'nome' se for em português
  clientPhone: 'phone',      // ou 'telefone'
  clientEmail: 'email',
  
  // Tabela loans
  loanAmount: 'amount',      // ou 'valor'
  loanDueDate: 'due_date',   // ou 'data_vencimento'
  loanStatus: 'status',
  loanClientId: 'client_id'
};

/**
 * Busca empréstimos (loans) com dados dos clientes por status
 * @param {string} status - overdue, due_today ou active
 */
export async function getLoansByStatus(status) {
  try {
    // Query com JOIN entre loans e clients
    const { data, error } = await supabaseMain
      .from('loans')
      .select(`
        id,
        ${FIELD_MAPPING.loanAmount},
        ${FIELD_MAPPING.loanDueDate},
        ${FIELD_MAPPING.loanStatus},
        clients:${FIELD_MAPPING.loanClientId} (
          id,
          ${FIELD_MAPPING.clientName},
          ${FIELD_MAPPING.clientPhone},
          ${FIELD_MAPPING.clientEmail}
        )
      `)
      .eq(FIELD_MAPPING.loanStatus, status);

    if (error) throw error;

    // Transformar para formato esperado pelo bot
    const loans = (data || []).map(loan => ({
      id: loan.id,
      loan_id: loan.id,
      client_id: loan.clients?.id,
      nome: loan.clients?.[FIELD_MAPPING.clientName],
      telefone: loan.clients?.[FIELD_MAPPING.clientPhone],
      email: loan.clients?.[FIELD_MAPPING.clientEmail],
      valor: loan[FIELD_MAPPING.loanAmount],
      data_vencimento: loan[FIELD_MAPPING.loanDueDate],
      status: loan[FIELD_MAPPING.loanStatus]
    }));

    console.log(`📊 Encontrados ${loans.length} empréstimos com status: ${status}`);
    return loans;
  } catch (error) {
    console.error('❌ Erro ao buscar empréstimos:', error);
    throw error;
  }
}

/**
 * Busca empréstimos atrasados
 */
export async function getOverdueClients() {
  return await getLoansByStatus(STATUS.OVERDUE);
}

/**
 * Busca empréstimos que vencem hoje
 */
export async function getDueTodayClients() {
  return await getLoansByStatus(STATUS.DUE_TODAY);
}

/**
 * Busca empréstimos ativos (para lembrete de vencimento amanhã)
 */
export async function getActiveClients() {
  return await getLoansByStatus(STATUS.ACTIVE);
}

/**
 * Busca todos os empréstimos que precisam receber mensagens
 * Filtra apenas: OVERDUE (atrasados) e DUE_TODAY (vencem hoje)
 */
export async function getAllClientsForReminder() {
  try {
    const { data, error } = await supabaseMain
      .from('loans')
      .select(`
        id,
        ${FIELD_MAPPING.loanAmount},
        ${FIELD_MAPPING.loanDueDate},
        ${FIELD_MAPPING.loanStatus},
        clients:${FIELD_MAPPING.loanClientId} (
          id,
          ${FIELD_MAPPING.clientName},
          ${FIELD_MAPPING.clientPhone},
          ${FIELD_MAPPING.clientEmail}
        )
      `)
      .in(FIELD_MAPPING.loanStatus, [STATUS.OVERDUE, STATUS.DUE_TODAY]);

    if (error) throw error;

    const loans = (data || []).map(loan => ({
      id: loan.id,
      loan_id: loan.id,
      client_id: loan.clients?.id,
      nome: loan.clients?.[FIELD_MAPPING.clientName],
      telefone: loan.clients?.[FIELD_MAPPING.clientPhone],
      email: loan.clients?.[FIELD_MAPPING.clientEmail],
      valor: loan[FIELD_MAPPING.loanAmount],
      data_vencimento: loan[FIELD_MAPPING.loanDueDate],
      status: loan[FIELD_MAPPING.loanStatus]
    }));

    console.log(`📊 Total de empréstimos para lembrete: ${loans.length}`);
    return loans;
  } catch (error) {
    console.error('❌ Erro ao buscar empréstimos:', error);
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


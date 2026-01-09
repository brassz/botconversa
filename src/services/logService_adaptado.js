import { supabaseBot } from '../config/supabase.js';

/**
 * VERSÃO ADAPTADA: Registra log incluindo loan_id
 */

/**
 * Registra log de envio de mensagem
 */
export async function logMessageSent(loanData, messageType, success, errorMessage = null) {
  try {
    const logEntry = {
      loan_id: loanData.loan_id || loanData.id,
      client_id: loanData.client_id,
      client_name: loanData.nome,
      phone: loanData.telefone,
      message_type: messageType, // 'lembrete', 'vencimento_hoje', 'atraso'
      status: success ? 'sent' : 'failed',
      error_message: errorMessage,
      sent_at: new Date().toISOString()
    };

    const { error } = await supabaseBot
      .from('message_logs')
      .insert(logEntry);

    if (error) {
      console.error('❌ Erro ao salvar log:', error);
    } else {
      console.log(`📝 Log registrado: ${messageType} para ${loanData.nome} (Loan #${loanData.loan_id || loanData.id})`);
    }
  } catch (error) {
    console.error('❌ Erro ao criar log:', error);
  }
}

/**
 * Busca histórico de mensagens enviadas
 */
export async function getMessageHistory(clientId = null, loanId = null, limit = 50) {
  try {
    let query = supabaseBot
      .from('message_logs')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(limit);

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    if (loanId) {
      query = query.eq('loan_id', loanId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('❌ Erro ao buscar histórico:', error);
    return [];
  }
}

/**
 * Verifica se já foi enviada mensagem hoje para um empréstimo
 */
export async function wasMessageSentToday(loanId, messageType) {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const { data, error } = await supabaseBot
      .from('message_logs')
      .select('*')
      .eq('loan_id', loanId)
      .eq('message_type', messageType)
      .eq('status', 'sent')
      .gte('sent_at', hoje.toISOString())
      .limit(1);

    if (error) throw error;

    return data && data.length > 0;
  } catch (error) {
    console.error('❌ Erro ao verificar envio:', error);
    return false;
  }
}


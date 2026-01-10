import { supabaseBot } from '../config/supabase.js';

/**
 * Registra log de envio de mensagem
 */
export async function logMessageSent(clientData, messageType, success, errorMessage = null, messageContent = null) {
  try {
    const logEntry = {
      client_id: clientData.id,
      client_name: clientData.nome,
      phone: clientData.telefone,
      message_type: messageType, // 'lembrete', 'vencimento_hoje', 'atraso'
      message_content: messageContent, // Conteúdo da mensagem
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
      console.log(`📝 Log registrado: ${messageType} para ${clientData.nome}`);
    }
  } catch (error) {
    console.error('❌ Erro ao criar log:', error);
  }
}

/**
 * Busca histórico de mensagens enviadas
 */
export async function getMessageHistory(clientId = null, limit = 50) {
  try {
    let query = supabaseBot
      .from('message_logs')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(limit);

    if (clientId) {
      query = query.eq('client_id', clientId);
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
 * Verifica se já foi enviada mensagem hoje para um cliente
 */
export async function wasMessageSentToday(clientId, messageType) {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const { data, error } = await supabaseBot
      .from('message_logs')
      .select('*')
      .eq('client_id', clientId)
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

/**
 * Busca todas as mensagens enviadas no dia atual
 */
export async function getMessagesToday() {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    const { data, error } = await supabaseBot
      .from('message_logs')
      .select('*')
      .gte('sent_at', hoje.toISOString())
      .lt('sent_at', amanha.toISOString())
      .order('sent_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('❌ Erro ao buscar mensagens do dia:', error);
    return [];
  }
}


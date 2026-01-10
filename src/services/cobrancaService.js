import { sendMessage } from '../bot/whatsapp.js';
import { MENSAGENS, STATUS } from '../config/constants.js';
import { 
  getOverdueClients, 
  getDueTodayClients, 
  getActiveClients,
  calcularDiasAtraso,
  formatarData,
  formatarValor 
} from './clientService_adaptado.js';
import { logMessageSent, wasMessageSentToday } from './logService_adaptado.js';

/**
 * Envia lembretes para clientes que vencem amanhã
 */
export async function enviarLembretes() {
  console.log('🔔 Iniciando envio de lembretes (vencimento amanhã)...');
  
  try {
    const clientes = await getActiveClients();
    
    if (!clientes || clientes.length === 0) {
      console.log('ℹ️ Nenhum cliente com vencimento amanhã');
      return { success: true, sent: 0, failed: 0 };
    }

    let enviados = 0;
    let falhas = 0;

    for (const cliente of clientes) {
      try {
        // Verificar se já foi enviado hoje
        const jaEnviado = await wasMessageSentToday(cliente.id, 'lembrete');
        if (jaEnviado) {
          console.log(`⏭️ Lembrete já enviado hoje para ${cliente.nome}`);
          continue;
        }

        const mensagem = MENSAGENS.LEMBRETE(
          cliente.nome,
          formatarValor(cliente.valor),
          formatarData(cliente.data_vencimento)
        );

        await sendMessage(cliente.telefone, mensagem);
        await logMessageSent(cliente, 'lembrete', true);
        enviados++;

        // Delay para evitar bloqueio do WhatsApp
        await sleep(3000);
      } catch (error) {
        console.error(`❌ Erro ao enviar lembrete para ${cliente.nome}:`, error);
        await logMessageSent(cliente, 'lembrete', false, error.message);
        falhas++;
      }
    }

    console.log(`✅ Lembretes: ${enviados} enviados, ${falhas} falhas`);
    return { success: true, sent: enviados, failed: falhas };
  } catch (error) {
    console.error('❌ Erro ao enviar lembretes:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envia mensagens para clientes com vencimento hoje
 */
export async function enviarVencimentoHoje() {
  console.log('⏰ Iniciando envio para vencimentos de hoje...');
  
  try {
    const clientes = await getDueTodayClients();
    
    if (!clientes || clientes.length === 0) {
      console.log('ℹ️ Nenhum cliente com vencimento hoje');
      return { success: true, sent: 0, failed: 0 };
    }

    let enviados = 0;
    let falhas = 0;

    for (const cliente of clientes) {
      try {
        // Verificar se já foi enviado hoje
        const jaEnviado = await wasMessageSentToday(cliente.id, 'vencimento_hoje');
        if (jaEnviado) {
          console.log(`⏭️ Mensagem de vencimento já enviada hoje para ${cliente.nome}`);
          continue;
        }

        const mensagem = MENSAGENS.VENCIMENTO_HOJE(
          cliente.nome,
          formatarValor(cliente.valor),
          formatarData(cliente.data_vencimento)
        );

        await sendMessage(cliente.telefone, mensagem);
        await logMessageSent(cliente, 'vencimento_hoje', true);
        enviados++;

        await sleep(3000);
      } catch (error) {
        console.error(`❌ Erro ao enviar para ${cliente.nome}:`, error);
        await logMessageSent(cliente, 'vencimento_hoje', false, error.message);
        falhas++;
      }
    }

    console.log(`✅ Vencimento hoje: ${enviados} enviados, ${falhas} falhas`);
    return { success: true, sent: enviados, failed: falhas };
  } catch (error) {
    console.error('❌ Erro ao enviar vencimentos:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envia mensagens para clientes em atraso
 */
export async function enviarCobrancasAtrasadas() {
  console.log('⚠️ Iniciando envio de cobranças em atraso...');
  
  try {
    const clientes = await getOverdueClients();
    
    if (!clientes || clientes.length === 0) {
      console.log('ℹ️ Nenhum cliente em atraso');
      return { success: true, sent: 0, failed: 0 };
    }

    let enviados = 0;
    let falhas = 0;

    for (const cliente of clientes) {
      try {
        // Verificar se já foi enviado hoje
        const jaEnviado = await wasMessageSentToday(cliente.id, 'atraso');
        if (jaEnviado) {
          console.log(`⏭️ Cobrança já enviada hoje para ${cliente.nome}`);
          continue;
        }

        const diasAtraso = calcularDiasAtraso(cliente.data_vencimento);
        
        const mensagem = MENSAGENS.ATRASO(
          cliente.nome,
          formatarValor(cliente.valor),
          formatarData(cliente.data_vencimento),
          diasAtraso
        );

        await sendMessage(cliente.telefone, mensagem);
        await logMessageSent(cliente, 'atraso', true);
        enviados++;

        await sleep(3000);
      } catch (error) {
        console.error(`❌ Erro ao enviar cobrança para ${cliente.nome}:`, error);
        await logMessageSent(cliente, 'atraso', false, error.message);
        falhas++;
      }
    }

    console.log(`✅ Cobranças atrasadas: ${enviados} enviados, ${falhas} falhas`);
    return { success: true, sent: enviados, failed: falhas };
  } catch (error) {
    console.error('❌ Erro ao enviar cobranças:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Processa todas as cobranças
 */
export async function processarTodasCobrancas() {
  console.log('🚀 Iniciando processamento de todas as cobranças...');
  
  const resultados = {
    lembretes: await enviarLembretes(),
    vencimentoHoje: await enviarVencimentoHoje(),
    atrasadas: await enviarCobrancasAtrasadas()
  };

  console.log('📊 Resumo do processamento:', resultados);
  return resultados;
}

// Função auxiliar para delay
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


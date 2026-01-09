import cron from 'node-cron';
import { 
  enviarLembretes, 
  enviarVencimentoHoje, 
  enviarCobrancasAtrasadas 
} from '../services/cobrancaService.js';
import { HORARIOS } from '../config/constants.js';

// Converte horário "HH:MM" para formato cron
function horarioParaCron(horario) {
  const [hora, minuto] = horario.split(':');
  return `${minuto} ${hora} * * *`; // Minuto Hora DiaMes Mes DiaSemana
}

// Inicializa os cron jobs
export function iniciarCronJobs() {
  console.log('⏲️ Configurando agendamentos...\n');

  // Lembretes (vencimento amanhã)
  const cronLembretes = horarioParaCron(HORARIOS.LEMBRETE);
  cron.schedule(cronLembretes, async () => {
    console.log(`\n🔔 [${new Date().toLocaleString()}] Executando: Lembretes`);
    await enviarLembretes();
  });
  console.log(`✅ Lembretes agendados para: ${HORARIOS.LEMBRETE} (${cronLembretes})`);

  // Vencimento hoje
  const cronVencimento = horarioParaCron(HORARIOS.VENCIMENTO);
  cron.schedule(cronVencimento, async () => {
    console.log(`\n⏰ [${new Date().toLocaleString()}] Executando: Vencimento Hoje`);
    await enviarVencimentoHoje();
  });
  console.log(`✅ Vencimento hoje agendado para: ${HORARIOS.VENCIMENTO} (${cronVencimento})`);

  // Cobranças atrasadas
  const cronAtraso = horarioParaCron(HORARIOS.ATRASO);
  cron.schedule(cronAtraso, async () => {
    console.log(`\n⚠️ [${new Date().toLocaleString()}] Executando: Cobranças Atrasadas`);
    await enviarCobrancasAtrasadas();
  });
  console.log(`✅ Cobranças atrasadas agendadas para: ${HORARIOS.ATRASO} (${cronAtraso})`);

  // Job de teste a cada 5 minutos (pode comentar em produção)
  if (process.env.NODE_ENV === 'development') {
    cron.schedule('*/5 * * * *', () => {
      console.log(`\n🔍 [${new Date().toLocaleString()}] Bot ativo e funcionando...`);
    });
    console.log('✅ Health check configurado (a cada 5 minutos)');
  }

  console.log('\n✅ Todos os agendamentos configurados!\n');
}


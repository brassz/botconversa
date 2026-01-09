/**
 * Arquivo de exemplo de configuração
 * Copie para config.js e ajuste conforme necessário
 * 
 * ATENÇÃO: Este arquivo é apenas um exemplo
 * Use variáveis de ambiente (.env) em produção
 */

export default {
  // Configurações do Supabase
  supabase: {
    main: {
      url: process.env.SUPABASE_URL || 'https://mhtxyxizfnxupwmilith.supabase.co',
      key: process.env.SUPABASE_KEY || 'sua-chave-aqui'
    },
    bot: {
      url: process.env.BOT_SUPABASE_URL || 'https://vpxdtrhqzxfllgjvrdrg.supabase.co',
      key: process.env.BOT_SUPABASE_KEY || 'sua-chave-aqui'
    }
  },

  // Configurações do servidor
  server: {
    port: parseInt(process.env.PORT) || 3000,
    env: process.env.NODE_ENV || 'development'
  },

  // Horários de envio (formato HH:MM em 24h)
  schedule: {
    lembretes: process.env.HORA_ENVIO_LEMBRETES || '09:00',
    vencimentoHoje: process.env.HORA_ENVIO_VENCIMENTO || '09:00',
    atrasadas: process.env.HORA_ENVIO_ATRASO || '10:00'
  },

  // Configurações de envio
  messaging: {
    delayBetweenMessages: 3000, // 3 segundos entre cada mensagem
    maxRetries: 3, // Número máximo de tentativas
    retryDelay: 5000 // Delay entre tentativas (5 segundos)
  },

  // Configurações de log
  logging: {
    level: process.env.LOG_LEVEL || 'info', // silent, error, warn, info, debug
    prettyPrint: process.env.NODE_ENV === 'development'
  }
};


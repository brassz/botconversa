export const STATUS = {
  OVERDUE: 'overdue',      // Atrasado
  DUE_TODAY: 'due_today',  // Vence hoje
  ACTIVE: 'active'         // Ativo (vence amanhã - para lembrete)
};

export const MENSAGENS = {
  LEMBRETE: (nome, valor, dataVencimento) => 
    `Olá *${nome}*! 👋\n\n` +
    `Este é um *lembrete amigável* de que sua mensalidade no valor de *R$ ${valor}* ` +
    `vencerá amanhã (${dataVencimento}).\n\n` +
    `Para evitar interrupção no serviço, realize o pagamento o quanto antes.\n\n` +
    `Em caso de dúvidas, estamos à disposição! 😊`,

  VENCIMENTO_HOJE: (nome, valor, dataVencimento) =>
    `Olá *${nome}*! ⏰\n\n` +
    `Sua mensalidade no valor de *R$ ${valor}* ` +
    `*vence hoje* (${dataVencimento}).\n\n` +
    `Por favor, realize o pagamento para manter seu serviço ativo.\n\n` +
    `Qualquer dúvida, estamos aqui para ajudar! 💙`,

  ATRASO: (nome, valor, dataVencimento, diasAtraso) =>
    `Olá *${nome}*! ⚠️\n\n` +
    `Identificamos que sua mensalidade no valor de *R$ ${valor}* ` +
    `está em atraso desde ${dataVencimento} (${diasAtraso} dia(s)).\n\n` +
    `Para evitar a suspensão do serviço, por favor regularize seu pagamento o mais breve possível.\n\n` +
    `Se já realizou o pagamento, desconsidere esta mensagem.\n\n` +
    `Estamos à disposição para ajudar! 📞`
};

export const HORARIOS = {
  LEMBRETE: process.env.HORA_ENVIO_LEMBRETES || '09:00',
  VENCIMENTO: process.env.HORA_ENVIO_VENCIMENTO || '09:00',
  ATRASO: process.env.HORA_ENVIO_ATRASO || '10:00'
};


import wppconnect from '@wppconnect-team/wppconnect';
import QRCode from 'qrcode';

let client = null;
let qrCodeData = null;
let isConnected = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;

// Função para conectar ao WhatsApp
export async function connectWhatsApp() {
  try {
    console.log('🔌 Estabelecendo conexão com WhatsApp via Wppconnect...');

    client = await wppconnect.create({
      session: 'cobranca-session',
      catchQR: (base64Qr, asciiQR, attempts, urlCode) => {
        qrCodeData = base64Qr;
        console.log('📱 QR Code gerado! Acesse /api/qr para escanear');
        console.log('📋 Tentativa:', attempts);
      },
      statusFind: (statusSession, session) => {
        console.log('🔍 Status da sessão:', statusSession);
        
        if (statusSession === 'qrReadSuccess') {
          console.log('✅ QR Code escaneado com sucesso!');
        } else if (statusSession === 'isLogged') {
          isConnected = true;
          qrCodeData = null;
          reconnectAttempts = 0;
          console.log('✅ Conectado ao WhatsApp com sucesso!');
        } else if (statusSession === 'inChat') {
          // Status quando está conectado e pronto
          isConnected = true;
          qrCodeData = null;
          reconnectAttempts = 0;
          console.log('✅ WhatsApp conectado e pronto (inChat)!');
        } else if (statusSession === 'browserClose') {
          // Status quando já existe sessão salva
          console.log('🔄 Sessão existente detectada, verificando conexão...');
        } else if (statusSession === 'notLogged') {
          isConnected = false;
          console.log('⚠️ Não logado. Aguardando QR Code...');
        } else if (statusSession === 'autocloseCalled' || statusSession === 'desconnectedMobile') {
          isConnected = false;
          console.log('❌ Desconectado do WhatsApp');
          
          // Tentar reconectar
          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;
            console.log(`🔄 Tentativa de reconexão ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} em 10s...`);
            setTimeout(() => connectWhatsApp(), 10000);
          } else {
            console.log('⚠️ Máximo de tentativas atingido. Reinicie o serviço ou acesse /api/qr');
          }
        }
      },
      headless: 'new', // Modo headless (sem interface gráfica)
      devtools: false,
      useChrome: true,
      debug: false,
      logQR: false, // Não mostrar QR no terminal (usaremos API)
      browserArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-extensions'
      ],
      autoClose: 0, // Não fechar automaticamente
      disableWelcome: true, // Não mostrar mensagem de boas-vindas
      puppeteerOptions: {
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    console.log('✅ Cliente Wppconnect inicializado!');
    
    // Verificar estado real da conexão após inicialização
    setTimeout(async () => {
      try {
        const state = await client.getConnectionState();
        console.log('🔍 Estado da conexão verificado:', state);
        
        if (state === 'CONNECTED' || state === 'CONNECTED_WITH_PHONE') {
          isConnected = true;
          qrCodeData = null;
          reconnectAttempts = 0;
          console.log('✅ WhatsApp conectado (verificação ativa)');
        }
      } catch (error) {
        console.log('⚠️ Não foi possível verificar estado da conexão:', error.message);
      }
    }, 3000);
    
    return client;

  } catch (error) {
    console.error('❌ Erro ao conectar WhatsApp:', error.message);
    
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      console.log(`🔄 Tentando novamente em 15s... (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
      setTimeout(() => connectWhatsApp(), 15000);
    }
    
    throw error;
  }
}

// Função para formatar número de telefone (Brasil e outros países)
function formatPhoneNumber(phone) {
  // Remove todos os caracteres não numéricos
  let cleaned = phone.replace(/\D/g, '');
  
  // Se já tem @c.us, retorna como está
  if (phone.includes('@c.us')) {
    return phone;
  }
  
  // Remove zeros à esquerda
  cleaned = cleaned.replace(/^0+/, '');
  
  // Detectar país baseado no código
  // 55 = Brasil, 54 = Argentina, 1 = EUA/Canadá, etc
  
  // Se já tem código de país (12+ dígitos), usar como está
  if (cleaned.length >= 12) {
    return `${cleaned}@c.us`;
  }
  
  // Se tem 11 dígitos, assumir Brasil (celular com DDD)
  if (cleaned.length === 11) {
    return `55${cleaned}@c.us`;
  }
  
  // Se tem 10 dígitos, assumir Brasil (fixo com DDD)
  if (cleaned.length === 10) {
    return `55${cleaned}@c.us`;
  }
  
  // Se tem 9 dígitos, falta DDD
  if (cleaned.length === 9) {
    throw new Error(`Número incompleto (falta DDD): ${phone}`);
  }
  
  // Se tem menos de 9, número inválido
  if (cleaned.length < 9) {
    throw new Error(`Número muito curto: ${phone}`);
  }
  
  // Caso padrão: tentar adicionar 55
  return `55${cleaned}@c.us`;
}

// Função para verificar se número tem WhatsApp
export async function checkPhoneNumber(phone) {
  if (!client || !isConnected) {
    throw new Error('WhatsApp não está conectado');
  }

  try {
    const formattedPhone = formatPhoneNumber(phone);
    console.log(`🔍 Verificando número: ${phone} → ${formattedPhone}`);
    
    const result = await client.checkNumberStatus(formattedPhone);
    
    return {
      phone: phone,
      formatted: formattedPhone,
      exists: result?.numberExists === true,
      canReceive: result?.canReceiveMessage === true,
      jid: result?.id?._serialized || null
    };
  } catch (error) {
    console.error(`❌ Erro ao verificar número ${phone}:`, error.message);
    return {
      phone: phone,
      formatted: formatPhoneNumber(phone),
      exists: false,
      canReceive: false,
      error: error.message
    };
  }
}

// Função para enviar mensagem
export async function sendMessage(phone, message) {
  if (!client) {
    throw new Error('WhatsApp não está conectado. Cliente não inicializado.');
  }

  if (!isConnected) {
    throw new Error('WhatsApp não está conectado. Escaneie o QR Code.');
  }

  try {
    // Formatar número
    const formattedPhone = formatPhoneNumber(phone);
    
    console.log(`\n${'='.repeat(50)}`);
    console.log(`📤 TENTATIVA DE ENVIO`);
    console.log(`📱 Número original: ${phone}`);
    console.log(`📲 Número formatado: ${formattedPhone}`);
    console.log(`💬 Mensagem (${message.length} caracteres)`);
    console.log(`${'='.repeat(50)}\n`);
    
    // Verificar se o número existe no WhatsApp
    console.log(`🔍 Etapa 1: Verificando número...`);
    const verification = await checkPhoneNumber(phone);
    
    console.log(`📊 Resultado da verificação:`);
    console.log(`   - Existe: ${verification.exists}`);
    console.log(`   - Pode receber: ${verification.canReceive}`);
    console.log(`   - JID: ${verification.jid}`);
    
    if (!verification.exists) {
      const errorMsg = `Número ${phone} não tem WhatsApp ou está incorreto`;
      console.error(`❌ ${errorMsg}`);
      throw new Error(errorMsg);
    }
    
    if (!verification.canReceive) {
      console.warn(`⚠️ Número pode ter restrições, mas tentando enviar mesmo assim...`);
    }
    
    console.log(`✅ Número verificado com sucesso!\n`);
    
    // Aguardar um pouco antes de enviar (evita problemas de timing)
    console.log(`⏳ Aguardando 2 segundos antes de enviar...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Usar o JID retornado pela verificação (mais confiável)
    console.log(`📤 Etapa 2: Enviando mensagem...`);
    
    let result;
    let targetNumber = formattedPhone;
    
    // Se a verificação retornou um JID diferente, usar ele
    if (verification.jid && verification.jid !== formattedPhone) {
      console.log(`⚠️ JID verificado difere do formatado!`);
      console.log(`   Formatado: ${formattedPhone}`);
      console.log(`   JID real:  ${verification.jid}`);
      console.log(`   ✅ Usando JID verificado pelo WhatsApp`);
      targetNumber = verification.jid;
    }
    
    try {
      console.log(`   Enviando para: ${targetNumber}`);
      result = await client.sendText(targetNumber, message);
      console.log(`   ✅ Mensagem enviada com sucesso!`);
    } catch (error) {
      console.error(`   ❌ Falha no envio: ${error.message}`);
      throw error;
    }
    
    console.log(`\n✅ MENSAGEM ENVIADA COM SUCESSO!`);
    console.log(`   Número usado: ${targetNumber}`);
    console.log(`   ID da mensagem: ${result?.id || 'N/A'}`);
    console.log(`   Status: ${result?.status || 'N/A'}`);
    console.log(`${'='.repeat(50)}\n`);
    
    return { 
      success: true, 
      phone, 
      message,
      targetNumber,
      messageId: result?.id,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`\n❌ FALHA NO ENVIO`);
    console.error(`📱 Número: ${phone}`);
    console.error(`❌ Erro: ${error.message}`);
    console.error(`📋 Stack: ${error.stack}`);
    console.error(`${'='.repeat(50)}\n`);
    throw error;
  }
}

// Obter status da conexão
export async function getConnectionStatus() {
  // Tentar verificar o estado real se temos um cliente
  if (client && !isConnected) {
    try {
      const state = await client.getConnectionState();
      console.log('🔍 Verificação de estado:', state);
      
      if (state === 'CONNECTED' || state === 'CONNECTED_WITH_PHONE') {
        isConnected = true;
        qrCodeData = null;
        console.log('✅ Status atualizado: conectado!');
      }
    } catch (error) {
      // Ignorar erro silenciosamente
    }
  }
  
  return {
    connected: isConnected,
    hasQR: !!qrCodeData,
    qr: qrCodeData
  };
}

// Versão síncrona para compatibilidade
export function getConnectionStatusSync() {
  return {
    connected: isConnected,
    hasQR: !!qrCodeData,
    qr: qrCodeData
  };
}

// Obter instância do cliente
export function getClient() {
  return client;
}

// Desconectar
export async function disconnect() {
  if (client) {
    try {
      await client.close();
      client = null;
      isConnected = false;
      qrCodeData = null;
      console.log('👋 Desconectado do WhatsApp');
    } catch (error) {
      console.error('❌ Erro ao desconectar:', error.message);
    }
  }
}

// Verificar se está conectado
export function isWhatsAppConnected() {
  return isConnected;
}

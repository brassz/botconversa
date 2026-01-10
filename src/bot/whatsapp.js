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

// Função para enviar mensagem
export async function sendMessage(phone, message) {
  if (!client) {
    throw new Error('WhatsApp não está conectado. Cliente não inicializado.');
  }

  if (!isConnected) {
    throw new Error('WhatsApp não está conectado. Escaneie o QR Code.');
  }

  try {
    // Formatar número para padrão WhatsApp
    // Se já tem @c.us, usa como está
    // Se não, adiciona
    const formattedPhone = phone.includes('@c.us') 
      ? phone 
      : `${phone.replace(/\D/g, '')}@c.us`;

    await client.sendText(formattedPhone, message);
    console.log(`✅ Mensagem enviada para ${phone}`);
    
    return { success: true, phone, message };
  } catch (error) {
    console.error(`❌ Erro ao enviar mensagem para ${phone}:`, error.message);
    throw error;
  }
}

// Obter status da conexão
export function getConnectionStatus() {
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

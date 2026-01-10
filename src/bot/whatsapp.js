import makeWASocket, { 
  DisconnectReason, 
  useMultiFileAuthState,
  Browsers
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import fs from 'fs';

const logger = pino({ level: 'silent' });

let sock = null;
let qrCodeData = null;
let isConnected = false;

// Função para conectar ao WhatsApp
export async function connectWhatsApp() {
  const authFolder = './auth_info';
  
  // Criar pasta de autenticação se não existir
  if (!fs.existsSync(authFolder)) {
    fs.mkdirSync(authFolder, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(authFolder);

  sock = makeWASocket({
    auth: state,
    logger,
    browser: Browsers.ubuntu('Chrome'),
    defaultQueryTimeoutMs: undefined,
    syncFullHistory: false,
    markOnlineOnConnect: true,
  });

  // Evento de atualização de conexão
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrCodeData = qr;
      console.log('📱 QR Code gerado! Acesse /api/qr para escanear');
    }

    if (connection === 'close') {
      isConnected = false;
      const statusCode = lastDisconnect?.error instanceof Boom 
        ? lastDisconnect.error.output.statusCode 
        : 500;
      
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      console.log(`❌ Conexão fechada (código: ${statusCode})`);

      if (shouldReconnect) {
        console.log('🔄 Tentando reconectar em 5 segundos...');
        setTimeout(() => connectWhatsApp(), 5000);
      } else {
        console.log('⚠️ Você foi deslogado. Acesse /api/qr para gerar novo QR Code');
      }
    } else if (connection === 'open') {
      isConnected = true;
      qrCodeData = null;
      console.log('✅ Conectado ao WhatsApp com sucesso!');
    }
  });

  // Salvar credenciais quando atualizadas
  sock.ev.on('creds.update', saveCreds);

  return sock;
}

// Função para enviar mensagem
export async function sendMessage(phone, message) {
  if (!sock || !isConnected) {
    throw new Error('WhatsApp não está conectado');
  }

  try {
    // Formatar número (adicionar @s.whatsapp.net)
    const formattedPhone = phone.includes('@s.whatsapp.net') 
      ? phone 
      : `${phone.replace(/\D/g, '')}@s.whatsapp.net`;

    await sock.sendMessage(formattedPhone, { text: message });
    console.log(`✅ Mensagem enviada para ${phone}`);
    return { success: true, phone, message };
  } catch (error) {
    console.error(`❌ Erro ao enviar mensagem para ${phone}:`, error);
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

// Obter instância do socket
export function getSocket() {
  return sock;
}

// Desconectar
export async function disconnect() {
  if (sock) {
    await sock.logout();
    sock = null;
    isConnected = false;
    qrCodeData = null;
  }
}


import makeWASocket, { 
  DisconnectReason, 
  useMultiFileAuthState,
  makeInMemoryStore,
  Browsers
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import path from 'path';

const logger = pino({ level: 'silent' });
const store = makeInMemoryStore({ logger });

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
    printQRInTerminal: true,
    logger,
    browser: Browsers.ubuntu('Chrome'),
    defaultQueryTimeoutMs: undefined,
  });

  store.bind(sock.ev);

  // Evento de atualização de conexão
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrCodeData = qr;
      console.log('📱 QR Code gerado! Escaneie com seu WhatsApp:');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      isConnected = false;
      const shouldReconnect = (lastDisconnect?.error instanceof Boom)
        ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
        : true;

      console.log('❌ Conexão fechada. Reconectando:', shouldReconnect);

      if (shouldReconnect) {
        setTimeout(() => connectWhatsApp(), 3000);
      }
    } else if (connection === 'open') {
      isConnected = true;
      qrCodeData = null;
      console.log('✅ Conectado ao WhatsApp!');
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


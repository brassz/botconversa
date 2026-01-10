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

// Variáveis de controle de reconexão
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 10000; // 10 segundos

// Função para conectar ao WhatsApp
export async function connectWhatsApp() {
  const authFolder = './auth_info';
  
  try {
    // Criar pasta de autenticação se não existir
    if (!fs.existsSync(authFolder)) {
      fs.mkdirSync(authFolder, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(authFolder);

    console.log('🔌 Estabelecendo conexão com WhatsApp...');

    sock = makeWASocket({
      auth: state,
      logger,
      browser: Browsers.windows('Chrome'), // Aparece como Windows Chrome (mais comum)
      defaultQueryTimeoutMs: 60000, // 60 segundos
      syncFullHistory: false,
      markOnlineOnConnect: false, // Não aparecer online automaticamente
      connectTimeoutMs: 60000,
      keepAliveIntervalMs: 30000,
    });

  // Evento de atualização de conexão
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrCodeData = qr;
      reconnectAttempts = 0; // Reset ao gerar QR
      console.log('📱 QR Code gerado! Acesse /api/qr para escanear');
      console.log('📋 Tamanho do QR:', qr.length);
    }

    if (connection === 'connecting') {
      console.log('🔄 Conectando ao WhatsApp...');
    }

    if (connection === 'close') {
      isConnected = false;
      const statusCode = lastDisconnect?.error instanceof Boom 
        ? lastDisconnect.error.output.statusCode 
        : 500;
      
      const errorMessage = lastDisconnect?.error?.message || 'Erro desconhecido';
      
      console.log(`❌ Conexão fechada (código: ${statusCode}, mensagem: ${errorMessage})`);

      // Códigos que NÃO devem reconectar
      const noReconnectCodes = [
        DisconnectReason.loggedOut,
        DisconnectReason.badSession,
      ];

      const shouldReconnect = !noReconnectCodes.includes(statusCode) 
        && reconnectAttempts < MAX_RECONNECT_ATTEMPTS;

      if (shouldReconnect) {
        reconnectAttempts++;
        console.log(`🔄 Tentativa ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} - Reconectando em ${RECONNECT_DELAY/1000}s...`);
        
        // Limpar sessão se erro 405 (pode estar corrompida)
        if (statusCode === 405 && reconnectAttempts >= 3) {
          console.log('🗑️ Limpando sessão corrompida...');
          try {
            if (fs.existsSync(authFolder)) {
              fs.rmSync(authFolder, { recursive: true, force: true });
            }
          } catch (e) {
            console.error('❌ Erro ao limpar sessão:', e.message);
          }
        }
        
        setTimeout(() => connectWhatsApp(), RECONNECT_DELAY);
      } else {
        if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
          console.log('⚠️ Máximo de tentativas atingido. Serviço em standby.');
          console.log('💡 Acesse /api/qr para tentar novamente ou reinicie o serviço.');
          reconnectAttempts = 0; // Reset para próxima tentativa manual
        } else {
          console.log('⚠️ Você foi deslogado. Acesse /api/qr para gerar novo QR Code');
        }
      }
    } else if (connection === 'open') {
      isConnected = true;
      qrCodeData = null;
      reconnectAttempts = 0; // Reset ao conectar
      console.log('✅ Conectado ao WhatsApp com sucesso!');
    }
  });

  // Salvar credenciais quando atualizadas
  sock.ev.on('creds.update', saveCreds);

  return sock;
  
  } catch (error) {
    console.error('❌ Erro fatal ao conectar WhatsApp:', error.message);
    console.log('🔄 Tentando novamente em 15 segundos...');
    
    setTimeout(() => {
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        connectWhatsApp();
      }
    }, 15000);
    
    throw error;
  }
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


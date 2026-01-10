import express from 'express';
import { getConnectionStatus, sendMessage } from '../bot/whatsapp.js';
import { 
  processarTodasCobrancas,
  enviarLembretes,
  enviarVencimentoHoje,
  enviarCobrancasAtrasadas
} from '../services/cobrancaService.js';
import { getMessageHistory } from '../services/logService.js';
import { 
  getAllClientsForReminder,
  getOverdueClients,
  getDueTodayClients,
  getActiveClients
} from '../services/clientService.js';

const router = express.Router();

// Rota de health check
router.get('/', (req, res) => {
  const status = getConnectionStatus();
  res.json({
    status: 'online',
    service: 'Sistema de Notificações',
    version: '1.0.0',
    whatsapp: status.connected ? 'conectado' : 'desconectado',
    timestamp: new Date().toISOString()
  });
});

// Status da conexão WhatsApp
router.get('/status', (req, res) => {
  const status = getConnectionStatus();
  res.json({
    ...status,
    timestamp: new Date().toISOString()
  });
});

// Obter QR Code para conectar
router.get('/qr', (req, res) => {
  const { qr, connected } = getConnectionStatus();
  
  if (connected) {
    return res.json({ 
      message: 'WhatsApp já está conectado',
      connected: true 
    });
  }

  if (qr) {
    return res.json({ 
      qr,
      message: 'Escaneie o QR Code com seu WhatsApp',
      instructions: 'Copie o código acima e use um gerador de QR Code online como: https://qr-code-styling.com/'
    });
  }

  res.json({ 
    message: 'Aguardando geração do QR Code...',
    hint: 'Se demorar muito, pode haver problema de conexão. Verifique os logs.',
    troubleshooting: 'Erro 405 geralmente indica problema de rede ou rate limit. Aguarde alguns minutos e tente reiniciar o serviço.'
  });
});

// Enviar mensagem manualmente
router.post('/send', async (req, res) => {
  try {
    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({ 
        error: 'Telefone e mensagem são obrigatórios' 
      });
    }

    const result = await sendMessage(phone, message);
    res.json({ 
      success: true, 
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Processar todas as cobranças manualmente
router.post('/cobrancas/processar', async (req, res) => {
  try {
    const resultado = await processarTodasCobrancas();
    res.json({ 
      success: true, 
      resultado,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Enviar apenas lembretes
router.post('/cobrancas/lembretes', async (req, res) => {
  try {
    const resultado = await enviarLembretes();
    res.json({ 
      success: true, 
      resultado,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Enviar vencimento hoje
router.post('/cobrancas/vencimento-hoje', async (req, res) => {
  try {
    const resultado = await enviarVencimentoHoje();
    res.json({ 
      success: true, 
      resultado,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Enviar cobranças atrasadas
router.post('/cobrancas/atrasadas', async (req, res) => {
  try {
    const resultado = await enviarCobrancasAtrasadas();
    res.json({ 
      success: true, 
      resultado,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Listar clientes por status
router.get('/clientes/:status', async (req, res) => {
  try {
    const { status } = req.params;
    let clientes;

    switch (status) {
      case 'overdue':
        clientes = await getOverdueClients();
        break;
      case 'due_today':
        clientes = await getDueTodayClients();
        break;
      case 'active':
        clientes = await getActiveClients();
        break;
      case 'all':
        clientes = await getAllClientsForReminder();
        break;
      default:
        return res.status(400).json({ 
          error: 'Status inválido. Use: overdue, due_today, active ou all' 
        });
    }

    res.json({ 
      status, 
      count: clientes.length,
      clientes,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Histórico de mensagens
router.get('/historico', async (req, res) => {
  try {
    const { client_id, limit } = req.query;
    const historico = await getMessageHistory(
      client_id ? parseInt(client_id) : null,
      limit ? parseInt(limit) : 50
    );

    res.json({ 
      count: historico.length,
      historico,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;


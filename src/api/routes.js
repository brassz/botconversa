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

// Obter QR Code para conectar (retorna HTML com imagem)
router.get('/qr', async (req, res) => {
  const { qr, connected } = getConnectionStatus();
  
  if (connected) {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WhatsApp Conectado</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
          }
          .success-icon {
            font-size: 80px;
            margin-bottom: 20px;
          }
          h1 { color: #25D366; margin: 0 0 10px 0; }
          p { color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success-icon">✅</div>
          <h1>WhatsApp Conectado!</h1>
          <p>Seu bot está ativo e funcionando.</p>
        </div>
      </body>
      </html>
    `);
  }

  if (qr) {
    // Gerar imagem do QR Code
    const QRCode = await import('qrcode');
    
    try {
      // Gerar QR Code como Data URL (base64)
      const qrImage = await QRCode.toDataURL(qr, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Retornar HTML com QR Code embutido
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Conectar WhatsApp</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 20px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              text-align: center;
              max-width: 500px;
            }
            .qr-code {
              background: white;
              padding: 20px;
              border-radius: 10px;
              display: inline-block;
              margin: 20px 0;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .qr-code img {
              display: block;
              max-width: 100%;
              height: auto;
            }
            h1 {
              color: #333;
              margin: 0 0 10px 0;
            }
            .instructions {
              color: #666;
              margin: 20px 0;
              line-height: 1.6;
            }
            .step {
              background: #f5f5f5;
              padding: 15px;
              margin: 10px 0;
              border-radius: 8px;
              text-align: left;
            }
            .step strong {
              color: #25D366;
            }
            .refresh {
              margin-top: 20px;
              padding: 10px 20px;
              background: #25D366;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 16px;
            }
            .refresh:hover {
              background: #128C7E;
            }
          </style>
          <script>
            // Auto-refresh a cada 30 segundos se não conectar
            setTimeout(() => {
              window.location.reload();
            }, 30000);
          </script>
        </head>
        <body>
          <div class="container">
            <h1>📱 Conectar WhatsApp</h1>
            <p class="instructions">Escaneie o QR Code com seu WhatsApp</p>
            
            <div class="qr-code">
              <img src="${qrImage}" alt="QR Code WhatsApp" />
            </div>
            
            <div class="step">
              <strong>1.</strong> Abra o WhatsApp no celular
            </div>
            <div class="step">
              <strong>2.</strong> Vá em Menu (⋮) → Dispositivos Vinculados
            </div>
            <div class="step">
              <strong>3.</strong> Toque em "Vincular um dispositivo"
            </div>
            <div class="step">
              <strong>4.</strong> Escaneie este QR Code
            </div>
            
            <button class="refresh" onclick="window.location.reload()">
              🔄 Recarregar QR Code
            </button>
            
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              Página recarrega automaticamente a cada 30 segundos
            </p>
          </div>
        </body>
        </html>
      `);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      return res.status(500).json({ 
        error: 'Erro ao gerar QR Code',
        message: error.message 
      });
    }
  }

  // Aguardando QR Code
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Aguardando QR Code</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          text-align: center;
        }
        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        h1 { color: #333; }
        p { color: #666; }
      </style>
      <script>
        // Recarregar a cada 5 segundos
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      </script>
    </head>
    <body>
      <div class="container">
        <div class="spinner"></div>
        <h1>Aguardando QR Code...</h1>
        <p>O WhatsApp está inicializando.</p>
        <p style="font-size: 12px; color: #999;">Recarregando automaticamente...</p>
      </div>
    </body>
    </html>
  `);
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


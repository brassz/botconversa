import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectWhatsApp } from './bot/whatsapp.js';
import { iniciarCronJobs } from './cron/scheduler.js';
import routes from './api/routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (painel HTML)
app.use(express.static(path.join(__dirname, '../public')));

// Rota raiz - redirecionar para o painel
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/painel.html'));
});

// Rotas da API
app.use('/api', routes);

// Inicialização
async function iniciarServico() {
  console.log('🚀 Iniciando Sistema de Notificações WhatsApp...\n');

  try {
    // Iniciar servidor Express PRIMEIRO (para passar no health check do Render)
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(50));
      console.log(`✅ Servidor rodando na porta ${PORT}`);
      console.log(`🎨 Painel: http://localhost:${PORT}`);
      console.log(`📊 Status: http://localhost:${PORT}/api/status`);
      console.log(`📱 QR Code: http://localhost:${PORT}/api/qr`);
      console.log('='.repeat(50) + '\n');
    });

    // Conectar ao WhatsApp de forma assíncrona (não bloqueia)
    console.log('📱 Conectando ao WhatsApp em background...');
    connectWhatsApp().catch(error => {
      console.error('❌ Erro na conexão WhatsApp:', error);
      console.log('ℹ️ O servidor continua rodando. Acesse /api/qr para conectar.');
    });

    // Iniciar cron jobs
    console.log('⏲️ Configurando agendamentos...');
    iniciarCronJobs();
    console.log('✅ Agendamentos configurados!\n');

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
  console.error('❌ Erro não tratado:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Exceção não capturada:', error);
});

// Iniciar aplicação
iniciarServico();


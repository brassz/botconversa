import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectWhatsApp } from './bot/whatsapp.js';
import { iniciarCronJobs } from './cron/scheduler.js';
import routes from './api/routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota raiz - redirect para /api
app.get('/', (req, res) => {
  res.redirect('/api');
});

// Rotas da API
app.use('/api', routes);

// Inicialização
async function iniciarBot() {
  console.log('🚀 Iniciando Bot de Cobrança WhatsApp...\n');

  try {
    // Iniciar servidor Express PRIMEIRO (para passar no health check do Render)
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(50));
      console.log(`✅ Servidor rodando na porta ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
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
iniciarBot();


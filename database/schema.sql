-- ============================================
-- BANCO DE DADOS PRINCIPAL (Sistema de Clientes)
-- URL: https://mhtxyxizfnxupwmilith.supabase.co
-- ============================================

-- Tabela de clientes
-- Esta tabela deve estar no seu sistema principal
CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  valor DECIMAL(10, 2) NOT NULL,
  data_vencimento DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'due_today', 'overdue')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_clientes_status ON clientes(status);
CREATE INDEX IF NOT EXISTS idx_clientes_vencimento ON clientes(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_clientes_telefone ON clientes(telefone);

-- Comentários nas colunas
COMMENT ON COLUMN clientes.status IS 'active: vence amanhã, due_today: vence hoje, overdue: atrasado';
COMMENT ON COLUMN clientes.telefone IS 'Formato: 5511999999999 (código do país + DDD + número)';

-- ============================================
-- BANCO DE DADOS DO BOT (Logs e Configurações)
-- URL: https://vpxdtrhqzxfllgjvrdrg.supabase.co
-- ============================================

-- Tabela de logs de mensagens enviadas
CREATE TABLE IF NOT EXISTS message_logs (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message_type VARCHAR(50) NOT NULL CHECK (message_type IN ('lembrete', 'vencimento_hoje', 'atraso')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT NOW()
);

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_logs_client ON message_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_logs_sent_at ON message_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_logs_status ON message_logs(status);
CREATE INDEX IF NOT EXISTS idx_logs_message_type ON message_logs(message_type);

-- Tabela de configurações do bot
CREATE TABLE IF NOT EXISTS bot_config (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserir configurações padrão
INSERT INTO bot_config (key, value, description) VALUES
  ('bot_status', 'active', 'Status do bot: active, paused, maintenance'),
  ('max_retries', '3', 'Número máximo de tentativas de reenvio'),
  ('delay_between_messages', '3000', 'Delay entre mensagens em ms')
ON CONFLICT (key) DO NOTHING;

-- Comentários
COMMENT ON TABLE message_logs IS 'Registro de todas as mensagens enviadas pelo bot';
COMMENT ON TABLE bot_config IS 'Configurações gerais do bot';


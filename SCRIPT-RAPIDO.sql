-- ============================================
-- 🚀 SCRIPT RÁPIDO - COPIE E COLE NO SUPABASE
-- ============================================
-- Acesse: https://vpxdtrhqzxfllgjvrdrg.supabase.co
-- Vá em: SQL Editor → Cole este script → Clique RUN
-- ============================================

-- Criar tabela de logs
CREATE TABLE IF NOT EXISTS message_logs (
  id SERIAL PRIMARY KEY,
  loan_id INTEGER,
  client_id INTEGER NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message_type VARCHAR(50) NOT NULL CHECK (message_type IN ('lembrete', 'vencimento_hoje', 'atraso')),
  message_content TEXT,
  status VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_logs_client ON message_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_logs_sent_at ON message_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_logs_status ON message_logs(status);
CREATE INDEX IF NOT EXISTS idx_logs_message_type ON message_logs(message_type);

-- ✅ PRONTO! Se executou sem erros, está tudo certo!
-- Agora acesse: http://localhost:3001 e clique na aba "Chat"


-- ============================================
-- SETUP COMPLETO: Criar tabela message_logs
-- Execute no banco BOT (vpxdtrhqzxfllgjvrdrg.supabase.co)
-- ============================================

-- 1. Criar tabela de logs (se não existir)
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

-- 2. Criar índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_logs_loan ON message_logs(loan_id);
CREATE INDEX IF NOT EXISTS idx_logs_client ON message_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_logs_sent_at ON message_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_logs_status ON message_logs(status);
CREATE INDEX IF NOT EXISTS idx_logs_message_type ON message_logs(message_type);

-- 3. Se a tabela já existir, adicionar coluna message_content (se não tiver)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'message_logs' AND column_name = 'message_content'
    ) THEN
        ALTER TABLE message_logs ADD COLUMN message_content TEXT;
    END IF;
END $$;

-- 4. Adicionar comentários para documentação
COMMENT ON TABLE message_logs IS 'Histórico de todas as mensagens enviadas pelo bot';
COMMENT ON COLUMN message_logs.message_content IS 'Conteúdo completo da mensagem enviada';

-- 5. Verificar a estrutura final
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'message_logs'
ORDER BY ordinal_position;


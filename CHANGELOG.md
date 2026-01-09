# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.0.0] - 2026-01-09

### ✨ Funcionalidades Iniciais

- ✅ Conexão WhatsApp via Baileys (API não oficial)
- ✅ Integração dupla com Supabase (clientes + logs)
- ✅ Sistema de cobrança automática baseado em status
- ✅ Cron jobs para execução programada:
  - Lembretes (1 dia antes do vencimento)
  - Notificações de vencimento hoje
  - Cobranças para clientes em atraso
- ✅ API REST completa para controle manual
- ✅ Logs detalhados de envio
- ✅ Prevenção de mensagens duplicadas
- ✅ Configuração via variáveis de ambiente
- ✅ Deploy otimizado para Render

### 📡 Endpoints da API

- `GET /api/` - Health check
- `GET /api/status` - Status da conexão WhatsApp
- `GET /api/qr` - Obter QR Code
- `POST /api/send` - Enviar mensagem individual
- `POST /api/cobrancas/processar` - Processar todas as cobranças
- `POST /api/cobrancas/lembretes` - Enviar lembretes
- `POST /api/cobrancas/vencimento-hoje` - Vencimentos de hoje
- `POST /api/cobrancas/atrasadas` - Cobranças atrasadas
- `GET /api/clientes/:status` - Listar clientes por status
- `GET /api/historico` - Histórico de mensagens

### 📝 Documentação

- README.md - Documentação completa
- QUICKSTART.md - Início rápido (5 minutos)
- DEPLOY.md - Guia detalhado de deploy
- USAGE.md - Guia de uso da API
- CHECKLIST.md - Checklist de configuração
- CREDENTIALS.txt - Template de credenciais

### 🛠️ Scripts Utilitários

- `scripts/test-bot.sh` - Testar funcionalidades
- `scripts/send-message.sh` - Enviar mensagem via CLI
- `scripts/process-charges.sh` - Processar cobranças via CLI
- `scripts/keep-alive.sh` - Manter bot ativo (Free Tier)

### 🗄️ Banco de Dados

- Schema completo para dois bancos Supabase
- Exemplos de dados para teste
- Índices otimizados para performance

### 🔧 Configurações

- Mensagens personalizáveis
- Horários configuráveis
- Delay entre mensagens
- Suporte a múltiplos ambientes

### 📦 Dependências

- @whiskeysockets/baileys ^6.7.8
- @supabase/supabase-js ^2.39.3
- @hapi/boom ^10.0.1
- express ^4.18.2
- node-cron ^3.0.3
- qrcode-terminal ^0.12.0
- pino ^8.17.2
- dotenv ^16.3.1
- cors ^2.8.5

---

## [Futuras Melhorias]

### 🚀 Em Análise

- [ ] Autenticação da API (API Key)
- [ ] Rate limiting
- [ ] Dashboard web
- [ ] Respostas automáticas
- [ ] Suporte a mídia (imagens, PDFs)
- [ ] Relatórios de cobrança
- [ ] Notificações por email
- [ ] Webhook para eventos
- [ ] Multi-atendentes
- [ ] Backup automático da sessão

### 🐛 Bugs Conhecidos

Nenhum bug crítico conhecido até o momento.

---

## Como Contribuir

Se você encontrar bugs ou tiver sugestões:
1. Documente o problema/sugestão
2. Teste em ambiente de desenvolvimento
3. Envie suas alterações

## Formato de Versão

Este projeto segue [Semantic Versioning](https://semver.org/):
- MAJOR.MINOR.PATCH
- MAJOR: mudanças incompatíveis na API
- MINOR: novas funcionalidades compatíveis
- PATCH: correções de bugs


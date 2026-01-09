# ✅ Checklist de Deploy e Configuração

## 📋 Antes do Deploy

### 1. Preparação Local
- [ ] Node.js 18+ instalado
- [ ] Git instalado e configurado
- [ ] Repositório criado no GitHub
- [ ] Código commitado e enviado

### 2. Supabase - Banco Principal (Clientes)
- [ ] Acesso ao painel: https://mhtxyxizfnxupwmilith.supabase.co
- [ ] SQL Editor acessível
- [ ] Script `database/schema.sql` (parte 1) executado
- [ ] Tabela `clientes` criada com sucesso
- [ ] Índices criados
- [ ] Dados de teste inseridos (opcional - `database/exemplo_clientes.sql`)

### 3. Supabase - Banco do Bot (Logs)
- [ ] Acesso ao painel: https://vpxdtrhqzxfllgjvrdrg.supabase.co
- [ ] SQL Editor acessível
- [ ] Script `database/schema.sql` (parte 2) executado
- [ ] Tabela `message_logs` criada
- [ ] Tabela `bot_config` criada
- [ ] Índices criados
- [ ] Configurações padrão inseridas

## 🚀 Deploy no Render

### 1. Conta e Projeto
- [ ] Conta criada em https://render.com
- [ ] GitHub conectado ao Render
- [ ] Repositório selecionado

### 2. Configuração do Serviço
- [ ] Name: `bot-cobranca-whatsapp`
- [ ] Environment: `Node`
- [ ] Branch: `main`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Instance Type selecionado (Free ou Starter)

### 3. Variáveis de Ambiente
- [ ] `SUPABASE_URL` configurada
- [ ] `SUPABASE_KEY` configurada
- [ ] `BOT_SUPABASE_URL` configurada
- [ ] `BOT_SUPABASE_KEY` configurada
- [ ] `NODE_ENV=production` configurada
- [ ] `PORT=3000` configurada
- [ ] `HORA_ENVIO_LEMBRETES` configurada (padrão: 09:00)
- [ ] `HORA_ENVIO_VENCIMENTO` configurada (padrão: 09:00)
- [ ] `HORA_ENVIO_ATRASO` configurada (padrão: 10:00)

### 4. Deploy
- [ ] Deploy iniciado
- [ ] Build concluído com sucesso
- [ ] Serviço rodando (status: Live)
- [ ] Logs acessíveis e sem erros críticos

## 📱 Conexão WhatsApp

### 1. QR Code
- [ ] Acessar: `https://seu-app.onrender.com/api/qr`
- [ ] QR Code exibido na tela
- [ ] WhatsApp aberto no celular
- [ ] Menu > Dispositivos Vinculados acessado
- [ ] QR Code escaneado com sucesso

### 2. Verificação
- [ ] Acessar: `https://seu-app.onrender.com/api/status`
- [ ] Resposta mostra `"connected": true`
- [ ] Logs no Render mostram "✅ Conectado ao WhatsApp!"

## 🧪 Testes

### 1. API Básica
```bash
# Health check
curl https://seu-app.onrender.com/api/
```
- [ ] Retorna status 200
- [ ] JSON com informações do bot

### 2. Status da Conexão
```bash
curl https://seu-app.onrender.com/api/status
```
- [ ] `connected: true`
- [ ] `hasQR: false`

### 3. Listar Clientes
```bash
curl https://seu-app.onrender.com/api/clientes/all
```
- [ ] Retorna lista de clientes
- [ ] Dados correspondem ao banco

### 4. Envio de Teste
```bash
curl -X POST https://seu-app.onrender.com/api/send \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "SEU_NUMERO_COMPLETO",
    "message": "🤖 Teste do bot de cobrança!"
  }'
```
- [ ] Retorna `success: true`
- [ ] Mensagem recebida no WhatsApp
- [ ] Tempo de entrega < 5 segundos

### 5. Histórico
```bash
curl https://seu-app.onrender.com/api/historico?limit=10
```
- [ ] Retorna histórico de mensagens
- [ ] Mensagem de teste aparece na lista

### 6. Teste de Cobrança (se tiver dados)
```bash
curl -X POST https://seu-app.onrender.com/api/cobrancas/processar
```
- [ ] Processa sem erros
- [ ] Mensagens enviadas conforme status
- [ ] Logs registrados corretamente

## ⏰ Cron Jobs

### 1. Verificação nos Logs
- [ ] Acessar logs do Render
- [ ] Mensagem "⏲️ Configurando agendamentos..." visível
- [ ] 3 agendamentos configurados:
  - [ ] Lembretes (09:00)
  - [ ] Vencimento hoje (09:00)
  - [ ] Cobranças atrasadas (10:00)

### 2. Teste de Execução
- [ ] Aguardar até horário programado OU
- [ ] Usar endpoint manual: `/api/cobrancas/lembretes`
- [ ] Verificar logs de execução
- [ ] Confirmar mensagens enviadas

## 📊 Monitoramento

### 1. Render Dashboard
- [ ] Painel de métricas acessível
- [ ] CPU e memória em níveis normais
- [ ] Sem crashes ou restarts inesperados

### 2. Logs
- [ ] Logs em tempo real funcionando
- [ ] Sem erros críticos
- [ ] Mensagens de sucesso visíveis

### 3. Uptime (Opcional - Plano Free)
- [ ] Configurar UptimeRobot ou similar
- [ ] Ping a cada 10 minutos
- [ ] URL: `https://seu-app.onrender.com/api/`
- [ ] Alertas configurados

## 🔒 Segurança

### 1. Variáveis de Ambiente
- [ ] Nenhuma chave commitada no GitHub
- [ ] `.env` no `.gitignore`
- [ ] Variáveis apenas no painel do Render

### 2. Backup
- [ ] Documentação salva localmente
- [ ] URLs e chaves anotadas em local seguro
- [ ] Instruções de recuperação preparadas

## 📱 Integração com Seu Sistema

### 1. Webhook/API
- [ ] Endpoint do bot documentado
- [ ] Sistema principal pode chamar API do bot
- [ ] Autenticação configurada (se implementada)

### 2. Atualização de Status
- [ ] Sistema atualiza status dos clientes automaticamente
- [ ] Lógica de `active` / `due_today` / `overdue` implementada
- [ ] Testes de integração realizados

## 🎯 Pós-Deploy

### 1. Primeira Execução
- [ ] Aguardar primeira execução automática
- [ ] Verificar mensagens enviadas
- [ ] Confirmar recebimento pelos clientes
- [ ] Checar logs de sucesso/erro

### 2. Ajustes
- [ ] Mensagens estão adequadas?
- [ ] Horários estão corretos?
- [ ] Necessário ajustar algo?

### 3. Documentação
- [ ] Equipe treinada no uso da API
- [ ] Endpoints documentados internamente
- [ ] Procedimentos de emergência definidos

## ✨ Otimizações (Opcional)

### 1. Performance
- [ ] Considerar upgrade para Starter ($7/mês)
- [ ] Configurar CDN se necessário
- [ ] Otimizar queries do Supabase

### 2. Features Adicionais
- [ ] Implementar autenticação na API
- [ ] Adicionar rate limiting
- [ ] Criar dashboard web
- [ ] Implementar respostas automáticas
- [ ] Adicionar suporte a mídia (imagens, PDFs)

### 3. Backup e Recuperação
- [ ] Backup da sessão WhatsApp
- [ ] Procedimento de reautenticação
- [ ] Plano B se Render cair

## 🆘 Troubleshooting

### Problemas Comuns Resolvidos?
- [ ] WhatsApp desconectando: Reescanear QR
- [ ] Mensagens não enviando: Verificar formato telefone
- [ ] Cron não executando: Verificar timezone
- [ ] Deploy falhando: Verificar logs de build
- [ ] Erros no Supabase: Verificar permissões

## 🎉 Sistema em Produção!

Quando todos os checkboxes estiverem marcados:
- ✅ Sistema configurado corretamente
- ✅ WhatsApp conectado e funcionando
- ✅ Cobranças automáticas ativas
- ✅ Monitoramento em funcionamento
- ✅ Equipe treinada

**Parabéns! Seu bot de cobrança está operacional! 🚀**

---

## 📞 Links Importantes

- **Render Dashboard**: https://dashboard.render.com
- **Seu Aplicativo**: https://seu-app.onrender.com
- **API Status**: https://seu-app.onrender.com/api/status
- **QR Code**: https://seu-app.onrender.com/api/qr
- **Supabase Main**: https://mhtxyxizfnxupwmilith.supabase.co
- **Supabase Bot**: https://vpxdtrhqzxfllgjvrdrg.supabase.co

## 📚 Documentação

- `README.md` - Visão geral e instalação
- `DEPLOY.md` - Guia completo de deploy
- `USAGE.md` - Como usar a API
- `CHECKLIST.md` - Este arquivo

---

**Data do Deploy**: ___/___/______
**Responsável**: _________________
**URL do Serviço**: _______________


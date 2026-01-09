# 🚀 Guia de Deploy no Render

## Passo a Passo Completo

### 1️⃣ Preparar o Código

```bash
# Inicializar git (se ainda não fez)
git init
git add .
git commit -m "Initial commit - Bot de cobrança WhatsApp"

# Criar repositório no GitHub
# Depois push:
git remote add origin https://github.com/seu-usuario/seu-repo.git
git branch -M main
git push -u origin main
```

### 2️⃣ Configurar Supabase

#### Banco Principal (Clientes)

1. Acesse: https://mhtxyxizfnxupwmilith.supabase.co
2. Vá em SQL Editor
3. Execute o primeiro bloco do `database/schema.sql`
4. Verifique se a tabela `clientes` foi criada

#### Banco do Bot (Logs)

1. Acesse: https://vpxdtrhqzxfllgjvrdrg.supabase.co
2. Vá em SQL Editor
3. Execute o segundo bloco do `database/schema.sql`
4. Verifique se as tabelas `message_logs` e `bot_config` foram criadas

### 3️⃣ Deploy no Render

1. **Criar conta no Render**
   - Acesse: https://render.com
   - Cadastre-se ou faça login

2. **Criar novo Web Service**
   - Clique em "New +"
   - Selecione "Web Service"
   - Conecte seu GitHub
   - Selecione o repositório

3. **Configurar o serviço**
   ```
   Name: bot-cobranca-whatsapp
   Environment: Node
   Region: Oregon (US West) ou São Paulo
   Branch: main
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free (ou Starter para melhor performance)
   ```

4. **Adicionar variáveis de ambiente**

   Clique em "Advanced" > "Add Environment Variable":

   ```
   SUPABASE_URL = https://mhtxyxizfnxupwmilith.supabase.co
   SUPABASE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1odHh5eGl6Zm54dXB3bWlsaXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzIzMDYsImV4cCI6MjA3MTcwODMwNn0.s1Y9kk2Va5EMcwAEGQmhTxo70Zv0o9oR6vrJixwEkWI
   
   BOT_SUPABASE_URL = https://vpxdtrhqzxfllgjvrdrg.supabase.co
   BOT_SUPABASE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweGR0cmhxenhmbGxnanZyZHJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5ODg1MjIsImV4cCI6MjA4MzU2NDUyMn0.VZQ5ESbA3d7U7oJmioXTF7suoJUPLLvZUzZqXPfMYMQ
   
   NODE_ENV = production
   PORT = 3000
   HORA_ENVIO_LEMBRETES = 09:00
   HORA_ENVIO_VENCIMENTO = 09:00
   HORA_ENVIO_ATRASO = 10:00
   ```

5. **Criar o serviço**
   - Clique em "Create Web Service"
   - Aguarde o deploy (3-5 minutos)

### 4️⃣ Conectar o WhatsApp

1. **Acesse o QR Code**
   ```
   https://seu-app.onrender.com/api/qr
   ```

2. **Escaneie com WhatsApp**
   - Abra o WhatsApp no celular
   - Vá em ⋮ (três pontos) > Dispositivos Vinculados
   - Toque em "Vincular um dispositivo"
   - Escaneie o QR Code da tela

3. **Verifique a conexão**
   ```
   https://seu-app.onrender.com/api/status
   ```
   
   Deve retornar: `"connected": true`

### 5️⃣ Testar o Sistema

#### Teste 1: Status do Bot
```bash
curl https://seu-app.onrender.com/api/
```

#### Teste 2: Enviar mensagem de teste
```bash
curl -X POST https://seu-app.onrender.com/api/send \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5511999999999",
    "message": "Teste do bot de cobrança!"
  }'
```

#### Teste 3: Verificar clientes
```bash
curl https://seu-app.onrender.com/api/clientes/all
```

#### Teste 4: Processar cobranças manualmente
```bash
curl -X POST https://seu-app.onrender.com/api/cobrancas/processar
```

### 6️⃣ Monitoramento

1. **Logs em tempo real**
   - No painel do Render, clique em "Logs"
   - Acompanhe a execução do bot

2. **Verificar histórico de mensagens**
   ```bash
   curl https://seu-app.onrender.com/api/historico
   ```

3. **Configurar alertas (opcional)**
   - Render Dashboard > Settings > Notifications
   - Configure para receber notificações de erros

### 7️⃣ Manutenção

#### Atualizar o bot
```bash
git add .
git commit -m "Atualização do bot"
git push origin main
```
O Render fará deploy automático!

#### Reescanear QR Code
Se o WhatsApp desconectar:
1. Acesse `/api/qr`
2. Escaneie novamente
3. Verifique `/api/status`

#### Reiniciar o serviço
- No painel do Render: Manual Deploy > Deploy latest commit

### 8️⃣ Dicas de Performance

#### Para plano Free
- O serviço inativa após 15min sem requests
- Configure um uptime monitor (UptimeRobot, Pingdom)
- Crie um cron job para ping a cada 10min

#### Exemplo de cron externo
Use cron-job.org para fazer ping:
```
URL: https://seu-app.onrender.com/api/
Frequência: A cada 10 minutos
```

#### Para plano Starter ($7/mês)
- Serviço fica ativo 24/7
- Melhor performance
- SSL automático
- Mais recursos

### 9️⃣ Checklist Final

- [ ] Código no GitHub
- [ ] Tabelas criadas no Supabase (ambos bancos)
- [ ] Deploy realizado no Render
- [ ] Variáveis de ambiente configuradas
- [ ] WhatsApp conectado (QR Code escaneado)
- [ ] Status retorna `connected: true`
- [ ] Teste de envio funcionando
- [ ] Cron jobs agendados corretamente
- [ ] Logs monitorados

### 🎉 Pronto!

Seu bot está no ar e funcionando 24/7!

**URLs importantes:**
- Dashboard: https://dashboard.render.com
- API Status: https://seu-app.onrender.com/api/status
- QR Code: https://seu-app.onrender.com/api/qr
- Logs: https://dashboard.render.com/web/[seu-service-id]/logs

---

## 🆘 Problemas Comuns

### Deploy falha
- Verifique o Node.js version no package.json
- Confira os logs de build no Render

### WhatsApp não conecta
- Aguarde 1-2 minutos após deploy
- Tente reescanear o QR Code
- Verifique se a pasta auth_info tem permissões

### Variáveis de ambiente não funcionam
- Verifique se todas foram adicionadas
- Confirme que não tem espaços extras
- Redeploy após adicionar variáveis

### Tabelas não encontradas
- Execute os scripts SQL corretos em cada banco
- Verifique as URLs do Supabase
- Teste conexão no painel do Supabase


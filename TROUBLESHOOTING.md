# 🔧 Troubleshooting - Soluções para Problemas Comuns

## 🚨 Problemas de Conexão WhatsApp

### ❌ QR Code não aparece

**Sintomas:**
- Endpoint `/api/qr` retorna vazio
- Logs não mostram QR Code

**Soluções:**

1. **Verificar logs do Render:**
   ```bash
   # Acesse: Dashboard > Logs
   # Procure por erros relacionados ao Baileys
   ```

2. **Limpar sessão antiga:**
   - Deletar pasta `auth_info` (se tiver acesso ao servidor)
   - Fazer redeploy no Render

3. **Aguardar inicialização:**
   - O bot pode levar 30-60 segundos para gerar QR
   - Espere e recarregue `/api/qr`

4. **Verificar dependências:**
   ```bash
   npm install @whiskeysockets/baileys@latest
   ```

### ❌ WhatsApp conectado mas desconecta rapidamente

**Sintomas:**
- Conecta e desconecta em loop
- Mensagem: "Connection closed"

**Soluções:**

1. **Verificar rede:**
   - Render pode ter problemas de rede temporários
   - Aguarde 5 minutos e verifique novamente

2. **Reautenticar:**
   - Delete a pasta `auth_info`
   - Gere novo QR Code
   - Escaneie novamente

3. **Verificar se WhatsApp não está vinculado em outro lugar:**
   - Abra WhatsApp > Dispositivos Vinculados
   - Remova dispositivos antigos
   - Vincule novamente

4. **Atualizar Baileys:**
   ```bash
   npm update @whiskeysockets/baileys
   ```

### ❌ "WhatsApp logged out"

**Sintomas:**
- Bot para de funcionar
- Status retorna `connected: false`
- Erro: "DisconnectReason.loggedOut"

**Soluções:**

1. **Escanear novo QR Code:**
   - Acesse `/api/qr`
   - Escaneie com WhatsApp
   - Bot reconectará automaticamente

2. **Verificar se WhatsApp não foi desvinculado:**
   - No celular: WhatsApp > Dispositivos Vinculados
   - Verifique se o bot ainda está lá

## 📨 Problemas de Envio de Mensagens

### ❌ Mensagens não são enviadas

**Sintomas:**
- API retorna sucesso mas mensagem não chega
- Histórico mostra `status: 'failed'`

**Soluções:**

1. **Verificar formato do telefone:**
   ```javascript
   // ✅ Correto
   "5511999999999"
   
   // ❌ Incorreto
   "11999999999"
   "+55 11 99999-9999"
   "(11) 9 9999-9999"
   ```

2. **Verificar se número está no WhatsApp:**
   - Tente enviar mensagem manualmente primeiro
   - Confirme que o número existe e está ativo

3. **Verificar conexão:**
   ```bash
   curl https://seu-app.onrender.com/api/status
   # Deve retornar: "connected": true
   ```

4. **Verificar rate limiting:**
   - WhatsApp pode bloquear muitos envios rápidos
   - Aguarde 1 hora e tente novamente
   - Reduza a quantidade de mensagens

5. **Testar com seu próprio número:**
   ```bash
   curl -X POST https://seu-app.onrender.com/api/send \
     -H "Content-Type: application/json" \
     -d '{"phone": "SEU_NUMERO", "message": "teste"}'
   ```

### ❌ Mensagens duplicadas

**Sintomas:**
- Clientes recebem mesma mensagem múltiplas vezes
- Histórico mostra múltiplos envios

**Soluções:**

1. **Verificar lógica de envio:**
   - Bot verifica automaticamente se já enviou hoje
   - Verifique tabela `message_logs` no Supabase

2. **Não executar cron manualmente no horário automático:**
   - Evite chamar `/api/cobrancas/processar` no horário do cron

3. **Verificar se há múltiplas instâncias rodando:**
   - Deve haver apenas 1 serviço no Render
   - Verifique se não tem bot rodando localmente também

### ❌ Erro "Too many requests"

**Sintomas:**
- Mensagens param de ser enviadas
- Erro 429 ou similar

**Soluções:**

1. **Reduzir frequência:**
   - Delay entre mensagens já está em 3s
   - Aumente se necessário em `src/services/cobrancaService.js`

2. **Enviar em lotes menores:**
   - Em vez de processar tudo de uma vez
   - Processe por status separadamente

3. **Aguardar:**
   - WhatsApp pode ter rate limit temporário
   - Espere 1-2 horas

## 🗄️ Problemas com Supabase

### ❌ Erro "relation does not exist"

**Sintomas:**
- Erro: "relation 'clientes' does not exist"
- Erro: "relation 'message_logs' does not exist"

**Soluções:**

1. **Executar schema SQL:**
   - Acesse Supabase SQL Editor
   - Execute `database/schema.sql`
   - Verifique se tabelas foram criadas

2. **Verificar banco correto:**
   - `clientes` deve estar no banco PRINCIPAL
   - `message_logs` deve estar no banco do BOT
   - Não confundir as URLs

3. **Verificar permissões:**
   - Use a chave ANON (não service_role)
   - Verifique RLS (Row Level Security) no Supabase

### ❌ Erro "permission denied"

**Sintomas:**
- Erro ao buscar ou inserir dados
- Status 401 ou 403

**Soluções:**

1. **Verificar chave da API:**
   ```bash
   # Verifique se as chaves estão corretas no Render
   # Environment Variables
   ```

2. **Desabilitar RLS temporariamente:**
   ```sql
   -- No Supabase SQL Editor
   ALTER TABLE clientes DISABLE ROW LEVEL SECURITY;
   ALTER TABLE message_logs DISABLE ROW LEVEL SECURITY;
   ```

3. **Configurar políticas RLS:**
   ```sql
   -- Permitir acesso com chave anon
   CREATE POLICY "Enable all for anon" ON clientes
   FOR ALL USING (true);
   
   CREATE POLICY "Enable all for anon" ON message_logs
   FOR ALL USING (true);
   ```

### ❌ Dados não aparecem

**Sintomas:**
- `/api/clientes/all` retorna vazio
- Mas dados existem no Supabase

**Soluções:**

1. **Verificar status dos clientes:**
   ```sql
   SELECT id, nome, status FROM clientes;
   ```
   - Bot busca por status: 'active', 'due_today', 'overdue'
   - Verifique se os status estão corretos

2. **Verificar conexão:**
   ```bash
   # Testar no Supabase API
   curl https://mhtxyxizfnxupwmilith.supabase.co/rest/v1/clientes \
     -H "apikey: SUA_CHAVE" \
     -H "Authorization: Bearer SUA_CHAVE"
   ```

## 🚀 Problemas no Render

### ❌ Deploy falha

**Sintomas:**
- Build failed
- Deploy não completa

**Soluções:**

1. **Verificar logs de build:**
   - No Render: Events > Build Logs
   - Procure por erros de npm

2. **Verificar package.json:**
   ```json
   {
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

3. **Limpar cache:**
   - Render Dashboard > Settings
   - Clear build cache & deploy

4. **Verificar dependências:**
   ```bash
   # Localmente
   npm install
   npm start
   # Se funcionar local, deve funcionar no Render
   ```

### ❌ Serviço inativo (Free Tier)

**Sintomas:**
- Bot para após 15 min sem uso
- Primeiro request é lento

**Soluções:**

1. **Usar keep-alive:**
   ```bash
   # Localmente ou em outro servidor
   ./scripts/keep-alive.sh https://seu-app.onrender.com
   ```

2. **Configurar monitor externo:**
   - UptimeRobot: https://uptimerobot.com
   - Pingdom
   - Cron-job.org

3. **Upgrade para Starter ($7/mês):**
   - Serviço fica ativo 24/7
   - Melhor performance

### ❌ Variáveis de ambiente não funcionam

**Sintomas:**
- Bot não conecta Supabase
- Erro: "undefined is not valid URL"

**Soluções:**

1. **Verificar variáveis no Render:**
   - Dashboard > Environment
   - Confirme que todas foram adicionadas
   - Não deve ter espaços extras

2. **Redeploy após adicionar variáveis:**
   - Variáveis só são aplicadas após deploy
   - Manual Deploy > Deploy latest commit

3. **Verificar nomes:**
   ```
   SUPABASE_URL         (não SUPABASE-URL)
   SUPABASE_KEY         (não SUPABASE_SECRET)
   BOT_SUPABASE_URL     (exatamente assim)
   BOT_SUPABASE_KEY     (exatamente assim)
   ```

## ⏰ Problemas com Cron Jobs

### ❌ Mensagens não são enviadas automaticamente

**Sintomas:**
- Horário passa mas nada acontece
- Manual funciona, automático não

**Soluções:**

1. **Verificar timezone:**
   - Render usa UTC por padrão
   - Ajuste horários conforme necessário:
   ```
   # Se você quer 09:00 BRT (UTC-3)
   HORA_ENVIO_LEMBRETES=12:00  # 09:00 + 3h
   ```

2. **Verificar logs no horário:**
   - Acesse logs exatamente no horário programado
   - Procure por mensagens de execução do cron

3. **Testar manualmente:**
   ```bash
   # Se manual funcionar, cron está configurado
   curl -X POST https://seu-app.onrender.com/api/cobrancas/lembretes
   ```

4. **Verificar formato do horário:**
   ```
   ✅ 09:00
   ❌ 9:00
   ❌ 09h00
   ❌ 9:0
   ```

### ❌ Cron executa mas não envia

**Sintomas:**
- Logs mostram execução
- Mas nenhuma mensagem enviada

**Soluções:**

1. **Verificar se há clientes no status correto:**
   ```bash
   curl https://seu-app.onrender.com/api/clientes/active
   # Deve retornar clientes
   ```

2. **Verificar se já foi enviado hoje:**
   - Bot não reenvia se já enviou hoje
   - Verifique: `/api/historico`

3. **Verificar conexão WhatsApp no momento:**
   - WhatsApp deve estar conectado na hora do cron
   - Se desconectar, cron não enviará

## 🔍 Debugging Avançado

### Ver logs detalhados

No `src/index.js`, altere o nível de log:

```javascript
const logger = pino({ level: 'debug' }); // em vez de 'silent'
```

### Testar conexão Supabase

```javascript
// Criar arquivo test-supabase.js
import { supabaseMain } from './src/config/supabase.js';

const { data, error } = await supabaseMain
  .from('clientes')
  .select('*')
  .limit(1);

console.log('Data:', data);
console.log('Error:', error);
```

```bash
node test-supabase.js
```

### Testar envio de mensagem

```bash
# Ver exatamente o que está sendo enviado
curl -v -X POST https://seu-app.onrender.com/api/send \
  -H "Content-Type: application/json" \
  -d '{"phone": "5511999999999", "message": "teste"}'
```

## 📞 Últimos Recursos

Se nada funcionar:

1. **Redeploy completo:**
   ```bash
   git add .
   git commit -m "fix: redeploy"
   git push
   ```

2. **Recriar serviço no Render:**
   - Delete o serviço atual
   - Crie novamente do zero
   - Reconecte WhatsApp

3. **Verificar status do WhatsApp:**
   - https://downdetector.com.br/fora-do-ar/whatsapp/

4. **Verificar status do Render:**
   - https://status.render.com/

5. **Testar localmente:**
   ```bash
   npm install
   npm start
   # Se funcionar local, problema é no deploy
   ```

## 📚 Recursos Úteis

- Baileys Issues: https://github.com/WhiskeySockets/Baileys/issues
- Render Docs: https://render.com/docs
- Supabase Docs: https://supabase.com/docs
- Node-cron: https://www.npmjs.com/package/node-cron

---

**Ainda com problemas?**

1. Verifique todos os itens do `CHECKLIST.md`
2. Revise o `README.md` e `DEPLOY.md`
3. Analise os logs do Render detalhadamente
4. Teste cada endpoint individualmente


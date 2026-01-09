# 📖 Guia de Uso - Bot de Cobrança WhatsApp

## 🎯 Visão Geral

Este bot monitora automaticamente seus clientes no Supabase e envia mensagens de cobrança via WhatsApp baseado no status de pagamento.

## 🔄 Fluxo Automático

### 1. Status dos Clientes

Os clientes devem ter um dos seguintes status na tabela `clientes`:

| Status | Significado | Ação do Bot |
|--------|-------------|-------------|
| `active` | Vence amanhã | Envia lembrete às 09:00 |
| `due_today` | Vence hoje | Envia notificação às 09:00 |
| `overdue` | Atrasado | Envia cobrança às 10:00 |

### 2. Atualização dos Status

**Seu sistema deve atualizar os status automaticamente:**

```sql
-- Exemplo de query para atualizar status diariamente
UPDATE clientes SET status = 'overdue' 
WHERE data_vencimento < CURRENT_DATE AND status != 'overdue';

UPDATE clientes SET status = 'due_today' 
WHERE data_vencimento = CURRENT_DATE AND status != 'due_today';

UPDATE clientes SET status = 'active' 
WHERE data_vencimento = CURRENT_DATE + INTERVAL '1 day' AND status != 'active';
```

Você pode criar um cron job no Supabase ou no seu sistema para isso.

## 📱 Formato do Telefone

**Obrigatório:** Use o formato internacional completo sem símbolos:

✅ Correto:
```
5511999999999
5521988888888
5581977777777
```

❌ Incorreto:
```
11999999999
+55 11 99999-9999
(11) 9 9999-9999
```

## 🚀 Uso via API

### Enviar Mensagem Individual

```bash
curl -X POST https://seu-app.onrender.com/api/send \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5511999999999",
    "message": "Olá! Este é um teste."
  }'
```

### Processar Todas as Cobranças

```bash
# Envia lembretes, vencimentos e cobranças
curl -X POST https://seu-app.onrender.com/api/cobrancas/processar
```

### Enviar Apenas um Tipo

```bash
# Apenas lembretes (status='active')
curl -X POST https://seu-app.onrender.com/api/cobrancas/lembretes

# Apenas vencimento hoje (status='due_today')
curl -X POST https://seu-app.onrender.com/api/cobrancas/vencimento-hoje

# Apenas atrasados (status='overdue')
curl -X POST https://seu-app.onrender.com/api/cobrancas/atrasadas
```

## 🔍 Consultas

### Ver Clientes por Status

```bash
# Todos os clientes atrasados
curl https://seu-app.onrender.com/api/clientes/overdue

# Todos que vencem hoje
curl https://seu-app.onrender.com/api/clientes/due_today

# Todos ativos (vencem amanhã)
curl https://seu-app.onrender.com/api/clientes/active

# Todos os clientes
curl https://seu-app.onrender.com/api/clientes/all
```

### Ver Histórico de Mensagens

```bash
# Últimas 50 mensagens
curl https://seu-app.onrender.com/api/historico

# Últimas 100 mensagens
curl https://seu-app.onrender.com/api/historico?limit=100

# Mensagens de um cliente específico
curl https://seu-app.onrender.com/api/historico?client_id=123
```

### Verificar Status do Bot

```bash
# Health check
curl https://seu-app.onrender.com/api/

# Status da conexão WhatsApp
curl https://seu-app.onrender.com/api/status

# Obter QR Code (se não estiver conectado)
curl https://seu-app.onrender.com/api/qr
```

## 🔗 Integração com Seu Sistema

### Webhook para Notificações

Você pode chamar a API do bot quando um evento acontecer no seu sistema:

```javascript
// Exemplo: Quando um pagamento é confirmado
async function aoPagarMensalidade(clienteId) {
  // 1. Atualizar status no banco
  await supabase
    .from('clientes')
    .update({ 
      status: 'active',
      data_vencimento: proximoMes() 
    })
    .eq('id', clienteId);

  // 2. Enviar confirmação via WhatsApp (opcional)
  await fetch('https://seu-app.onrender.com/api/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: cliente.telefone,
      message: `Pagamento confirmado! Obrigado ${cliente.nome}! ✅`
    })
  });
}
```

### Endpoint no Seu Sistema

```javascript
// Exemplo de endpoint que aciona cobrança manual
app.post('/api/enviar-cobrancas', async (req, res) => {
  const response = await fetch(
    'https://seu-bot.onrender.com/api/cobrancas/processar',
    { method: 'POST' }
  );
  
  const result = await response.json();
  res.json(result);
});
```

## ⚙️ Personalização

### Alterar Horários de Envio

Edite as variáveis de ambiente no Render:

```
HORA_ENVIO_LEMBRETES=08:00
HORA_ENVIO_VENCIMENTO=10:00
HORA_ENVIO_ATRASO=14:00
```

### Customizar Mensagens

Edite `src/config/constants.js`:

```javascript
export const MENSAGENS = {
  LEMBRETE: (nome, valor, dataVencimento) => 
    `Olá ${nome}! Sua mensalidade de R$ ${valor} vence em ${dataVencimento}.`,
  
  VENCIMENTO_HOJE: (nome, valor, dataVencimento) =>
    `${nome}, sua mensalidade vence HOJE! Valor: R$ ${valor}`,
  
  ATRASO: (nome, valor, dataVencimento, diasAtraso) =>
    `${nome}, sua mensalidade está ${diasAtraso} dia(s) em atraso!`
};
```

Após alterar, faça commit e push. O Render fará deploy automático.

## 📊 Monitoramento

### Dashboard Simples

Crie uma página HTML para monitorar:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Dashboard - Bot Cobrança</title>
</head>
<body>
  <h1>Status do Bot</h1>
  <div id="status"></div>
  
  <h2>Últimas Mensagens</h2>
  <div id="historico"></div>

  <script>
    async function atualizar() {
      // Status
      const status = await fetch('https://seu-bot.onrender.com/api/status').then(r => r.json());
      document.getElementById('status').innerHTML = 
        `Conectado: ${status.connected ? '✅' : '❌'}`;

      // Histórico
      const hist = await fetch('https://seu-bot.onrender.com/api/historico?limit=10').then(r => r.json());
      document.getElementById('historico').innerHTML = hist.historico
        .map(m => `<p>${m.client_name} - ${m.message_type} - ${m.status}</p>`)
        .join('');
    }

    atualizar();
    setInterval(atualizar, 30000); // Atualiza a cada 30s
  </script>
</body>
</html>
```

### Logs em Tempo Real

No painel do Render:
1. Acesse seu serviço
2. Clique em "Logs"
3. Acompanhe em tempo real

### Alertas

Configure notificações no Render:
1. Settings > Notifications
2. Adicione email ou webhook
3. Receba alertas de erros

## 🛡️ Boas Práticas

### 1. Evitar Bloqueios do WhatsApp

- ✅ Delay de 3 segundos entre mensagens (já implementado)
- ✅ Não enviar mais de 100 mensagens por hora
- ✅ Verificar se já enviou hoje antes de reenviar
- ❌ Não enviar mensagens em massa para números novos

### 2. Gerenciar Desconexões

O bot reconecta automaticamente, mas:
- Verifique `/api/status` regularmente
- Configure um cron externo para ping (UptimeRobot)
- Mantenha o QR Code de backup

### 3. Backup da Sessão

A pasta `auth_info` contém a sessão do WhatsApp:
- Render pode perder isso ao redeploy
- Considere fazer backup manualmente
- Ou usar volume persistente (planos pagos)

### 4. Rate Limiting

Para produção, considere adicionar rate limiting:

```javascript
// Exemplo com express-rate-limit
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // 100 requests por IP
});

app.use('/api/', limiter);
```

## 🔐 Segurança

### Proteger Endpoints

Adicione autenticação para produção:

```javascript
// Middleware simples de auth
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  next();
};

// Proteger rotas sensíveis
app.post('/api/send', authMiddleware, async (req, res) => {
  // ...
});
```

Configure no Render:
```
API_KEY=sua-chave-secreta-aqui
```

Uso:
```bash
curl -X POST https://seu-app.onrender.com/api/send \
  -H "X-API-Key: sua-chave-secreta-aqui" \
  -H "Content-Type: application/json" \
  -d '{"phone": "5511999999999", "message": "Teste"}'
```

## 📞 Suporte Técnico

### Verificar Problemas

1. **Bot não envia mensagens:**
   ```bash
   # Verificar conexão
   curl https://seu-app.onrender.com/api/status
   
   # Verificar clientes
   curl https://seu-app.onrender.com/api/clientes/all
   
   # Testar envio manual
   curl -X POST https://seu-app.onrender.com/api/send \
     -H "Content-Type: application/json" \
     -d '{"phone": "SEU_NUMERO", "message": "teste"}'
   ```

2. **Mensagens duplicadas:**
   - O bot verifica automaticamente se já enviou hoje
   - Verifique os logs: `curl https://seu-app.onrender.com/api/historico?client_id=123`

3. **Números não recebem:**
   - Confirme o formato: `5511999999999`
   - Verifique se o número está no WhatsApp
   - Teste com seu próprio número primeiro

## 🎓 Exemplos Práticos

### Script Python para Integração

```python
import requests

BOT_URL = "https://seu-bot.onrender.com/api"

def enviar_cobranca_manual(telefone, nome, valor):
    mensagem = f"Olá {nome}! Sua mensalidade de R$ {valor} está disponível."
    
    response = requests.post(f"{BOT_URL}/send", json={
        "phone": telefone,
        "message": mensagem
    })
    
    return response.json()

# Uso
resultado = enviar_cobranca_manual("5511999999999", "João", "99.90")
print(resultado)
```

### Cron Job para Manter Ativo (Bash)

```bash
#!/bin/bash
# Arquivo: keep-alive.sh

while true; do
  curl -s https://seu-bot.onrender.com/api/ > /dev/null
  echo "$(date): Ping enviado"
  sleep 600  # 10 minutos
done
```

Execute em background:
```bash
nohup ./keep-alive.sh &
```

## 🎉 Conclusão

Com este guia você pode:
- ✅ Integrar o bot no seu sistema
- ✅ Personalizar mensagens e horários
- ✅ Monitorar envios e status
- ✅ Resolver problemas comuns

Dúvidas? Verifique o README.md e DEPLOY.md!


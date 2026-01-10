# 🚀 Guia de Integração - Sistema de Notificações WhatsApp

## ✅ Status Atual
- ✅ WhatsApp conectado
- ✅ Servidor rodando em `http://localhost:3001`
- ✅ Pronto para enviar cobranças

---

## 📋 Endpoints Disponíveis

### 1. **Status da Conexão**
```bash
GET http://localhost:3001/api/status
```

**Resposta:**
```json
{
  "connected": true,
  "hasQR": false,
  "timestamp": "2026-01-10T..."
}
```

---

### 2. **Enviar Todas as Cobranças (Recomendado)**
```bash
POST http://localhost:3001/api/cobrancas/processar
```

**O que faz:**
- Envia lembretes para clientes `active` (vencimento amanhã)
- Envia cobranças para clientes `due_today` (vence hoje)
- Envia cobranças para clientes `overdue` (atrasados)

**Resposta:**
```json
{
  "success": true,
  "resultado": {
    "lembretes": { "success": true, "sent": 5, "failed": 0 },
    "vencimentoHoje": { "success": true, "sent": 3, "failed": 0 },
    "atrasadas": { "success": true, "sent": 2, "failed": 0 }
  }
}
```

---

### 3. **Enviar Apenas Lembretes**
```bash
POST http://localhost:3001/api/cobrancas/lembretes
```

Envia para clientes com status `active` (vencimento amanhã).

---

### 4. **Enviar Vencimento Hoje**
```bash
POST http://localhost:3001/api/cobrancas/vencimento-hoje
```

Envia para clientes com status `due_today`.

---

### 5. **Enviar Cobranças Atrasadas**
```bash
POST http://localhost:3001/api/cobrancas/atrasadas
```

Envia para clientes com status `overdue`.

---

### 6. **Enviar Mensagem Manual**
```bash
POST http://localhost:3001/api/send
Content-Type: application/json

{
  "phone": "5511999999999",
  "message": "Olá! Esta é uma mensagem de teste."
}
```

---

### 7. **Listar Clientes por Status**
```bash
GET http://localhost:3001/api/clientes/overdue
GET http://localhost:3001/api/clientes/due_today
GET http://localhost:3001/api/clientes/active
GET http://localhost:3001/api/clientes/all
```

---

### 8. **Histórico de Mensagens**
```bash
GET http://localhost:3001/api/historico?limit=50
GET http://localhost:3001/api/historico?client_id=123
```

---

## 🔧 Como Integrar no Seu Sistema

### **Opção 1: Chamada Direta via JavaScript/Fetch**

```javascript
// Exemplo em seu frontend
async function enviarCobrancas() {
  try {
    const response = await fetch('http://localhost:3001/api/cobrancas/processar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const resultado = await response.json();
    
    if (resultado.success) {
      console.log('✅ Cobranças enviadas!');
      console.log(`📤 Lembretes: ${resultado.resultado.lembretes.sent}`);
      console.log(`📤 Vencimento hoje: ${resultado.resultado.vencimentoHoje.sent}`);
      console.log(`📤 Atrasadas: ${resultado.resultado.atrasadas.sent}`);
    }
  } catch (error) {
    console.error('❌ Erro ao enviar cobranças:', error);
  }
}

// Botão no seu sistema
document.getElementById('btnEnviarCobrancas').addEventListener('click', enviarCobrancas);
```

---

### **Opção 2: Chamada via jQuery**

```javascript
$('#btnEnviarCobrancas').on('click', function() {
  $.post('http://localhost:3001/api/cobrancas/processar', function(data) {
    if (data.success) {
      alert('✅ Cobranças enviadas com sucesso!');
    }
  }).fail(function() {
    alert('❌ Erro ao enviar cobranças');
  });
});
```

---

### **Opção 3: Chamada via PHP (Backend)**

```php
<?php
// Exemplo em PHP
function enviarCobrancas() {
    $url = 'http://localhost:3001/api/cobrancas/processar';
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    $resultado = json_decode($response, true);
    
    if ($resultado['success']) {
        echo "✅ Cobranças enviadas com sucesso!";
    }
}

// Chamar quando clicar no botão
if ($_POST['acao'] == 'enviar_cobrancas') {
    enviarCobrancas();
}
?>
```

---

### **Opção 4: Webhook Automático (Recomendado)**

Se você usa **Supabase Functions** ou tem um servidor backend, pode configurar um **webhook** para chamar o endpoint automaticamente quando o status de um empréstimo mudar:

```javascript
// Supabase Edge Function (exemplo)
Deno.serve(async (req) => {
  const { record } = await req.json();
  
  // Quando um loan muda para overdue, envia cobrança
  if (record.status === 'overdue') {
    await fetch('http://localhost:3001/api/cobrancas/atrasadas', {
      method: 'POST'
    });
  }
  
  return new Response('OK', { status: 200 });
});
```

---

## 🕐 Agendamentos Automáticos

O bot **já está configurado** para enviar automaticamente:

- **09:00** - Lembretes (vencimento amanhã)
- **09:00** - Vencimento hoje
- **10:00** - Cobranças atrasadas

Você **não precisa fazer nada**, as mensagens serão enviadas automaticamente!

---

## 🧪 Como Testar Agora

### **1. Verificar Status**
```bash
curl http://localhost:3001/api/status
```

### **2. Listar Clientes Atrasados**
```bash
curl http://localhost:3001/api/clientes/overdue
```

### **3. Enviar Teste Manual**
```bash
curl -X POST http://localhost:3001/api/send \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5511999999999",
    "message": "Teste de mensagem do sistema de cobranças"
  }'
```

### **4. Processar Todas as Cobranças (TESTE REAL)**
```bash
curl -X POST http://localhost:3001/api/cobrancas/processar
```

⚠️ **ATENÇÃO:** Este comando vai enviar mensagens REAIS para seus clientes!

---

## 📱 Como Adicionar Botão no Seu Sistema

### **Exemplo HTML + JavaScript**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Painel de Cobranças</title>
  <style>
    .btn-cobranca {
      background: #25D366;
      color: white;
      padding: 15px 30px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
    }
    .btn-cobranca:hover {
      background: #128C7E;
    }
    .status {
      margin-top: 20px;
      padding: 15px;
      border-radius: 8px;
      background: #f0f0f0;
    }
  </style>
</head>
<body>
  <h1>Sistema de Cobranças WhatsApp</h1>
  
  <button class="btn-cobranca" onclick="enviarTodasCobrancas()">
    📤 Enviar Todas as Cobranças
  </button>
  
  <button class="btn-cobranca" onclick="enviarLembretes()">
    🔔 Enviar Apenas Lembretes
  </button>
  
  <button class="btn-cobranca" onclick="verificarStatus()">
    📊 Verificar Status
  </button>
  
  <div id="resultado" class="status"></div>
  
  <script>
    const API_URL = 'http://localhost:3001/api';
    
    async function enviarTodasCobrancas() {
      document.getElementById('resultado').innerHTML = '⏳ Enviando cobranças...';
      
      try {
        const res = await fetch(`${API_URL}/cobrancas/processar`, { method: 'POST' });
        const data = await res.json();
        
        if (data.success) {
          document.getElementById('resultado').innerHTML = `
            ✅ Cobranças enviadas com sucesso!<br>
            📤 Lembretes: ${data.resultado.lembretes.sent} enviados<br>
            📤 Vencimento hoje: ${data.resultado.vencimentoHoje.sent} enviados<br>
            📤 Atrasadas: ${data.resultado.atrasadas.sent} enviados
          `;
        }
      } catch (error) {
        document.getElementById('resultado').innerHTML = '❌ Erro ao enviar cobranças';
      }
    }
    
    async function enviarLembretes() {
      document.getElementById('resultado').innerHTML = '⏳ Enviando lembretes...';
      
      try {
        const res = await fetch(`${API_URL}/cobrancas/lembretes`, { method: 'POST' });
        const data = await res.json();
        
        document.getElementById('resultado').innerHTML = `
          ✅ Lembretes enviados: ${data.resultado.sent}
        `;
      } catch (error) {
        document.getElementById('resultado').innerHTML = '❌ Erro ao enviar lembretes';
      }
    }
    
    async function verificarStatus() {
      try {
        const res = await fetch(`${API_URL}/status`);
        const data = await res.json();
        
        document.getElementById('resultado').innerHTML = `
          ${data.connected ? '✅ WhatsApp Conectado' : '❌ WhatsApp Desconectado'}
        `;
      } catch (error) {
        document.getElementById('resultado').innerHTML = '❌ Servidor offline';
      }
    }
  </script>
</body>
</html>
```

---

## ⚙️ Configuração das Mensagens

As mensagens estão em `src/config/constants.js`. Você pode personalizar:

```javascript
export const MENSAGENS = {
  LEMBRETE: (nome, valor, data) => 
    `Olá ${nome}! 😊\n\nLembramos que seu pagamento de R$ ${valor} vence amanhã (${data}).\n\nConte conosco!`,
  
  VENCIMENTO_HOJE: (nome, valor, data) => 
    `Olá ${nome}! ⏰\n\nSeu pagamento de R$ ${valor} vence HOJE (${data}).\n\nEvite multas e juros!`,
  
  ATRASO: (nome, valor, data, dias) => 
    `Olá ${nome}! ⚠️\n\nSeu pagamento de R$ ${valor} está em atraso há ${dias} dia(s).\n\nVencimento: ${data}\n\nRegularize sua situação!`
};
```

---

## 🔒 Segurança

Se você quer **proteger os endpoints com senha**, posso adicionar autenticação. Por enquanto, recomendo:

1. **Não expor a porta 3001 publicamente** (use apenas localhost)
2. **Usar apenas em sua rede interna**
3. Se precisar acesso externo, usar **VPN** ou **proxy reverso com autenticação**

---

## 📞 Próximos Passos

1. ✅ Testar endpoint de status
2. ✅ Testar listagem de clientes
3. ✅ Enviar mensagem de teste para seu próprio número
4. ✅ Processar cobranças reais

**Quer que eu ajude a implementar o botão no seu sistema agora?**


# 🤖 Bot de Cobrança WhatsApp - Baileys + Supabase

Sistema automatizado de cobrança via WhatsApp usando Baileys (API não oficial) integrado com Supabase.

## 🎯 Funcionalidades

- ✅ Envio automático de lembretes 1 dia antes do vencimento
- ✅ Notificação de vencimento no dia
- ✅ Cobrança para clientes em atraso
- ✅ Integração com Supabase (dois bancos de dados)
- ✅ Logs detalhados de envio
- ✅ API REST para controle manual
- ✅ Agendamento automático com cron jobs
- ✅ Deploy no Render

## 📋 Pré-requisitos

- Node.js 18+
- Conta no Supabase (2 projetos configurados)
- Conta no Render
- WhatsApp para vincular

## 🚀 Instalação Local

### 1. Clone e instale dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Sistema Principal (Clientes)
SUPABASE_URL=https://mhtxyxizfnxupwmilith.supabase.co
SUPABASE_KEY=sua_chave_aqui

# Backend do Bot (Logs)
BOT_SUPABASE_URL=https://vpxdtrhqzxfllgjvrdrg.supabase.co
BOT_SUPABASE_KEY=sua_chave_aqui

# Configurações
PORT=3000
NODE_ENV=development
HORA_ENVIO_LEMBRETES=09:00
HORA_ENVIO_VENCIMENTO=09:00
HORA_ENVIO_ATRASO=10:00
```

### 3. Configure o banco de dados

Execute os scripts SQL em `database/schema.sql`:
- Script 1: No banco principal (clientes)
- Script 2: No banco do bot (logs)

### 4. Inicie o bot

```bash
npm start
```

### 5. Conecte o WhatsApp

Ao iniciar, um QR Code será exibido no terminal. Escaneie com seu WhatsApp:
1. Abra WhatsApp > Dispositivos Vinculados
2. Escaneie o QR Code
3. Aguarde a conexão

Ou acesse: `http://localhost:3000/api/qr`

## 🌐 Deploy no Render

### 1. Crie um novo Web Service no Render

- Conecte seu repositório GitHub
- Build Command: `npm install`
- Start Command: `npm start`

### 2. Configure as variáveis de ambiente

No painel do Render, adicione:

```
SUPABASE_URL=https://mhtxyxizfnxupwmilith.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
BOT_SUPABASE_URL=https://vpxdtrhqzxfllgjvrdrg.supabase.co
BOT_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=production
HORA_ENVIO_LEMBRETES=09:00
HORA_ENVIO_VENCIMENTO=09:00
HORA_ENVIO_ATRASO=10:00
```

### 3. Deploy

Render fará o deploy automaticamente. Após o deploy:
1. Acesse: `https://seu-app.onrender.com/api/qr`
2. Escaneie o QR Code
3. Bot estará ativo 24/7

## 📡 API Endpoints

### Status e Conexão

```bash
# Health check
GET /api/

# Status da conexão WhatsApp
GET /api/status

# Obter QR Code
GET /api/qr
```

### Envio Manual

```bash
# Enviar mensagem individual
POST /api/send
{
  "phone": "5511999999999",
  "message": "Sua mensagem aqui"
}

# Processar todas as cobranças
POST /api/cobrancas/processar

# Enviar apenas lembretes
POST /api/cobrancas/lembretes

# Enviar vencimento hoje
POST /api/cobrancas/vencimento-hoje

# Enviar cobranças atrasadas
POST /api/cobrancas/atrasadas
```

### Consultas

```bash
# Listar clientes por status
GET /api/clientes/overdue
GET /api/clientes/due_today
GET /api/clientes/active
GET /api/clientes/all

# Histórico de mensagens
GET /api/historico?limit=50
GET /api/historico?client_id=123
```

## 🗄️ Estrutura do Banco de Dados

### Banco Principal (Clientes)

**Tabela: clientes**
- `id`: ID único do cliente
- `nome`: Nome completo
- `telefone`: Formato 5511999999999
- `email`: Email (opcional)
- `valor`: Valor da mensalidade
- `data_vencimento`: Data de vencimento
- `status`: 'active', 'due_today', 'overdue'

### Banco do Bot (Logs)

**Tabela: message_logs**
- `id`: ID do log
- `client_id`: ID do cliente
- `client_name`: Nome do cliente
- `phone`: Telefone
- `message_type`: 'lembrete', 'vencimento_hoje', 'atraso'
- `status`: 'sent', 'failed'
- `error_message`: Mensagem de erro (se houver)
- `sent_at`: Data/hora do envio

## ⏰ Agendamentos Automáticos

O bot executa automaticamente:

| Horário | Ação | Alvo |
|---------|------|------|
| 09:00 | Lembretes | Clientes com `status='active'` (vence amanhã) |
| 09:00 | Vencimento | Clientes com `status='due_today'` |
| 10:00 | Cobrança | Clientes com `status='overdue'` |

## 📱 Formato do Telefone

Use o formato internacional completo:
- ✅ `5511999999999` (55 + 11 + 999999999)
- ❌ `11999999999`
- ❌ `+55 11 99999-9999`

## 🔒 Segurança

- Nunca commite o arquivo `.env`
- Use variáveis de ambiente no Render
- Mantenha as chaves do Supabase seguras
- O bot cria uma pasta `auth_info` para sessão do WhatsApp

## 🛠️ Estrutura do Projeto

```
botconversa/
├── src/
│   ├── api/
│   │   └── routes.js          # Rotas da API
│   ├── bot/
│   │   └── whatsapp.js        # Conexão Baileys
│   ├── config/
│   │   ├── supabase.js        # Configuração Supabase
│   │   └── constants.js       # Constantes e mensagens
│   ├── cron/
│   │   └── scheduler.js       # Agendamentos
│   ├── services/
│   │   ├── clientService.js   # Serviços de clientes
│   │   ├── cobrancaService.js # Lógica de cobrança
│   │   └── logService.js      # Serviços de log
│   └── index.js               # Ponto de entrada
├── database/
│   └── schema.sql             # Scripts do banco
├── package.json
├── render.yaml
└── README.md
```

## 🔧 Personalização

### Alterar Mensagens

Edite `src/config/constants.js`:

```javascript
export const MENSAGENS = {
  LEMBRETE: (nome, valor, dataVencimento) => 
    `Sua mensagem personalizada aqui...`,
  // ...
};
```

### Alterar Horários

No arquivo `.env`:

```env
HORA_ENVIO_LEMBRETES=08:00
HORA_ENVIO_VENCIMENTO=10:00
HORA_ENVIO_ATRASO=14:00
```

## 📊 Monitoramento

### Logs no Render

Acesse o painel do Render > Logs para ver:
- Conexões do WhatsApp
- Mensagens enviadas
- Erros e exceções

### Consultar histórico

```bash
curl https://seu-app.onrender.com/api/historico
```

## ⚠️ Limitações

1. **WhatsApp**: Evite enviar muitas mensagens rapidamente (delay de 3s entre envios)
2. **Render Free Tier**: Inativa após 15min sem uso (reconecta automaticamente)
3. **Sessão WhatsApp**: Pode expirar, necessário reescanear QR Code

## 🐛 Troubleshooting

### Bot desconecta frequentemente
- Verifique a estabilidade da conexão do Render
- Considere upgrade para plano pago

### QR Code não aparece
- Acesse `/api/qr` via browser
- Verifique se a pasta `auth_info` está vazia

### Mensagens não são enviadas
- Verifique status: `/api/status`
- Confira logs no Render
- Verifique formato dos telefones
- Confirme que o status dos clientes está correto

### Erro de conexão Supabase
- Verifique as URLs e chaves
- Confirme que as tabelas foram criadas
- Teste conexão no painel do Supabase

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs no Render
2. Consulte o histórico: `/api/historico`
3. Teste manualmente: `/api/send`

## 📄 Licença

MIT License


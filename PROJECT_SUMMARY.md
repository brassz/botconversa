# 📊 Resumo do Projeto - Bot de Cobrança WhatsApp

```
┌─────────────────────────────────────────────────────────────────┐
│                   🤖 BOT DE COBRANÇA WHATSAPP                   │
│                    Baileys + Supabase + Render                  │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Estrutura do Projeto

```
botconversa/
│
├── 📄 Documentação
│   ├── README.md              ⭐ Início aqui - Visão geral completa
│   ├── QUICKSTART.md          ⚡ Deploy em 5 minutos
│   ├── DEPLOY.md              🚀 Guia detalhado de deploy
│   ├── USAGE.md               💡 Como usar a API
│   ├── FAQ.md                 ❓ Perguntas frequentes
│   ├── TROUBLESHOOTING.md     🔧 Soluções de problemas
│   ├── CHECKLIST.md           ✅ Checklist completo
│   ├── CHANGELOG.md           📝 Histórico de mudanças
│   ├── CREDENTIALS.txt        🔑 Suas credenciais
│   └── LICENSE                📜 MIT License
│
├── 🔧 Configuração
│   ├── package.json           📦 Dependências Node.js
│   ├── render.yaml            ☁️ Config do Render
│   ├── config.example.js      ⚙️ Exemplo de configuração
│   ├── .nvmrc                 🟢 Versão do Node (18)
│   ├── .gitignore             🚫 Arquivos ignorados
│   └── .gitattributes         📝 Configuração Git
│
├── 🗄️ database/
│   ├── schema.sql             📊 Estrutura das tabelas
│   └── exemplo_clientes.sql   👥 Dados de teste
│
├── 🛠️ scripts/
│   ├── test-bot.sh            🧪 Testar funcionalidades
│   ├── send-message.sh        📱 Enviar mensagem via CLI
│   ├── process-charges.sh     💰 Processar cobranças
│   └── keep-alive.sh          🔄 Manter bot ativo
│
└── 💻 src/
    ├── index.js               🚀 Ponto de entrada
    │
    ├── api/
    │   └── routes.js          🌐 Endpoints REST
    │
    ├── bot/
    │   └── whatsapp.js        📱 Conexão Baileys
    │
    ├── config/
    │   ├── supabase.js        🗄️ Clientes Supabase
    │   └── constants.js       📋 Mensagens e configs
    │
    ├── cron/
    │   └── scheduler.js       ⏰ Agendamentos automáticos
    │
    └── services/
        ├── clientService.js   👥 Gestão de clientes
        ├── cobrancaService.js 💰 Lógica de cobrança
        └── logService.js      📝 Registro de logs
```

## 🎯 Funcionalidades

### ✅ Implementadas

| Recurso | Descrição | Status |
|---------|-----------|--------|
| 📱 Conexão WhatsApp | Via Baileys (API não oficial) | ✅ |
| 🗄️ Integração Supabase | Dual database (clientes + logs) | ✅ |
| ⏰ Cron Jobs | Execução automática programada | ✅ |
| 🔔 Lembretes | 1 dia antes do vencimento | ✅ |
| ⏰ Vencimento | Notificação no dia | ✅ |
| ⚠️ Cobrança | Para clientes atrasados | ✅ |
| 🌐 API REST | Controle manual completo | ✅ |
| 📊 Logs | Histórico de envios | ✅ |
| 🚫 Anti-duplicação | Não reenvia mensagens | ✅ |
| ☁️ Deploy Render | Configuração pronta | ✅ |

### 🔮 Futuras (Sugestões)

- [ ] Dashboard web
- [ ] Autenticação API
- [ ] Respostas automáticas
- [ ] Envio de mídia (imagens/PDFs)
- [ ] Relatórios de cobrança
- [ ] Multi-atendentes
- [ ] Backup automático de sessão

## 🌐 API Endpoints

```
GET  /api/                              # Health check
GET  /api/status                        # Status WhatsApp
GET  /api/qr                            # QR Code
POST /api/send                          # Enviar mensagem
POST /api/cobrancas/processar          # Processar todas
POST /api/cobrancas/lembretes          # Só lembretes
POST /api/cobrancas/vencimento-hoje    # Só vencimentos
POST /api/cobrancas/atrasadas          # Só atrasados
GET  /api/clientes/:status             # Listar clientes
GET  /api/historico                     # Histórico de envios
```

## ⏰ Agendamentos Automáticos

```
┌─────────────┬──────────────────────────┬────────────────────┐
│   Horário   │         Ação             │       Target       │
├─────────────┼──────────────────────────┼────────────────────┤
│   09:00     │  📧 Enviar Lembretes     │  status='active'   │
│   09:00     │  ⏰ Vencimento Hoje      │  status='due_today'│
│   10:00     │  ⚠️ Cobranças Atrasadas  │  status='overdue'  │
└─────────────┴──────────────────────────┴────────────────────┘

* Horários configuráveis via variáveis de ambiente
```

## 🗄️ Banco de Dados

### Banco Principal (Clientes)
```sql
URL: https://mhtxyxizfnxupwmilith.supabase.co

Tabela: clientes
├── id (serial)
├── nome (varchar)
├── telefone (varchar)      # Formato: 5511999999999
├── email (varchar)
├── valor (decimal)
├── data_vencimento (date)
└── status (varchar)        # active | due_today | overdue
```

### Banco do Bot (Logs)
```sql
URL: https://vpxdtrhqzxfllgjvrdrg.supabase.co

Tabela: message_logs
├── id (serial)
├── client_id (integer)
├── client_name (varchar)
├── phone (varchar)
├── message_type (varchar)  # lembrete | vencimento_hoje | atraso
├── status (varchar)        # sent | failed
├── error_message (text)
└── sent_at (timestamp)
```

## 🚀 Deploy no Render

```
1. Conectar GitHub ──> Render
2. Configurar variáveis de ambiente
3. Deploy automático
4. Escanear QR Code
5. ✅ Bot ativo 24/7!
```

### Variáveis de Ambiente Necessárias

```env
SUPABASE_URL=https://mhtxyxizfnxupwmilith.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
BOT_SUPABASE_URL=https://vpxdtrhqzxfllgjvrdrg.supabase.co
BOT_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=production
PORT=3000
HORA_ENVIO_LEMBRETES=09:00
HORA_ENVIO_VENCIMENTO=09:00
HORA_ENVIO_ATRASO=10:00
```

## 📊 Fluxo de Funcionamento

```
┌──────────────────────────────────────────────────────────┐
│                      FLUXO DIÁRIO                        │
└──────────────────────────────────────────────────────────┘

00:00 ─ Seu sistema atualiza status dos clientes
        │
        ├─ Vencimento < Hoje     → status = 'overdue'
        ├─ Vencimento = Hoje     → status = 'due_today'
        └─ Vencimento = Amanhã   → status = 'active'

09:00 ─ Bot envia LEMBRETES
        └─ Para: status='active' (vence amanhã)

09:00 ─ Bot envia VENCIMENTO HOJE
        └─ Para: status='due_today'

10:00 ─ Bot envia COBRANÇAS
        └─ Para: status='overdue' (atrasados)

        ↓
    
    Cada mensagem:
    ✓ Verificada se já foi enviada hoje
    ✓ Enviada com delay de 3s
    ✓ Registrada em message_logs
```

## 💰 Custos Estimados

```
┌────────────────────┬──────────┬─────────────────────────┐
│     Serviço        │   Custo  │      Observações        │
├────────────────────┼──────────┼─────────────────────────┤
│ Render Free        │   $0     │ Inativa após 15min      │
│ Render Starter     │   $7/mês │ ⭐ Recomendado          │
│ Supabase Free      │   $0     │ Até 500MB + 2GB tráfego │
│ WhatsApp (Baileys) │   $0     │ API não oficial         │
├────────────────────┼──────────┼─────────────────────────┤
│ TOTAL (produção)   │   $7/mês │ 💰 Muito acessível!     │
└────────────────────┴──────────┴─────────────────────────┘
```

## 🎓 Guia Rápido de Início

### Para Desenvolvedores

1. **Clone o projeto**
   ```bash
   git clone seu-repositorio
   cd botconversa
   npm install
   ```

2. **Configure .env**
   ```bash
   cp .env.example .env
   # Edite .env com suas credenciais
   ```

3. **Execute localmente**
   ```bash
   npm start
   ```

### Para Deploy em Produção

1. **Leia primeiro:** `QUICKSTART.md` (5 minutos)
2. **Deploy:** Siga `DEPLOY.md` (passo a passo)
3. **Configure:** Use `CHECKLIST.md` para não esquecer nada
4. **Teste:** Use scripts em `scripts/`
5. **Monitore:** Acompanhe logs no Render

### Para Usuários

1. **Acesse:** `https://seu-app.onrender.com/api/qr`
2. **Escaneie:** QR Code com WhatsApp
3. **Pronto!** Bot funcionando automaticamente

## 📚 Documentação por Perfil

### 👨‍💻 Sou Desenvolvedor
- `README.md` - Visão geral técnica
- `src/` - Explore o código fonte
- `.env.example` - Configure ambiente local

### 🚀 Quero Fazer Deploy
- `QUICKSTART.md` - Comece aqui!
- `DEPLOY.md` - Guia passo a passo
- `CHECKLIST.md` - Não esqueça nada

### 💼 Vou Usar a API
- `USAGE.md` - Guia completo da API
- `scripts/` - Exemplos práticos
- `FAQ.md` - Perguntas comuns

### 🆘 Tenho Problemas
- `TROUBLESHOOTING.md` - Soluções
- `FAQ.md` - Perguntas frequentes
- Render Logs - Verifique erros

## 🔒 Segurança

- ✅ Variáveis de ambiente (não commitadas)
- ✅ `.gitignore` configurado
- ✅ Chaves ANON do Supabase (públicas por design)
- ⚠️ Adicione autenticação na API para produção
- ⚠️ Configure RLS no Supabase se necessário

## 📞 Links Importantes

```
📖 Documentação Baileys
   https://github.com/WhiskeySockets/Baileys

☁️ Render Dashboard
   https://dashboard.render.com

🗄️ Supabase Principal
   https://mhtxyxizfnxupwmilith.supabase.co

🤖 Supabase Bot
   https://vpxdtrhqzxfllgjvrdrg.supabase.co

📊 Seu Bot (após deploy)
   https://seu-app.onrender.com
```

## 🎯 Status do Projeto

```
Versão: 1.0.0
Status: ✅ Pronto para Produção
Licença: MIT
Node.js: 18+
Última Atualização: 2026-01-09
```

## 🏆 Características Principais

✨ **Simplicidade**
- Configuração em 5 minutos
- Deploy automático
- Sem complexidade

⚡ **Performance**
- Delay otimizado (3s)
- Cron jobs eficientes
- Queries indexadas

🛡️ **Confiabilidade**
- Anti-duplicação
- Logs completos
- Reconexão automática

💰 **Econômico**
- $7/mês total
- Sem custos de API
- Supabase gratuito

📚 **Bem Documentado**
- 9 arquivos de docs
- Scripts utilitários
- Exemplos práticos

## ✅ Pronto para Começar?

1. **Início Rápido:** Leia `QUICKSTART.md`
2. **Deploy Completo:** Siga `DEPLOY.md`
3. **Tem Dúvidas?** Consulte `FAQ.md`
4. **Problemas?** Veja `TROUBLESHOOTING.md`

---

```
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║         🎉 BOT DE COBRANÇA WHATSAPP - V1.0.0 🎉         ║
║                                                          ║
║            Desenvolvido com Node.js + Baileys           ║
║                  Pronto para Produção!                  ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

**Bom uso! 🚀**


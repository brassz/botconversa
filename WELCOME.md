# 🎉 Bem-vindo ao Bot de Cobrança WhatsApp!

```
    ╔═══════════════════════════════════════════════════════╗
    ║                                                       ║
    ║         🤖  BOT DE COBRANÇA AUTOMÁTICA  📱           ║
    ║                                                       ║
    ║              WhatsApp + Baileys + Supabase            ║
    ║                   Deploy no Render                    ║
    ║                                                       ║
    ╚═══════════════════════════════════════════════════════╝
```

## 🚀 Por Onde Começar?

### ⚡ Quero começar AGORA! (5 minutos)

👉 **[QUICKSTART.md](QUICKSTART.md)**

Configure e faça deploy em 5 minutos seguindo o guia rápido.

---

### 📖 Quero entender primeiro

👉 **[README.md](README.md)**

Documentação completa com todas as informações técnicas.

---

### 🎯 Já tenho tudo configurado

👉 **[USAGE.md](USAGE.md)**

Aprenda a usar a API e integrar com seu sistema.

---

## 🎓 Documentação Completa

```
┌─────────────────────────────────────────────────────┐
│  📄 ARQUIVO           │  📝 CONTEÚDO                │
├───────────────────────┼─────────────────────────────┤
│  README.md            │  Documentação completa      │
│  QUICKSTART.md        │  Deploy rápido (5 min)      │
│  DEPLOY.md            │  Guia detalhado de deploy   │
│  USAGE.md             │  Como usar a API            │
│  FAQ.md               │  Perguntas frequentes       │
│  TROUBLESHOOTING.md   │  Resolver problemas         │
│  CHECKLIST.md         │  Checklist de configuração  │
│  PROJECT_SUMMARY.md   │  Resumo visual do projeto   │
│  CREDENTIALS.txt      │  Template de credenciais    │
│  CHANGELOG.md         │  Histórico de versões       │
└───────────────────────┴─────────────────────────────┘
```

## 🎯 O que Este Bot Faz?

### ✨ Funcionalidades

- ✅ Envia lembretes 1 dia antes do vencimento
- ✅ Notifica clientes no dia do vencimento
- ✅ Cobra clientes em atraso automaticamente
- ✅ Integra com Supabase (banco de dados)
- ✅ Roda 24/7 no Render
- ✅ API REST para controle manual
- ✅ Logs completos de todas as mensagens

### ⏰ Automático e Inteligente

```
📅 Todo dia:

09:00 → 🔔 Lembretes (para quem vence amanhã)
09:00 → ⏰ Vencimento (para quem vence hoje)
10:00 → ⚠️ Cobrança (para quem está atrasado)
```

## 💰 Quanto Custa?

```
┌──────────────────┬──────────┐
│  Render Free     │  $0      │  (com limitações)
│  Render Starter  │  $7/mês  │  ⭐ Recomendado
│  Supabase Free   │  $0      │
│  WhatsApp        │  $0      │
├──────────────────┼──────────┤
│  TOTAL           │  $7/mês  │  💚 Muito acessível!
└──────────────────┴──────────┘
```

## 🛠️ Tecnologias Usadas

- **Node.js 18+** - Runtime JavaScript
- **Baileys** - WhatsApp API não oficial
- **Supabase** - Banco de dados PostgreSQL
- **Express** - API REST
- **Node-cron** - Agendamentos automáticos
- **Render** - Hospedagem cloud

## 📱 Como Funciona?

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│  SUPABASE   │────▶│    BOT      │────▶│  WHATSAPP   │
│  (Clientes) │     │  (Render)   │     │  (Baileys)  │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
      │                    │                    │
      │                    │                    │
      ▼                    ▼                    ▼
   Busca               Processa            Envia
   Clientes            Mensagens          Cobranças
```

## 🎬 Guia de Início Rápido

### 1️⃣ Clone o Projeto

```bash
git clone seu-repositorio
cd botconversa
npm install
```

### 2️⃣ Configure Supabase

Execute os scripts SQL em:
- 📄 `database/schema.sql`

### 3️⃣ Deploy no Render

Siga o guia: **[DEPLOY.md](DEPLOY.md)**

### 4️⃣ Conecte o WhatsApp

Acesse: `https://seu-app.onrender.com/api/qr`
Escaneie o QR Code

### 5️⃣ Pronto! 🎉

Seu bot está funcionando 24/7!

## 🎯 Casos de Uso

### 📶 Provedores de Internet

```
- Lembrete 1 dia antes: "Sua internet vence amanhã!"
- Vencimento: "Sua internet vence hoje!"
- Atraso: "Sua internet está suspensa. Regularize!"
```

### 🏋️ Academias

```
- Lembrete: "Sua mensalidade vence amanhã!"
- Vencimento: "Pague hoje para manter acesso!"
- Atraso: "Mensalidade em atraso há X dias"
```

### 🏠 Imobiliárias

```
- Lembrete: "Aluguel vence amanhã!"
- Vencimento: "Aluguel vence hoje!"
- Atraso: "Aluguel atrasado há X dias"
```

### 💼 SaaS / Assinaturas

```
- Lembrete: "Renovação automática amanhã!"
- Vencimento: "Assinatura vence hoje!"
- Atraso: "Assinatura suspensa. Renove!"
```

## ⚙️ Configuração em 3 Passos

### Passo 1: Banco de Dados

```sql
-- Execute no Supabase:
CREATE TABLE clientes (
  id serial,
  nome varchar,
  telefone varchar,  -- 5511999999999
  valor decimal,
  data_vencimento date,
  status varchar     -- active, due_today, overdue
);
```

### Passo 2: Deploy

```bash
# Push para GitHub
git push origin main

# Configure Render
# Adicione variáveis de ambiente
# Deploy automático!
```

### Passo 3: WhatsApp

```
1. Acesse: /api/qr
2. Escaneie QR Code
3. ✅ Conectado!
```

## 📊 Endpoints da API

```bash
# Status do bot
curl https://seu-app.onrender.com/api/status

# Enviar mensagem
curl -X POST https://seu-app.onrender.com/api/send \
  -H "Content-Type: application/json" \
  -d '{"phone": "5511999999999", "message": "Olá!"}'

# Processar cobranças
curl -X POST https://seu-app.onrender.com/api/cobrancas/processar

# Ver histórico
curl https://seu-app.onrender.com/api/historico
```

## 🎓 Precisa de Ajuda?

### 📚 Documentação

| Problema | Consulte |
|----------|----------|
| Como fazer deploy? | [DEPLOY.md](DEPLOY.md) |
| Como usar a API? | [USAGE.md](USAGE.md) |
| Tenho dúvidas | [FAQ.md](FAQ.md) |
| Está com erro | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| Esqueci algo | [CHECKLIST.md](CHECKLIST.md) |

### 🔧 Scripts Úteis

```bash
# Testar bot
./scripts/test-bot.sh https://seu-app.onrender.com

# Enviar mensagem
./scripts/send-message.sh https://seu-app.onrender.com 5511999999999 "Olá!"

# Processar cobranças
./scripts/process-charges.sh https://seu-app.onrender.com all

# Manter ativo (Free Tier)
./scripts/keep-alive.sh https://seu-app.onrender.com
```

## 🌟 Recursos Destacados

### 🎯 Inteligente

- ✅ Não envia mensagens duplicadas
- ✅ Verifica se já enviou hoje
- ✅ Delay entre mensagens (evita bloqueio)

### 📊 Completo

- ✅ Logs de todas as mensagens
- ✅ Histórico por cliente
- ✅ Estatísticas de envio

### 🔧 Flexível

- ✅ Mensagens personalizáveis
- ✅ Horários configuráveis
- ✅ API REST completa

### 💰 Econômico

- ✅ Apenas $7/mês
- ✅ Sem custo de API
- ✅ Escalável

## 🎯 Próximos Passos

### Agora:

1. **Leia:** [QUICKSTART.md](QUICKSTART.md) (5 minutos)
2. **Configure:** Supabase + Render
3. **Deploy:** Siga o guia passo a passo
4. **Teste:** Envie mensagem de teste

### Depois:

1. **Integre:** Com seu sistema atual
2. **Personalize:** Mensagens e horários
3. **Monitore:** Logs e estatísticas
4. **Otimize:** Conforme necessidade

## 🤝 Contribua

Este é um projeto open source! Sinta-se livre para:

- 🐛 Reportar bugs
- 💡 Sugerir melhorias
- 🔧 Enviar pull requests
- ⭐ Dar uma estrela no GitHub

## 📄 Licença

MIT License - Use livremente!

---

```
    ╔═══════════════════════════════════════════════════╗
    ║                                                   ║
    ║         🚀 PRONTO PARA COMEÇAR?                  ║
    ║                                                   ║
    ║   👉 Abra o QUICKSTART.md e comece agora!       ║
    ║                                                   ║
    ╚═══════════════════════════════════════════════════╝
```

**Boa sorte com seu bot! 🎉**

---

<p align="center">
  <strong>Feito com ❤️ para facilitar cobranças automáticas</strong>
</p>


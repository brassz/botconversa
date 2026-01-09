# 📚 Índice de Documentação

> Guia completo de navegação pela documentação do Bot de Cobrança WhatsApp

## 🎯 Por Onde Começar?

### 👋 Sou Novo Aqui

**[WELCOME.md](WELCOME.md)** - Bem-vindo! Comece aqui para ter uma visão geral.

### ⚡ Quero Deploy Rápido (5 minutos)

**[QUICKSTART.md](QUICKSTART.md)** - Guia de início rápido com deploy completo.

### 📖 Quero Entender Tudo

**[README.md](README.md)** - Documentação técnica completa do projeto.

---

## 📁 Documentação por Categoria

### 🚀 Deploy e Configuração

| Arquivo | Descrição | Quando Usar |
|---------|-----------|-------------|
| **[QUICKSTART.md](QUICKSTART.md)** | Deploy em 5 minutos | Quando quiser começar rapidamente |
| **[DEPLOY.md](DEPLOY.md)** | Guia detalhado de deploy | Quando precisar de instruções passo a passo |
| **[CHECKLIST.md](CHECKLIST.md)** | Checklist completo | Para garantir que não esqueceu nada |
| **[render.yaml](render.yaml)** | Configuração do Render | Referência de configuração |

### 💻 Desenvolvimento e Uso

| Arquivo | Descrição | Quando Usar |
|---------|-----------|-------------|
| **[README.md](README.md)** | Documentação completa | Referência técnica geral |
| **[USAGE.md](USAGE.md)** | Guia de uso da API | Para integrar com seu sistema |
| **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** | Resumo visual do projeto | Visão geral da estrutura |
| **[config.example.js](config.example.js)** | Exemplo de configuração | Para configurar localmente |

### ❓ Ajuda e Suporte

| Arquivo | Descrição | Quando Usar |
|---------|-----------|-------------|
| **[FAQ.md](FAQ.md)** | Perguntas frequentes | Primeira parada para dúvidas |
| **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** | Soluções de problemas | Quando algo não funcionar |
| **[CHANGELOG.md](CHANGELOG.md)** | Histórico de versões | Para ver mudanças e atualizações |

### 🗄️ Banco de Dados

| Arquivo | Descrição | Quando Usar |
|---------|-----------|-------------|
| **[database/schema.sql](database/schema.sql)** | Estrutura das tabelas | Configurar Supabase |
| **[database/exemplo_clientes.sql](database/exemplo_clientes.sql)** | Dados de teste | Para testar o sistema |

### 🛠️ Scripts e Ferramentas

| Arquivo | Descrição | Quando Usar |
|---------|-----------|-------------|
| **[scripts/test-bot.sh](scripts/test-bot.sh)** | Testar funcionalidades | Verificar se tudo funciona |
| **[scripts/send-message.sh](scripts/send-message.sh)** | Enviar mensagem via CLI | Testar envio manual |
| **[scripts/process-charges.sh](scripts/process-charges.sh)** | Processar cobranças | Executar manualmente |
| **[scripts/keep-alive.sh](scripts/keep-alive.sh)** | Manter bot ativo | Free Tier do Render |

### 📝 Informações Gerais

| Arquivo | Descrição | Quando Usar |
|---------|-----------|-------------|
| **[CREDENTIALS.txt](CREDENTIALS.txt)** | Template de credenciais | Referência rápida de chaves |
| **[LICENSE](LICENSE)** | Licença MIT | Informações legais |
| **[package.json](package.json)** | Dependências Node.js | Instalar/atualizar pacotes |

---

## 🎯 Fluxos de Navegação

### 🆕 Fluxo: Primeiro Deploy

```
1. WELCOME.md          → Visão geral
2. QUICKSTART.md       → Deploy rápido
3. database/schema.sql → Configurar banco
4. CHECKLIST.md        → Verificar tudo
5. USAGE.md            → Aprender a usar
```

### 🔧 Fluxo: Configuração Detalhada

```
1. README.md           → Entender o projeto
2. DEPLOY.md           → Guia passo a passo
3. config.example.js   → Configurar ambiente
4. database/schema.sql → Criar tabelas
5. CHECKLIST.md        → Validar configuração
6. scripts/test-bot.sh → Testar tudo
```

### 💼 Fluxo: Integração com Sistema

```
1. README.md           → Arquitetura geral
2. USAGE.md            → Endpoints disponíveis
3. PROJECT_SUMMARY.md  → Entender estrutura
4. src/api/routes.js   → Ver implementação
5. FAQ.md              → Esclarecer dúvidas
```

### 🐛 Fluxo: Resolver Problemas

```
1. FAQ.md              → Perguntas comuns
2. TROUBLESHOOTING.md  → Soluções específicas
3. CHECKLIST.md        → Verificar configuração
4. Render Logs         → Analisar erros
5. database/schema.sql → Validar banco
```

### 📚 Fluxo: Aprender Código

```
1. PROJECT_SUMMARY.md  → Estrutura do projeto
2. src/index.js        → Ponto de entrada
3. src/bot/whatsapp.js → Conexão WhatsApp
4. src/services/       → Lógica de negócio
5. src/api/routes.js   → Endpoints REST
```

---

## 📂 Estrutura de Arquivos

### 📄 Raiz do Projeto

```
botconversa/
│
├── 📖 Documentação (10 arquivos)
│   ├── WELCOME.md             ← Comece aqui!
│   ├── INDEX.md               ← Você está aqui
│   ├── QUICKSTART.md          ← Deploy rápido
│   ├── README.md              ← Doc completa
│   ├── DEPLOY.md              ← Guia detalhado
│   ├── USAGE.md               ← Uso da API
│   ├── FAQ.md                 ← Perguntas
│   ├── TROUBLESHOOTING.md     ← Problemas
│   ├── CHECKLIST.md           ← Verificação
│   ├── PROJECT_SUMMARY.md     ← Resumo visual
│   ├── CHANGELOG.md           ← Versões
│   └── CREDENTIALS.txt        ← Credenciais
│
├── 🔧 Configuração (4 arquivos)
│   ├── package.json           ← Dependências
│   ├── render.yaml            ← Config Render
│   ├── config.example.js      ← Exemplo config
│   └── .nvmrc                 ← Node version
│
├── 🗄️ database/ (2 arquivos)
│   ├── schema.sql             ← Estrutura BD
│   └── exemplo_clientes.sql   ← Dados teste
│
├── 🛠️ scripts/ (4 arquivos)
│   ├── test-bot.sh            ← Testar
│   ├── send-message.sh        ← Enviar msg
│   ├── process-charges.sh     ← Cobranças
│   └── keep-alive.sh          ← Manter ativo
│
└── 💻 src/ (Código fonte)
    ├── index.js               ← Entrada
    ├── api/routes.js          ← API REST
    ├── bot/whatsapp.js        ← WhatsApp
    ├── config/                ← Configs
    ├── cron/scheduler.js      ← Cron jobs
    └── services/              ← Lógica
```

---

## 🔍 Índice por Tópico

### 📱 WhatsApp / Baileys

- [Conexão WhatsApp](src/bot/whatsapp.js)
- [FAQ: WhatsApp](FAQ.md#-whatsapp)
- [Troubleshooting: WhatsApp](TROUBLESHOOTING.md#-problemas-de-conexão-whatsapp)

### 🗄️ Supabase / Banco de Dados

- [Schema SQL](database/schema.sql)
- [Configuração Supabase](src/config/supabase.js)
- [FAQ: Banco de Dados](FAQ.md#-banco-de-dados)
- [Troubleshooting: Supabase](TROUBLESHOOTING.md#-problemas-com-supabase)

### ⏰ Cron Jobs / Agendamentos

- [Scheduler](src/cron/scheduler.js)
- [Configuração de Horários](USAGE.md#alterar-horários-de-envio)
- [FAQ: Cron](FAQ.md#como-alterar-os-horários-de-envio)
- [Troubleshooting: Cron](TROUBLESHOOTING.md#-problemas-com-cron-jobs)

### 🌐 API REST

- [Rotas da API](src/api/routes.js)
- [Uso da API](USAGE.md)
- [Lista de Endpoints](PROJECT_SUMMARY.md#-api-endpoints)

### 💰 Cobranças

- [Serviço de Cobrança](src/services/cobrancaService.js)
- [Mensagens](src/config/constants.js)
- [Fluxo de Cobrança](PROJECT_SUMMARY.md#-fluxo-de-funcionamento)

### 🚀 Deploy / Render

- [Guia Rápido](QUICKSTART.md)
- [Guia Detalhado](DEPLOY.md)
- [Checklist](CHECKLIST.md)
- [Configuração Render](render.yaml)
- [FAQ: Deploy](FAQ.md#-deploy-e-hospedagem)

### 🐛 Problemas e Soluções

- [FAQ Geral](FAQ.md)
- [Troubleshooting Completo](TROUBLESHOOTING.md)
- [Problemas Comuns](FAQ.md#-problemas-comuns)

---

## 🎓 Guias Especializados

### Para Desenvolvedores

1. **Setup Local**
   - [README.md](README.md#-instalação-local)
   - [config.example.js](config.example.js)
   - [package.json](package.json)

2. **Entender Código**
   - [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
   - [src/](src/)
   - [CHANGELOG.md](CHANGELOG.md)

3. **Contribuir**
   - [LICENSE](LICENSE)
   - [CHANGELOG.md](CHANGELOG.md)

### Para DevOps

1. **Deploy**
   - [DEPLOY.md](DEPLOY.md)
   - [render.yaml](render.yaml)
   - [CHECKLIST.md](CHECKLIST.md)

2. **Monitoramento**
   - [scripts/test-bot.sh](scripts/test-bot.sh)
   - [USAGE.md](USAGE.md#monitoramento)

3. **Troubleshooting**
   - [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
   - [FAQ.md](FAQ.md)

### Para Usuários/Integradores

1. **Como Usar**
   - [USAGE.md](USAGE.md)
   - [FAQ.md](FAQ.md)

2. **Integração**
   - [USAGE.md](USAGE.md#integração-com-seu-sistema)
   - [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md#-api-endpoints)

3. **Suporte**
   - [FAQ.md](FAQ.md)
   - [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 🔗 Links Rápidos

### 📖 Documentação Externa

- [Baileys GitHub](https://github.com/WhiskeySockets/Baileys)
- [Render Docs](https://render.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Node-cron](https://www.npmjs.com/package/node-cron)
- [Express.js](https://expressjs.com/)

### 🛠️ Ferramentas Úteis

- [Render Dashboard](https://dashboard.render.com)
- [Supabase Principal](https://mhtxyxizfnxupwmilith.supabase.co)
- [Supabase Bot](https://vpxdtrhqzxfllgjvrdrg.supabase.co)
- [UptimeRobot](https://uptimerobot.com) (manter ativo)

---

## 🎯 Começar Agora

### Opção 1: Rápido (5 min)
👉 **[QUICKSTART.md](QUICKSTART.md)**

### Opção 2: Completo (15-30 min)
👉 **[DEPLOY.md](DEPLOY.md)**

### Opção 3: Explorar Primeiro
👉 **[README.md](README.md)**

---

## 📊 Estatísticas do Projeto

```
📄 Documentação:     14 arquivos
💻 Código Fonte:     9 arquivos
🛠️ Scripts:          4 utilitários
🗄️ Database:         2 schemas
📦 Dependências:     10 principais
⭐ Qualidade:        Pronto para produção
```

---

## 💡 Dicas de Navegação

- **Ctrl+F** para buscar neste índice
- Todos os links são clicáveis
- Use os fluxos de navegação como guia
- Consulte FAQ primeiro para dúvidas
- Troubleshooting para problemas específicos

---

<p align="center">
  <strong>Este índice é seu mapa do projeto!</strong><br>
  Use-o sempre que precisar encontrar algo rapidamente.
</p>

---

**Última atualização:** v1.0.0 - 2026-01-09


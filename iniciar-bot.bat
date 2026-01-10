@echo off
title Sistema de Notificacoes WhatsApp
color 0A
cls

echo ================================================
echo   SISTEMA DE NOTIFICACOES WHATSAPP
echo ================================================
echo.
echo [1/3] Verificando ambiente...
echo.

REM Verificar se o Node.js esta instalado
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Por favor, instale o Node.js de: https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js encontrado: 
node --version
echo.

REM Verificar se o arquivo .env existe
if not exist ".env" (
    echo [AVISO] Arquivo .env nao encontrado!
    echo Criando .env a partir de env.exemplo...
    copy env.exemplo .env >nul
    echo [OK] Arquivo .env criado. Configure as variaveis antes de continuar.
    echo.
    pause
)

echo [2/3] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependencias!
    pause
    exit /b 1
)
echo.

echo [3/3] Iniciando servidor...
echo.
echo ================================================
echo   SERVIDOR RODANDO
echo ================================================
echo.
echo URL: http://localhost:3001
echo Status: http://localhost:3001/api/status
echo QR Code: http://localhost:3001/api/qr
echo.
echo Pressione Ctrl+C para parar o servidor
echo ================================================
echo.

npm start

pause


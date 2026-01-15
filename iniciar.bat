@echo off
title Servidor Local - Puerto 8000

echo ======================================
echo    CERRANDO SERVIDORES VIEJOS...
echo ======================================

:: Mata procesos en el puerto 8000 (Windows)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do (
    echo Matando proceso PID %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo ======================================
echo    INICIANDO SERVIDOR PYTHON 8000
echo ======================================
echo.

:: Cambia el directorio al del .bat
cd /d "%~dp0"

:: Abre el navegador (espera 1 segundo para que el server arranque)
start "" cmd /c "timeout /t 1 >nul && start http://localhost:8000"

:: Inicia el servidor
python -m http.server 8000

echo.
echo Servidor detenido.
pause

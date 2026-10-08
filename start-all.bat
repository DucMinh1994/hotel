@echo off
title Lumiere Hotel 3D System Launcher
echo ============================================================
echo   KHOI DONG HE THONG KHACH SAN 3D - LUMIERE HOTEL
echo ============================================================
echo.

echo [1/3] Khoi dong Backend Laravel (Port 8000)...
start "Laravel Backend (Port 8000)" cmd /k "cd backend && php -S 127.0.0.1:8000 -t public"

echo [2/3] Khoi dong Vue 3 Admin Studio (Port 3001)...
start "Vue 3 Admin Studio (Port 3001)" cmd /k "cd admin && npm run dev"

echo [3/3] Khoi dong Website Khach Hang (Port 3000)...
start "Client Website 3D (Port 3000)" cmd /k "npx serve -l 3000 ."

echo.
echo ============================================================
echo   CAC HE THONG DANG CHAY:
echo   - 1. Website Khach Hang 3D Tour:  http://localhost:3000/
echo   - 2. Vue 3 Admin Studio (Vite):   http://localhost:3001/
echo   - 3. Backend Quan Ly Dat Phong:   http://127.0.0.1:8000/bookings
echo   - 4. Backend Xem Chi Tiet 360:    http://127.0.0.1:8000/room-360
echo ============================================================
echo.
pause

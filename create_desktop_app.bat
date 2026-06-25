@echo off
echo ===================================================
echo     RYL JARVIS COCKPIT - DESKTOP SHORTCUT CREATOR
echo ===================================================
echo.
echo Dit script maakt een bureaublad-snelkoppeling die de AI Assistant 
echo opent als een standalone desktop-app (zonder adresbalk).
echo.

set TARGET_URL=http://localhost:3000/dashboard/ai-assistant
set SHORTCUT_PATH="%USERPROFILE%\Desktop\RYL Jarvis Cockpit.lnk"

powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT_PATH%'); $s.TargetPath = 'chrome.exe'; $s.Arguments = '--app=%TARGET_URL%'; $s.Description = 'RYL Jarvis AI Assistant (Hermes & Orion)'; $s.Save()"

echo Snelkoppeling succesvol aangemaakt op je Bureaublad:
echo %SHORTCUT_PATH%
echo.
echo Zorg ervoor dat de web-app lokaal draait en dubbelklik op de 
echo snelkoppeling op je bureaublad om de standalone interface te openen.
echo.
pause

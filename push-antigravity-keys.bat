@echo off
set TOKEN=vcp_6qPDMXz05nXSuHg5rZHBLW3sE8COLy4FglX4QmcrJONCGZ1PrV1qIeUh
set PROJECT=prj_4GFd92TmvpNXJRE0ijMl3L86AAqZ
set TEAM=team_y3XGuyGtuHCKkDaGN1OeLvUt
set URL=https://api.vercel.com/v10/projects/%PROJECT%/env?teamId=%TEAM%

echo [1/4] GEMINI_API_KEY_1...
curl -s -X POST %URL% -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d "{\"key\":\"GEMINI_API_KEY_1\",\"value\":\"AQ.Ab8RN6LEwMXMqGh5a3OHvfMUKk18vdqQ8B_KW8-s_hj55tL_kg\",\"type\":\"encrypted\",\"target\":[\"production\",\"preview\"]}"
echo.

echo [2/4] GEMINI_API_KEY_2...
curl -s -X POST %URL% -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d "{\"key\":\"GEMINI_API_KEY_2\",\"value\":\"AQ.Ab8RN6IVPP-rVicO3cBu1_4FdIsY-xg7spMyqKGkJ7934rwQdg\",\"type\":\"encrypted\",\"target\":[\"production\",\"preview\"]}"
echo.

echo [3/4] GEMINI_API_KEY_3...
curl -s -X POST %URL% -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d "{\"key\":\"GEMINI_API_KEY_3\",\"value\":\"AQ.Ab8RN6LUGYubY1IWoxWY0SQFG7_EdkdDdb3gAbHChaJXTVYfHw\",\"type\":\"encrypted\",\"target\":[\"production\",\"preview\"]}"
echo.

echo [4/4] GOOGLE_GENERATIVE_AI_API_KEY (primaire Gemini key)...
curl -s -X POST %URL% -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d "{\"key\":\"GOOGLE_GENERATIVE_AI_API_KEY\",\"value\":\"AQ.Ab8RN6LEwMXMqGh5a3OHvfMUKk18vdqQ8B_KW8-s_hj55tL_kg\",\"type\":\"encrypted\",\"target\":[\"production\",\"preview\"]}"
echo.

echo [DONE] Gemini keys toegevoegd aan Antigravity project.

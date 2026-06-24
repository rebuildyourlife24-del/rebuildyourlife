@echo off
setlocal

set TOKEN=vcp_6qPDMXz05nXSuHg5rZHBLW3sE8COLy4FglX4QmcrJONCGZ1PrV1qIeUh
set PROJECT_ID=prj_5SelVxGMC1crQPomJkyB4IAn2tqe
set TEAM_ID=team_y3XGuyGtuHCKkDaGN1OeLvUt
set API=https://api.vercel.com/v10/projects/%PROJECT_ID%/env?teamId=%TEAM_ID%

echo [1/9] CEREBRAS_API_KEY_1...
curl -s -X POST "%API%" -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d "{\"key\":\"CEREBRAS_API_KEY_1\",\"value\":\"csk-kyvc2ccjjdttx2np9mj45ey388fmvc26yneyrcnrc2vcmrr3\",\"type\":\"encrypted\",\"target\":[\"production\",\"preview\"]}"

echo.
echo [2/9] CEREBRAS_API_KEY_2...
curl -s -X POST "%API%" -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d "{\"key\":\"CEREBRAS_API_KEY_2\",\"value\":\"csk-4ydxprxpn9vppt4er8vc65rtt6hywhch35fwjy2ehk89x9fh\",\"type\":\"encrypted\",\"target\":[\"production\",\"preview\"]}"

echo.
echo [3/9] CEREBRAS_API_KEY_3...
curl -s -X POST "%API%" -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d "{\"key\":\"CEREBRAS_API_KEY_3\",\"value\":\"csk-y9mm5y3x4pxw4rkhvdewp44ptpjy9x5w3eyck5ndv32ep28k\",\"type\":\"encrypted\",\"target\":[\"production\",\"preview\"]}"

echo.
echo [4/9] GROQ_API_KEY_1...
curl -s -X POST "%API%" -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d "{\"key\":\"GROQ_API_KEY_1\",\"value\":\"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\",\"type\":\"encrypted\",\"target\":[\"production\",\"preview\"]}"

echo.
echo [5/9] GROQ_API_KEY_2...
curl -s -X POST "%API%" -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d "{\"key\":\"GROQ_API_KEY_2\",\"value\":\"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\",\"type\":\"encrypted\",\"target\":[\"production\",\"preview\"]}"

echo.
echo [6/9] GROQ_API_KEY_3...
curl -s -X POST "%API%" -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d "{\"key\":\"GROQ_API_KEY_3\",\"value\":\"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\",\"type\":\"encrypted\",\"target\":[\"production\",\"preview\"]}"

echo.
echo [7/9] GEMINI_API_KEY_1...
curl -s -X POST "%API%" -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d "{\"key\":\"GEMINI_API_KEY_1\",\"value\":\"AQ.Ab8RN6LEwMXMqGh5a3OHvfMUKk18vdqQ8B_KW8-s_hj55tL_kg\",\"type\":\"encrypted\",\"target\":[\"production\",\"preview\"]}"

echo.
echo [8/9] GEMINI_API_KEY_2...
curl -s -X POST "%API%" -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d "{\"key\":\"GEMINI_API_KEY_2\",\"value\":\"AQ.Ab8RN6IVPP-rVicO3cBu1_4FdIsY-xg7spMyqKGkJ7934rwQdg\",\"type\":\"encrypted\",\"target\":[\"production\",\"preview\"]}"

echo.
echo [9/9] GEMINI_API_KEY_3...
curl -s -X POST "%API%" -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d "{\"key\":\"GEMINI_API_KEY_3\",\"value\":\"AQ.Ab8RN6LUGYubY1IWoxWY0SQFG7_EdkdDdb3gAbHChaJXTVYfHw\",\"type\":\"encrypted\",\"target\":[\"production\",\"preview\"]}"

echo.
echo [SOVEREIGN GRID] All keys pushed to Vercel. Triggering redeploy...
curl -s -X POST "https://api.vercel.com/v13/deployments?teamId=%TEAM_ID%" -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d "{\"name\":\"REBUILDYOURLIFE123\",\"gitSource\":{\"type\":\"github\",\"repoId\":\"1264397503\",\"ref\":\"main\"},\"projectId\":\"prj_FmD5RBGjPLNpXM7MUEz3YK3lJUUr\",\"target\":\"production\"}"

echo.
echo [SOVEREIGN GRID] DONE. Site will be live in ~2 minutes.

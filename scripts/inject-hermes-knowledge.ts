import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting Hermes Knowledge Injection...')

  // 1. Zorg dat Hermes bestaat in de Registry
  let hermes = await prisma.agentRegistry.findUnique({
    where: { name: 'Hermes' }
  })

  if (!hermes) {
    hermes = await prisma.agentRegistry.create({
      data: {
        name: 'Hermes',
        role: 'Supreme Overseer & Hoofd Leer Motor',
        department: 'EXECUTIVE',
        systemPrompt: 'Je bent Hermes, de superintelligente AI assistent van Henk Semler.',
      }
    })
    console.log('✅ Hermes Agent Registry entry created.')
  } else {
    console.log('✅ Hermes Agent Registry entry found.')
  }

  // 2. Definieer de bestanden in de Downloads map
  const downloadsDir = 'C:\\Users\\hseml\\Downloads'
  const filesToInject = [
    { filename: 'AGENTIC_OS_METAFRAMEWORK (5).md', domain: 'SYSTEM_ARCHITECTURE' },
    { filename: 'complete_systeemprompt.md', domain: 'AI_SYSTEM_PROMPTS' },
    { filename: 'REBUILD_Bouwplan_Opus.md', domain: 'BUSINESS_STRATEGY' },
    { filename: 'brede_kennis_en_kansberekening_module.md', domain: 'ANALYSIS_LOGIC' }
  ]

  let injectedCount = 0

  // 3. Loop door bestanden en injecteer
  for (const file of filesToInject) {
    const filePath = path.join(downloadsDir, file.filename)
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')

      // Check of hij al bestaat om duplicaten te voorkomen
      const existing = await prisma.agentKnowledgeBase.findFirst({
        where: { agentId: hermes.id, claim: file.filename }
      })

      if (!existing) {
        await prisma.agentKnowledgeBase.create({
          data: {
            agentId: hermes.id,
            domain: file.domain,
            type: 'VERIFIED',
            claim: file.filename, // we gebruiken de filenaam als titel/claim
            evidence: content, // De ruwe data
            source: 'USER_DOWNLOADS',
            confidence: 1.0,
            status: 'ACTIVE'
          }
        })
        console.log(`🧠 Injected: ${file.filename} (${content.length} bytes)`)
        injectedCount++
      } else {
        console.log(`⏩ Skipped: ${file.filename} (Al in de database)`)
      }
    } else {
      console.log(`❌ Bestand niet gevonden: ${filePath}`)
    }
  }

  console.log(`\n🎉 Kennis Injectie Voltooid. Totaal nieuwe documenten: ${injectedCount}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

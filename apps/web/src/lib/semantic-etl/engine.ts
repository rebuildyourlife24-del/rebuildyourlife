import { generateObject, generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { UISpecSchema, UISpec } from './schemas';
import { PROMPT_TEMPLATE_A_SYSTEM, getPromptTemplateAUser, getPromptTemplateCRepair } from './prompts';

export interface ETLContext {
  datasetName: string;
  datasetDescription: string;
  userRoles: string[];
  taskGoal: string;
  branding: {
    companyName: string;
    primaryColor: string;
    accentColor: string;
  };
}

export interface ETLResult {
  success: boolean;
  spec?: UISpec;
  error?: string;
  metrics: {
    attempts: number;
    processingTimeMs: number;
    tokensUsed?: number;
  };
}

/**
 * Process raw data/context into a Sci-Fi UI Spec using Gemini and Zod validation.
 */
export async function processSemanticETL(context: ETLContext): Promise<ETLResult> {
  const startTime = Date.now();
  let attempts = 0;
  const maxRetries = 3;

  const systemMessage = PROMPT_TEMPLATE_A_SYSTEM;
  let userMessage = getPromptTemplateAUser(
    context.datasetDescription,
    context.userRoles.join(', '),
    context.taskGoal,
    context.branding.primaryColor,
    context.branding.accentColor
  );

  while (attempts < maxRetries) {
    attempts++;
    try {
      // Gebruik Vercel AI SDK generateObject met Zod schema
      const { object, usage } = await generateObject({
        model: google('gemini-1.5-pro'),
        schema: UISpecSchema,
        system: systemMessage,
        prompt: userMessage,
        temperature: 0.2, // Lage temp voor structuurbehoud
      });

      return {
        success: true,
        spec: object,
        metrics: {
          attempts,
          processingTimeMs: Date.now() - startTime,
          tokensUsed: usage?.totalTokens,
        }
      };

    } catch (error: any) {
      console.error(`[Semantic ETL] Attempt ${attempts} failed:`, error);
      
      // Als Zod faalt of de LLM foute JSON teruggeeft, voeden we de fout terug (Repair Prompt)
      if (attempts < maxRetries) {
        userMessage = getPromptTemplateCRepair(error.message || JSON.stringify(error));
      } else {
        // Fallback: Retourneer een veilige lege staat als het blijft falen
        return {
          success: false,
          error: `Failed to generate valid UI Spec after ${maxRetries} attempts: ${error.message}`,
          spec: getFallbackSpec(context),
          metrics: {
            attempts,
            processingTimeMs: Date.now() - startTime,
          }
        };
      }
    }
  }

  return {
    success: false,
    error: "Unknown error in Semantic ETL pipeline",
    metrics: { attempts, processingTimeMs: Date.now() - startTime }
  };
}

function getFallbackSpec(context: ETLContext): UISpec {
  return {
    schemaVersion: "1.0",
    pages: [{
      id: "error_fallback",
      title: "Systeemfout / Data te complex",
      panels: [{
        id: "fallback_panel",
        layout: { columns: 1, rows: 1 },
        components: [{
          id: "error_text",
          type: "Text",
          title: "Fout bij laden interface",
          position: { x: 0, y: 0 },
          size: { width: 1, height: 1 },
          style: { backgroundColor: "#111", colorScheme: ["#ff0000"] },
        }]
      }]
    }],
    palette: {
      primary: context.branding.primaryColor,
      accent: context.branding.accentColor,
      background: "#000",
      text: "#fff"
    },
    fontTokens: { header: "sans-serif", body: "sans-serif" },
    accessibility: { keyboardNavigation: true }
  };
}

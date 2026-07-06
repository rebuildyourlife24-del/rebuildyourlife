import { z } from "zod";

export const InteractionSchema = z.object({
  event: z.enum(["click", "hover", "voice", "gesture", "autoRefresh", "onLoad"]),
  action: z.string(), // e.g. "openPanel", "updateFilter", "executeQuery"
  target: z.string().optional(), // id of component or page
  params: z.record(z.any()).optional()
});

export const DataBindingSchema = z.object({
  source: z.string(), // e.g. "salesDB.orders", "API.userMetrics"
  query: z.string(), // description or query
  updateInterval: z.string().optional() // e.g. "5m", "Realtime"
});

export const ComponentSchema = z.object({
  id: z.string(),
  type: z.string(), // e.g. "BarChart", "LineGraph", "PivotTable", "Text", "Button", "Map"
  title: z.string().optional(),
  position: z.object({ x: z.number(), y: z.number() }), // on the panel grid
  size: z.object({ width: z.number(), height: z.number() }),
  style: z.object({
    backgroundColor: z.string(),
    colorScheme: z.array(z.string()).optional(),
    opacity: z.number().min(0).max(1).optional(),
    font: z.object({ family: z.string(), size: z.number() }).optional(),
    neonGlow: z.boolean().optional()
  }),
  dataBinding: DataBindingSchema.optional(),
  interactions: z.array(InteractionSchema).optional()
});

export const PanelSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  layout: z.object({ columns: z.number(), rows: z.number() }),
  background: z.object({ color: z.string(), opacity: z.number().min(0).max(1) }).optional(),
  components: z.array(ComponentSchema)
});

export const UISpecSchema = z.object({
  schemaVersion: z.string(), // e.g. "1.0"
  pages: z.array(z.object({
    id: z.string(),
    title: z.string(),
    panels: z.array(PanelSchema)
  })),
  palette: z.object({
    primary: z.string(),
    accent: z.string(),
    background: z.string(),
    text: z.string()
  }),
  fontTokens: z.object({
    header: z.string(),
    body: z.string()
  }),
  animations: z.array(z.object({
    type: z.string(), // e.g. "fade", "slide", "pulse", "rotate3D"
    target: z.string(),
    duration: z.string()
  })).optional(),
  accessibility: z.object({
    ariaLabels: z.array(z.string()).optional(),
    keyboardNavigation: z.boolean()
  }),
  performanceBudget: z.object({
    maxRenderTimeMs: z.number(),
    maxDataLatencyMs: z.number()
  }).optional(),
  security: z.object({
    roles: z.array(z.string()),
    permissionsMapping: z.record(z.string(), z.array(z.string())) // componentId -> [roles]
  }).optional(),
  notes: z.string().optional()
});

export type UISpec = z.infer<typeof UISpecSchema>;

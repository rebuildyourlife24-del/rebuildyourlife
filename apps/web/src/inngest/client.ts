import { Inngest } from "inngest";

export const inngest = new Inngest({ 
  id: "rebuild-your-life-os",
  events: {} as any // We use any here temporarily to avoid missing types from the legacy packages
});

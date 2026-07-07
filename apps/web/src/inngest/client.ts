import { Inngest } from "inngest";

// Define the events that The Syndicate uses for asynchronous agent communication
type Events = {
  "agent/task.assigned": {
    data: {
      taskId: string;
      agentId: string;
      prompt: string;
      context?: any;
    };
  };
  "agent/task.completed": {
    data: {
      taskId: string;
      agentId: string;
      result: any;
    };
  };
  "agent/memory.stored": {
    data: {
      memoryId: string;
      agentId: string;
    };
  };
  "system/data.stream": {
    data: {
      platform: "shopify" | "instagram" | "linkedin" | "facebook" | "tiktok" | "snapchat" | "system";
      eventType: string;
      payload: any;
      timestamp: string;
    };
  };
};

export const inngest = new Inngest({ 
  id: "rebuild-your-life-os",
  events: {} as Events
});

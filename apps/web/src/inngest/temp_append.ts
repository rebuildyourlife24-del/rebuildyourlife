export const executeAgentTask = inngest.createFunction(
  { id: "execute-agent-task", name: "Execute Agent Task" },
  { event: "agent/task.assigned" },
  async ({ event, step }) => {
    const { taskId, agentId, prompt, context } = event.data;

    await step.run("mark-task-in-progress", async () => {
      await prisma.aiBountyTask.update({
        where: { id: taskId },
        data: { status: "IN_PROGRESS" }
      });
    });

    const llmResult = await step.run("generate-ai-response", async () => {
      const response = await generateText({
        model: openai("gpt-4o"),
        system: `You are agent ${agentId} inside The Syndicate. Context: ${JSON.stringify(context || {})}`,
        prompt: prompt,
      });
      return response.text;
    });

    await step.run("mark-task-completed", async () => {
      await prisma.aiBountyTask.update({
        where: { id: taskId },
        data: { 
          status: "COMPLETED",
          completedAt: new Date()
        }
      });
    });

    await step.sendEvent("send-completion-event", {
      name: "agent/task.completed",
      data: {
        taskId,
        agentId,
        result: llmResult
      }
    });

    return { success: true, result: llmResult };
  }
);

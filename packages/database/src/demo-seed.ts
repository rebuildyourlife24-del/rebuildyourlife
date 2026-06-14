import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Live Demo Data injection...");

  // Get the admin user
  const user = await prisma.user.findUnique({
    where: { email: 'hsemler50@gmail.com' }
  });

  if (!user) {
    console.error("No user found. Please register or run regular seed first.");
    return;
  }

  const userId = user.id;

  // 1. Create Goals
  console.log("Injecting Goals...");
  const goal1 = await prisma.goal.create({
    data: {
      userId,
      title: "Financiële Buffer Opbouwen",
      description: "€5000 noodfonds sparen voor onverwachte uitgaven",
      timeframe: "YEAR",
      status: "IN_PROGRESS",
      targetDate: new Date("2026-12-31T00:00:00Z"),
      progress: 35
    }
  });

  const goal2 = await prisma.goal.create({
    data: {
      userId,
      title: "Nieuwe Baan Vinden",
      description: "Een positie als senior developer bemachtigen",
      timeframe: "QUARTER",
      status: "IN_PROGRESS",
      targetDate: new Date("2026-09-30T00:00:00Z"),
      progress: 60
    }
  });

  // 2. Create Tasks
  console.log("Injecting Tasks...");
  await prisma.task.createMany({
    data: [
      { userId, goalId: goal1.id, title: "Budget app installeren", status: "COMPLETED", priority: "MEDIUM", completedAt: new Date(Date.now() - 86400000) },
      { userId, goalId: goal2.id, title: "CV updaten met nieuwste projecten", status: "COMPLETED", priority: "HIGH", completedAt: new Date(Date.now() - 40000000) },
      { userId, goalId: goal1.id, title: "Maandelijkse incasso instellen voor spaarrekening", status: "PENDING", priority: "HIGH", dueDate: new Date(Date.now() + 86400000) },
      { userId, goalId: goal2.id, title: "LinkedIn profiel optimaliseren", status: "IN_PROGRESS", priority: "MEDIUM", dueDate: new Date(Date.now() + 172800000) },
      { userId, title: "Wekelijkse reflectie met AI Life Coach", status: "PENDING", priority: "LOW", dueDate: new Date() }
    ]
  });

  // 3. Create Budget
  console.log("Injecting Budget...");
  const currentMonthStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const currentMonthDate = new Date(`${currentMonthStr}-01T00:00:00Z`);
  
  // Delete existing budget for this month to avoid duplicates
  await prisma.budget.deleteMany({ where: { userId, month: currentMonthDate } });

  await prisma.budget.create({
    data: {
      userId,
      month: currentMonthDate,
      totalIncome: 3850.00,
      totalExpenses: 0, // Calculated virtually
      savingsTarget: 400.00,
      categories: {
        create: [
          { name: "Huur/Hypotheek", planned: 1200, actual: 1200 },
          { name: "Boodschappen", planned: 450, actual: 280 },
          { name: "Vervoer", planned: 200, actual: 85 },
          { name: "Verzekeringen", planned: 150, actual: 150 },
          { name: "Ontspanning", planned: 150, actual: 210 } // Slightly over budget
        ]
      }
    }
  });

  // 4. Create Debts
  console.log("Injecting Debts...");
  await prisma.debt.deleteMany({ where: { userId } });
  await prisma.debt.createMany({
    data: [
      { userId, creditorName: "Dienst Uitvoering Onderwijs (DUO)", originalAmount: 18000, currentBalance: 14500, interestRate: 2.56, minimumPayment: 120, monthlyPayment: 150, priority: 1, status: "ACTIVE" },
      { userId, creditorName: "Creditcard (ICS)", originalAmount: 2500, currentBalance: 1850, interestRate: 14.0, minimumPayment: 50, monthlyPayment: 200, priority: 3, status: "ACTIVE" },
      { userId, creditorName: "Auto Lening", originalAmount: 8000, currentBalance: 5200, interestRate: 6.5, minimumPayment: 180, monthlyPayment: 180, priority: 2, status: "ACTIVE" }
    ]
  });

  // 5. Create Program
  console.log("Injecting Program...");
  await prisma.rebuildProgram.deleteMany({ where: { userId } });
  await prisma.rebuildProgram.create({
    data: {
      userId,
      name: "Financiële Vrijheid Blueprint 2026",
      description: "Een stap-voor-stap plan om uit de schulden te komen en rijkdom op te bouwen.",
      startDate: new Date(Date.now() - 30 * 86400000), // Started 30 days ago
      isActive: true,
      progress: 33,
      milestones: {
        create: [
          { title: "Alle schulden in kaart brengen", isCompleted: true, completedAt: new Date(Date.now() - 25 * 86400000), orderIndex: 1 },
          { title: "Noodfonds van €1000 opzetten", isCompleted: true, completedAt: new Date(Date.now() - 5 * 86400000), orderIndex: 2 },
          { title: "Creditcard volledig aflossen", isCompleted: false, orderIndex: 3 },
          { title: "Investeringsaccount openen", isCompleted: false, orderIndex: 4 }
        ]
      }
    }
  });

  // 6. Create Notifications
  console.log("Injecting Notifications...");
  await prisma.notification.createMany({
    data: [
      { userId, title: "Mijlpaal Bereikt!", message: "Je hebt de mijlpaal 'Noodfonds van €1000 opzetten' succesvol afgerond. Ga zo door!", actionUrl: "/dashboard/programs", isRead: false },
      { userId, title: "Herinnering van AI Life Coach", message: "Vergeet niet om deze week een kwartiertje in te plannen om je stressniveau te evalueren.", actionUrl: "/dashboard/ai-team", isRead: false }
    ]
  });

  console.log("Demo data injection complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

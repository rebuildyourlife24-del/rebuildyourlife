/**
 * Test script for verifying the Mollie integration.
 * This script will:
 * 1. Ensure a test user exists in the database.
 * 2. Simulate a mock webhook call to /api/mollie/webhook.
 * 3. Verify the user was updated correctly in the database.
 * 
 * Run with: npx ts-node scripts/test-mollie.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runTest() {
  console.log("=== START MOLLIE INTEGRATION TEST ===");

  // 1. Ensure test user exists
  const testEmail = "mollie-test-user@rebuildyourlife.eu";
  let user = await prisma.user.findUnique({
    where: { email: testEmail }
  });

  if (!user) {
    console.log(`Creating test user: ${testEmail}`);
    user = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash: "dummy_password_hash_for_test",
        firstName: "Mollie",
        lastName: "Tester",
        role: "USER",
        subscriptionTier: "FREE",
        subscriptionStatus: "INACTIVE",
        onboardingCompleted: false
      }
    });
  } else {
    // Reset test user to initial state
    console.log(`Resetting test user state: ${testEmail}`);
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionTier: "FREE",
        subscriptionStatus: "INACTIVE",
        onboardingCompleted: false,
        mollieCustomerId: null
      }
    });
  }

  console.log("Initial User State:", {
    id: user.id,
    email: user.email,
    tier: user.subscriptionTier,
    status: user.subscriptionStatus,
    mollieCustomerId: user.mollieCustomerId,
    onboardingCompleted: user.onboardingCompleted
  });

  // 2. Simulate Webhook Call
  // In development/mock mode, our webhook accepts a JSON payload containing userId, tier, and amount.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const webhookUrl = `${appUrl}/api/mollie/webhook`;
  
  console.log(`Sending mock webhook request to: ${webhookUrl}`);
  
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        paymentId: "tr_mock_test_omega_998877",
        userId: user.id,
        tier: "TECH",
        amount: "99.00"
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Webhook call failed (${response.status}): ${errText}`);
    }

    const result = await response.json();
    console.log("Webhook Response:", result);

    // 3. Verify changes in the Database
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    console.log("Updated User State in DB:", {
      id: updatedUser.id,
      email: updatedUser.email,
      tier: updatedUser.subscriptionTier,
      status: updatedUser.subscriptionStatus,
      mollieCustomerId: updatedUser.mollieCustomerId,
      onboardingCompleted: updatedUser.onboardingCompleted
    });

    // Check assertions
    if (updatedUser.subscriptionStatus === "ACTIVE" && 
        updatedUser.subscriptionTier === "TECH" && 
        updatedUser.onboardingCompleted === true &&
        updatedUser.mollieCustomerId === "cst_mock_omega_customer_12345") {
      console.log("✅ TEST SUCCESSFUL: Database updated correctly!");
    } else {
      console.error("❌ TEST FAILED: Database state does not match expected output.");
    }

    // 4. Verify Welcome Notification was created
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${notifications.length} notifications for test user.`);
    if (notifications.length > 0) {
      console.log("Latest Notification:", notifications[0]);
      console.log("✅ TEST SUCCESSFUL: Welcome notification created!");
    } else {
      console.error("❌ TEST FAILED: Welcome notification not found.");
    }

  } catch (error) {
    console.error("Error during test:", error);
  } finally {
    await prisma.$disconnect();
    console.log("=== END MOLLIE INTEGRATION TEST ===");
  }
}

runTest();

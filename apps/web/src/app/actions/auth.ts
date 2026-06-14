"use server";

import { PrismaClient } from "@rebuildyourlife/database";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  return secret;
}

export async function loginAction(
  email: string,
  password: string,
  rememberMe: boolean = false
) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        error: "Ongeldig e-mailadres of wachtwoord.",
      };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return {
        success: false,
        error: "Ongeldig e-mailadres of wachtwoord.",
      };
    }

    const expiresIn = rememberMe ? "30d" : "24h";

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      getJwtSecret(),
      { expiresIn }
    );

    const cookieStore = await cookies();

    const cookieOptions: any = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    };

    if (rememberMe) {
      cookieOptions.maxAge = 30 * 24 * 60 * 60;
    }

    cookieStore.set("ryl_session", token, cookieOptions);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
      },
    };
  } catch (error: any) {
    console.error("Login action error:", error);

    return {
      success: false,
      error:
        "Debug Error: " +
        (error?.message || "Onbekende interne fout"),
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.delete("ryl_session");

  return {
    success: true,
  };
}

export async function registerAction(data: any) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      return {
        success: false,
        error: "Dit e-mailadres is al in gebruik.",
      };
    }

    const passwordHash = await bcrypt.hash(
      data.password,
      12
    );

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: "USER",
        subscriptionTier: "FREE",
      },
    });

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      getJwtSecret(),
      {
        expiresIn: "7d",
      }
    );

    (await cookies()).set(
      "ryl_session",
      token,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      }
    );

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
      },
    };
  } catch (error) {
    console.error(
      "Register action error:",
      error
    );

    return {
      success: false,
      error:
        "Er is een interne serverfout opgetreden.",
    };
  }
}

export async function getSessionAction() {
  const token =
    (await cookies()).get(
      "ryl_session"
    )?.value;

  if (!token) {
    return {
      success: false,
    };
  }

  try {
    const decoded = jwt.verify(
      token,
      getJwtSecret()
    ) as any;

    const user =
      await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      });

    if (!user) {
      return {
        success: false,
      };
    }

    return {
      success: true,
      user,
    };
  } catch {
    return {
      success: false,
    };
  }
}"use server";

import { PrismaClient } from "@rebuildyourlife/database";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  return secret;
}

export async function loginAction(
  email: string,
  password: string,
  rememberMe: boolean = false
) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        error: "Ongeldig e-mailadres of wachtwoord.",
      };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return {
        success: false,
        error: "Ongeldig e-mailadres of wachtwoord.",
      };
    }

    const expiresIn = rememberMe ? "30d" : "24h";

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      getJwtSecret(),
      { expiresIn }
    );

    const cookieStore = await cookies();

    const cookieOptions: any = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    };

    if (rememberMe) {
      cookieOptions.maxAge = 30 * 24 * 60 * 60;
    }

    cookieStore.set("ryl_session", token, cookieOptions);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
      },
    };
  } catch (error: any) {
    console.error("Login action error:", error);

    return {
      success: false,
      error:
        "Debug Error: " +
        (error?.message || "Onbekende interne fout"),
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.delete("ryl_session");

  return {
    success: true,
  };
}

export async function registerAction(data: any) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      return {
        success: false,
        error: "Dit e-mailadres is al in gebruik.",
      };
    }

    const passwordHash = await bcrypt.hash(
      data.password,
      12
    );

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: "USER",
        subscriptionTier: "FREE",
      },
    });

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      getJwtSecret(),
      {
        expiresIn: "7d",
      }
    );

    (await cookies()).set(
      "ryl_session",
      token,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      }
    );

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
      },
    };
  } catch (error) {
    console.error(
      "Register action error:",
      error
    );

    return {
      success: false,
      error:
        "Er is een interne serverfout opgetreden.",
    };
  }
}

export async function getSessionAction() {
  const token =
    (await cookies()).get(
      "ryl_session"
    )?.value;

  if (!token) {
    return {
      success: false,
    };
  }

  try {
    const decoded = jwt.verify(
      token,
      getJwtSecret()
    ) as any;

    const user =
      await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      });

    if (!user) {
      return {
        success: false,
      };
    }

    return {
      success: true,
      user,
    };
  } catch {
    return {
      success: false,
    };
  }
}"use server";

import { PrismaClient } from "@rebuildyourlife/database";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  return secret;
}

export async function loginAction(
  email: string,
  password: string,
  rememberMe: boolean = false
) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        error: "Ongeldig e-mailadres of wachtwoord.",
      };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return {
        success: false,
        error: "Ongeldig e-mailadres of wachtwoord.",
      };
    }

    const expiresIn = rememberMe ? "30d" : "24h";

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      getJwtSecret(),
      { expiresIn }
    );

    const cookieStore = await cookies();

    const cookieOptions: any = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    };

    if (rememberMe) {
      cookieOptions.maxAge = 30 * 24 * 60 * 60;
    }

    cookieStore.set("ryl_session", token, cookieOptions);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
      },
    };
  } catch (error: any) {
    console.error("Login action error:", error);

    return {
      success: false,
      error:
        "Debug Error: " +
        (error?.message || "Onbekende interne fout"),
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.delete("ryl_session");

  return {
    success: true,
  };
}

export async function registerAction(data: any) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      return {
        success: false,
        error: "Dit e-mailadres is al in gebruik.",
      };
    }

    const passwordHash = await bcrypt.hash(
      data.password,
      12
    );

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: "USER",
        subscriptionTier: "FREE",
      },
    });

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      getJwtSecret(),
      {
        expiresIn: "7d",
      }
    );

    (await cookies()).set(
      "ryl_session",
      token,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      }
    );

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
      },
    };
  } catch (error) {
    console.error(
      "Register action error:",
      error
    );

    return {
      success: false,
      error:
        "Er is een interne serverfout opgetreden.",
    };
  }
}

export async function getSessionAction() {
  const token =
    (await cookies()).get(
      "ryl_session"
    )?.value;

  if (!token) {
    return {
      success: false,
    };
  }

  try {
    const decoded = jwt.verify(
      token,
      getJwtSecret()
    ) as any;

    const user =
      await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      });

    if (!user) {
      return {
        success: false,
      };
    }

    return {
      success: true,
      user,
    };
  } catch {
    return {
      success: false,
    };
  }
}
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { NextResponse } from "next/server";
import config from "@/config";

export type AdminSession = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export const getAdminSession = async (): Promise<AdminSession | null> => {

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  if (session.user.email === config.ROOT_USER_EMAIL) {
    return { ...session, user: { ...session.user, role: "root" } } as AdminSession;
  }

  if (session.user.role !== "admin") {
    return null;
  }

  return session as AdminSession;
};

export const unauthorizedResponse = () => {
  return NextResponse.json(
    { success: false, error: "Unauthorized" },
    { status: 401 }
  );
};

export const forbiddenResponse = () => {
  return NextResponse.json(
    { success: false, error: "Forbidden - Admin access required" },
    { status: 403 }
  );
};

export const checkAdminSession = async (func: () => Promise<NextResponse>) => {
  const session = await getAdminSession();

  console.log("session: ", session)

  if (!session) {
    return unauthorizedResponse();
  }

  if (session.user.role === "user") {
    return forbiddenResponse();
  }

  return await func();
};
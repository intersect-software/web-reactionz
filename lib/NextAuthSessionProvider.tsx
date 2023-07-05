"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

const NextAuthProvider = ({ children }: { children?: React.ReactNode }) => (
  <SessionProvider>{children}</SessionProvider>
);
export default NextAuthProvider;

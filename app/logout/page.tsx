'use client';

import { logout } from "@/lib/actions/user";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    logout();
  }, []);
  
  return (
    <h1>Logging out...</h1>
  );
}
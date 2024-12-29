"use client"

import { RootState } from "@/data";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";


export default function Home() {

  const { replace: navigate } = useRouter();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth/login')
    } else {
      navigate('/dashboard')
    }
  }, [isLoggedIn, navigate])

  return null;
}

import { useEffect } from "react";

export function useKeepAlive() {
  useEffect(() => {
    // Ping ao servidor a cada 10 minutos para manter ativo
    const interval = setInterval(async () => {
      try {
        await fetch("/api/health");
      } catch (error) {
        console.error("Keep-alive ping failed:", error);
      }
    }, 10 * 60 * 1000); // 10 minutos

    return () => clearInterval(interval);
  }, []);
}

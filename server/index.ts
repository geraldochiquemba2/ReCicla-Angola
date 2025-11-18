import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Keep-alive function para evitar hibernação no Render
function setupKeepAlive(port: number) {
  const interval = 14 * 60 * 1000; // 14 minutos
  
  // Detectar URL baseado no ambiente
  const baseUrl = process.env.RENDER_EXTERNAL_URL 
    ? `${process.env.RENDER_EXTERNAL_URL}/api/health`
    : `http://localhost:${port}/api/health`;
  
  setInterval(async () => {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) {
        log(`✓ Keep-alive ping bem-sucedido: ${new Date().toLocaleString('pt-PT')}`);
      } else {
        log(`⚠ Keep-alive ping retornou status ${response.status}`);
      }
    } catch (error) {
      log(`✗ Keep-alive ping falhou: ${error instanceof Error ? error.message : error}`);
    }
  }, interval);
  
  log(`🔄 Sistema Keep-alive iniciado!`);
  log(`   → Ping a cada ${interval / 1000 / 60} minutos`);
  log(`   → URL: ${baseUrl}`);
}

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    
    // Inicializar keep-alive após 1 minuto
    setTimeout(() => {
      setupKeepAlive(port);
    }, 60000);
  });
})();

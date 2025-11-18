import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { loginSchema, type LoginData } from "@shared/schema";
import { ArrowLeft } from "lucide-react";
import logoIcon from "@assets/generated_images/ReCicla+_app_logo_icon_c8ba0c8a.png";
import heroImg from "@assets/generated_images/Hero_background_environmental_impact_b855236c.png";
import loginBgImg from "@assets/stock_images/clean_environment_na_cab6887e.jpg";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao fazer login");
      }

      const result = await response.json();
      login(result.user, result.token);
      toast({
        title: "Bem-vindo!",
        description: `Olá, ${result.user.fullName}`,
      });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar
        </Button>
      </div>
      
      <div className="flex flex-1">
        {/* Left side - Hero */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-background">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Impacto Ambiental"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 py-12">
          <div className="flex items-center gap-3 mb-8">
            <img src={logoIcon} alt="ReCicla+" className="h-12 w-12" />
            <h1 className="text-3xl font-bold">
              ReCicla<span className="text-primary">+</span> Angola
            </h1>
          </div>
          <h2 className="text-4xl font-bold mb-4 tracking-tight">
            Transforme resíduos em recompensas
          </h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Conecte-se com recicladores, ganhe pontos e contribua para um
            ambiente mais limpo e sustentável em Angola.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary">1.000+</p>
              <p className="text-sm text-muted-foreground">Utilizadores ativos</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary">5.000kg</p>
              <p className="text-sm text-muted-foreground">Resíduos reciclados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={loginBgImg}
            alt="Ambiente limpo"
            className="w-full h-full object-cover"
          />
        </div>
        <Card className="w-full max-w-md border-none shadow-none lg:border lg:shadow-sm relative z-10 bg-background/90 backdrop-blur-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-4 lg:hidden">
              <img src={logoIcon} alt="ReCicla+" className="h-8 w-8" />
              <span className="text-xl font-bold">
                ReCicla<span className="text-primary">+</span>
              </span>
            </div>
            <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de telefone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+244 923 456 789"
                          {...field}
                          data-testid="input-phone"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          data-testid="input-password"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  data-testid="button-login"
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Não tem uma conta? </span>
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={() => setLocation("/register")}
                data-testid="link-register"
              >
                Registar-se
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
}

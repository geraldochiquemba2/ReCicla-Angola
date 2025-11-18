import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { ArrowLeft } from "lucide-react";
import logoIcon from "@assets/generated_images/ReCicla+_app_logo_icon_c8ba0c8a.png";
import heroImg from "@assets/generated_images/Hero_background_environmental_impact_b855236c.png";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      password: "",
      fullName: "",
      userType: "gerador",
      phone: "",
      address: "",
    },
  });

  const onSubmit = async (data: InsertUser) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao criar conta");
      }

      const result = await response.json();
      login(result.user, result.token);
      toast({
        title: "Conta criada!",
        description: "Bem-vindo ao ReCicla+ Angola",
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
            Junte-se à revolução da reciclagem
          </h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Crie sua conta gratuitamente e comece a ganhar pontos por cada
            resíduo reciclado. Faça parte da mudança!
          </p>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="border-none shadow-none lg:border lg:shadow-sm">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <img src={logoIcon} alt="ReCicla+" className="h-8 w-8" />
                <span className="text-xl font-bold">
                  ReCicla<span className="text-primary">+</span>
                </span>
              </div>
              <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
              <CardDescription>
                Preencha os dados abaixo para criar sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="userType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de conta</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-user-type">
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="gerador">Gerador de Resíduos</SelectItem>
                            <SelectItem value="reciclador">Reciclador</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="João Silva"
                            {...field}
                            data-testid="input-fullname"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço (opcional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Luanda, Angola"
                            {...field}
                            data-testid="input-address"
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
                    data-testid="button-register"
                  >
                    {isLoading ? "Criando conta..." : "Criar conta"}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Já tem uma conta? </span>
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold"
                  onClick={() => setLocation("/login")}
                  data-testid="link-login"
                >
                  Entrar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>
  );
}

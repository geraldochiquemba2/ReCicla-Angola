import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { StatsCard } from "@/components/stats-card";
import { CollectionCard } from "@/components/collection-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import type { CollectionWithUsers, UserStats, PointTransaction, UpdateProfile } from "@shared/schema";
import { updateProfileSchema } from "@shared/schema";
import { User, Mail, Phone, MapPin, Award, TrendingUp, Package, Leaf, TreePine, Zap, Calendar, Edit } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import achievementImg from "@assets/generated_images/Achievement_celebration_graphic_b8f09fdd.png";
import backgroundImg from "@assets/pexels-pixabay-414807_1763482394364.jpg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

function EditProfileDialog({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { updateUser } = useAuth();

  const form = useForm<UpdateProfile>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      username: user?.username || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfile) => {
      const res = await apiRequest("PUT", "/api/user/profile", data);
      return await res.json();
    },
    onSuccess: (response) => {
      updateUser(response.user);
      toast({
        title: "Perfil atualizado",
        description: "As suas informações foram atualizadas com sucesso",
      });
      setOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar perfil",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UpdateProfile) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" data-testid="button-edit-profile">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Atualize as suas informações pessoais
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="input-fullname" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome de Utilizador</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="input-username" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} data-testid="input-email" />
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
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="input-phone" />
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
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="input-address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-testid="button-cancel"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                data-testid="button-save"
              >
                {updateProfileMutation.isPending ? "A guardar..." : "Guardar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function Profile() {
  const { user } = useAuth();

  const { data: stats, isLoading: isLoadingStats } = useQuery<UserStats>({
    queryKey: ["/api/stats"],
  });

  const { data: collections = [], isLoading: isLoadingCollections } = useQuery<CollectionWithUsers[]>({
    queryKey: ["/api/collections"],
  });

  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery<PointTransaction[]>({
    queryKey: ["/api/points/history"],
  });

  const userCollections = user?.userType === "gerador"
    ? collections.filter(c => c.generatorId === user.id)
    : collections.filter(c => c.recyclerId === user?.id);

  const completionRate = stats?.totalCollections
    ? Math.round(((stats?.completedCollections || 0) / stats.totalCollections) * 100)
    : 0;

  return (
    <div className="min-h-screen relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
      
      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Profile Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex justify-end mb-2">
                <EditProfileDialog user={user} />
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <User className="h-12 w-12 text-primary" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold" data-testid="text-fullname">
                      {user?.fullName}
                    </h1>
                    <Badge variant="default" className="w-fit">
                      {user?.userType === "gerador" ? "Gerador" : "Reciclador"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">@{user?.username}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {user?.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span data-testid="text-email">{user.email}</span>
                      </div>
                    )}
                    {user?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span data-testid="text-phone">{user.phone}</span>
                      </div>
                    )}
                    {user?.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span data-testid="text-address">{user.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center p-6 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Pontos Totais</p>
                  <p className="text-4xl font-bold text-primary" data-testid="text-total-points">
                    {user?.points || 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ≈ {((user?.points || 0) * 100).toLocaleString()} Kz
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {isLoadingStats ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </>
          ) : (
            <>
              <StatsCard
                title="Recolhas Totais"
                value={stats?.totalCollections || 0}
                subtitle={`${completionRate}% concluídas`}
                icon={Package}
              />
              <StatsCard
                title="Resíduos Reciclados"
                value={`${stats?.totalRecycled || 0} kg`}
                icon={Leaf}
              />
              <StatsCard
                title="CO₂ Evitado"
                value={`${stats?.environmentalImpact?.co2Saved || 0} kg`}
                icon={TrendingUp}
              />
              <StatsCard
                title="Árvores Equivalentes"
                value={stats?.environmentalImpact?.treesEquivalent || 0}
                icon={TreePine}
              />
            </>
          )}
        </div>

        {/* Environmental Impact */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Impacto Ambiental
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">CO₂ Evitado</span>
                  <span className="text-sm font-bold text-primary">
                    {stats?.environmentalImpact?.co2Saved || 0} kg
                  </span>
                </div>
                <Progress value={(stats?.environmentalImpact?.co2Saved || 0) / 10} />
                <p className="text-xs text-muted-foreground mt-1">Meta: 1000 kg</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Árvores Salvas</span>
                  <span className="text-sm font-bold text-primary">
                    {stats?.environmentalImpact?.treesEquivalent || 0}
                  </span>
                </div>
                <Progress value={(stats?.environmentalImpact?.treesEquivalent || 0) / 0.5} />
                <p className="text-xs text-muted-foreground mt-1">Meta: 50 árvores</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Energia Economizada</span>
                  <span className="text-sm font-bold text-primary">
                    {stats?.environmentalImpact?.energySaved || 0} kWh
                  </span>
                </div>
                <Progress value={(stats?.environmentalImpact?.energySaved || 0) / 10} />
                <p className="text-xs text-muted-foreground mt-1">Meta: 1000 kWh</p>
              </div>
            </div>

            {(stats?.environmentalImpact?.co2Saved || 0) > 100 && (
              <div className="mt-6 p-4 bg-primary/10 rounded-lg flex items-center gap-4">
                <img src={achievementImg} alt="Conquista" className="h-16 w-16" />
                <div>
                  <h4 className="font-semibold mb-1">Parabéns! 🎉</h4>
                  <p className="text-sm text-muted-foreground">
                    Você já evitou mais de 100kg de CO₂ no meio ambiente!
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="collections" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="collections" data-testid="tab-collections">
              Recolhas
            </TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-history">
              Histórico de Pontos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="collections" className="space-y-4">
            {isLoadingCollections ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            ) : userCollections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userCollections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12">
                  <div className="text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma recolha ainda</h3>
                    <p className="text-muted-foreground">
                      {user?.userType === "gerador"
                        ? "Crie seu primeiro pedido de recolha"
                        : "Aceite recolhas disponíveis para começar"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Transações</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingTransactions ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-16" />
                    ))}
                  </div>
                ) : transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            transaction.points > 0 ? 'bg-primary/10' : 'bg-destructive/10'
                          }`}>
                            <Award className={`h-5 w-5 ${
                              transaction.points > 0 ? 'text-primary' : 'text-destructive'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {format(new Date(transaction.createdAt), "dd MMM yyyy, HH:mm", { locale: ptBR })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className={`text-lg font-bold ${
                          transaction.points > 0 ? 'text-primary' : 'text-destructive'
                        }`}>
                          {transaction.points > 0 ? '+' : ''}{transaction.points} pts
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma transação ainda</h3>
                    <p className="text-muted-foreground">
                      Suas transações de pontos aparecerão aqui
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      </div>
    </div>
  );
}

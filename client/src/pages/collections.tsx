import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/header";
import { CollectionCard } from "@/components/collection-card";
import { MapView } from "@/components/map-view";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CollectionWithUsers } from "@shared/schema";
import { MapIcon, List, Plus } from "lucide-react";
import collectionsBackground from "@assets/pexels-pixabay-417328_1763479949559.jpg";

export default function Collections() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [view, setView] = useState<"map" | "list">("map");
  const [selectedTab, setSelectedTab] = useState("all");

  const { data: collections = [], isLoading } = useQuery<CollectionWithUsers[]>({
    queryKey: ["/api/collections"],
  });

  const acceptMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/collections/${id}/accept`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Recolha aceita!",
        description: "Você aceitou esta recolha com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível aceitar a recolha",
        variant: "destructive",
      });
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/collections/${id}/complete`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/points/history"] });
      toast({
        title: "Recolha concluída!",
        description: "Parabéns! Você ganhou pontos por esta recolha",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível concluir a recolha",
        variant: "destructive",
      });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/collections/${id}/cancel`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
      toast({
        title: "Recolha cancelada",
        description: "A recolha foi cancelada",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível cancelar a recolha",
        variant: "destructive",
      });
    },
  });

  const filterCollections = (status?: string) => {
    const nonCancelledCollections = collections.filter(c => c.status !== "cancelado");
    
    if (status === "all") return nonCancelledCollections;
    if (status === "mine") {
      return user?.userType === "gerador"
        ? nonCancelledCollections.filter(c => c.generatorId === user.id)
        : nonCancelledCollections.filter(c => c.recyclerId === user?.id);
    }
    return nonCancelledCollections.filter(c => c.status === status);
  };

  const filteredCollections = filterCollections(selectedTab);
  const availableCollections = filterCollections("disponivel");

  const getTabCount = (tab: string) => {
    return filterCollections(tab).length;
  };

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${collectionsBackground})`,
          backgroundPosition: 'center center'
        }}
      />
      <div className="fixed inset-0 bg-background/30 dark:bg-background/30" />
      
      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Recolhas</h1>
            <p className="text-muted-foreground">
              {user?.userType === "gerador"
                ? "Gerencie seus pedidos de recolha"
                : "Encontre e aceite recolhas próximas"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={view === "map" ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setView("map");
                  setSelectedTab("disponivel");
                }}
                data-testid="button-view-map"
              >
                <MapIcon className="h-4 w-4 mr-2" />
                Mapa
              </Button>
              <Button
                variant={view === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("list")}
                data-testid="button-view-list"
              >
                <List className="h-4 w-4 mr-2" />
                Lista
              </Button>
            </div>

            {user?.userType === "gerador" && (
              <Button onClick={() => setLocation("/new-collection")} data-testid="button-new-collection">
                <Plus className="h-4 w-4 mr-2" />
                Nova Recolha
              </Button>
            )}
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <div className="w-full overflow-x-auto">
            <TabsList className="w-full sm:w-auto inline-flex">
              <TabsTrigger value="all" data-testid="tab-all" className="flex-shrink-0">
                Todas
                <Badge variant="secondary" className="ml-2">
                  {getTabCount("all")}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="disponivel" data-testid="tab-available" className="flex-shrink-0">
                Disponíveis
                <Badge variant="secondary" className="ml-2">
                  {getTabCount("disponivel")}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="aceito" data-testid="tab-accepted" className="flex-shrink-0">
                Aceitas
                <Badge variant="secondary" className="ml-2">
                  {getTabCount("aceito")}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="concluido" data-testid="tab-completed" className="flex-shrink-0">
                Concluídas
                <Badge variant="secondary" className="ml-2">
                  {getTabCount("concluido")}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="mine" data-testid="tab-mine" className="flex-shrink-0">
                Minhas
                <Badge variant="secondary" className="ml-2">
                  {getTabCount("mine")}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={selectedTab}>
            {isLoading ? (
              <div className="space-y-4">
                {view === "map" ? (
                  <Skeleton className="h-[600px] w-full rounded-xl" />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Skeleton key={i} className="h-64" />
                    ))}
                  </div>
                )}
              </div>
            ) : filteredCollections.length > 0 ? (
              <>
                {view === "map" ? (
                  <div className="flex justify-center">
                    <MapView
                      collections={filteredCollections}
                      className="h-[600px] w-full max-w-5xl rounded-xl border"
                      userLocation={
                        user?.latitude && user?.longitude
                          ? [parseFloat(user.latitude), parseFloat(user.longitude)]
                          : undefined
                      }
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCollections.map((collection) => (
                      <CollectionCard
                        key={collection.id}
                        collection={collection}
                        showActions={
                          user?.userType === "reciclador" ||
                          collection.generatorId === user?.id
                        }
                        onAccept={
                          user?.userType === "reciclador" && collection.status === "disponivel"
                            ? (id) => acceptMutation.mutate(id)
                            : undefined
                        }
                        onComplete={
                          user?.userType === "reciclador" &&
                          collection.recyclerId === user.id &&
                          collection.status === "aceito"
                            ? (id) => completeMutation.mutate(id)
                            : undefined
                        }
                        onCancel={
                          collection.generatorId === user?.id &&
                          collection.status === "disponivel"
                            ? (id) => cancelMutation.mutate(id)
                            : undefined
                        }
                        isAccepting={acceptMutation.isPending}
                        isCompleting={completeMutation.isPending}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                title="Nenhuma recolha encontrada"
                description={
                  selectedTab === "mine"
                    ? "Você ainda não tem recolhas"
                    : "Não há recolhas nesta categoria no momento"
                }
                actionLabel={
                  user?.userType === "gerador" && selectedTab === "mine"
                    ? "Criar Recolha"
                    : undefined
                }
                onAction={
                  user?.userType === "gerador" && selectedTab === "mine"
                    ? () => setLocation("/new-collection")
                    : undefined
                }
              />
            )}
          </TabsContent>
        </Tabs>
        </main>
      </div>
    </div>
  );
}

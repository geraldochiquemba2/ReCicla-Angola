import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { MapView } from "@/components/map-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CollectionWithUsers } from "@shared/schema";
import { ArrowLeft, Filter, MapPin } from "lucide-react";
import { getWasteTypeLabel } from "@/components/waste-type-icon";
import { getProvinces, getMunicipalities } from "@shared/angola-locations";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import exploreMapBgImage from "@assets/pexels-pixabay-417328_1763480764126.jpg";

export default function ExploreMap() {
  const [, setLocation] = useLocation();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("");
  const [municipalities, setMunicipalities] = useState<string[]>([]);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: collections = [], isLoading } = useQuery<CollectionWithUsers[]>({
    queryKey: ["/api/collections"],
  });

  const acceptMutation = useMutation({
    mutationFn: async (collectionId: string) => {
      return await apiRequest("POST", `/api/collections/${collectionId}/accept`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
      toast({
        title: "Recolha aceita com sucesso!",
        description: "Pode agora agendar a recolha com o gerador",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao aceitar recolha",
        description: error.message || "Ocorreu um erro ao aceitar a recolha",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (selectedProvince) {
      const munis = getMunicipalities(selectedProvince);
      setMunicipalities(munis);
      setSelectedMunicipality("");
    } else {
      setMunicipalities([]);
      setSelectedMunicipality("");
    }
  }, [selectedProvince]);

  const nonCancelledCollections = collections.filter(c => c.status !== "cancelado");
  
  const filteredCollections = nonCancelledCollections.filter(collection => {
    // Filter by status
    if (selectedStatus !== "all" && collection.status !== selectedStatus) {
      return false;
    }
    
    // Filter by province
    if (selectedProvince && !collection.address?.includes(selectedProvince)) {
      return false;
    }
    
    // Filter by municipality
    if (selectedMunicipality && !collection.address?.includes(selectedMunicipality)) {
      return false;
    }
    
    return true;
  });

  const availableCount = nonCancelledCollections.filter(c => c.status === "disponivel").length;

  const handleAcceptCollection = useCallback((collection: CollectionWithUsers) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast({
        title: "Autenticação necessária",
        description: "Por favor, faça login como reciclador para aceitar recolhas",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    // Check if user is a recycler
    if (user?.userType !== "reciclador") {
      toast({
        title: "Acesso negado",
        description: "Apenas recicladores podem aceitar recolhas. Por favor, crie uma conta como reciclador.",
        variant: "destructive",
      });
      return;
    }

    // Accept the collection
    acceptMutation.mutate(collection.id);
  }, [isAuthenticated, user, acceptMutation, toast, setLocation]);

  return (
    <div className="min-h-screen relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${exploreMapBgImage})`,
          backgroundPosition: 'center center'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60" />
      
      <header className="fixed top-0 w-full bg-black/40 backdrop-blur-md border-b border-white/10 z-[9999]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            data-testid="button-back"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <main className="pt-20 relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-white" data-testid="text-title">
              Explorar Mapa de Recolhas
            </h1>
            <p className="text-white/90">
              Veja todos os pontos de recolha disponíveis em Angola
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-5/12">
              {isLoading ? (
                <Skeleton className="h-[400px] w-full rounded-xl" />
              ) : (
                <MapView
                  collections={filteredCollections}
                  onAcceptClick={handleAcceptCollection}
                  className="h-[400px] w-full rounded-xl shadow-lg border"
                />
              )}
            </div>

            <div className="lg:w-7/12 space-y-4">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="h-5 w-5 text-white" />
                    <h3 className="font-semibold text-white">Filtros</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Status</label>
                      <div className="space-y-2">
                        <Button
                          variant={selectedStatus === "all" ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => setSelectedStatus("all")}
                          data-testid="filter-all"
                        >
                          Todas ({nonCancelledCollections.length})
                        </Button>
                        <Button
                          variant={selectedStatus === "disponivel" ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => setSelectedStatus("disponivel")}
                          data-testid="filter-available"
                        >
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                          Disponíveis ({availableCount})
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Província</label>
                      <div className="flex gap-2">
                        <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                          <SelectTrigger data-testid="select-province-filter">
                            <SelectValue placeholder="Todas as províncias" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {getProvinces().map((province) => (
                              <SelectItem key={province} value={province}>
                                {province}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedProvince && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedProvince("")}
                            data-testid="button-clear-province"
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    </div>

                    {selectedProvince && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Município</label>
                        <div className="flex gap-2">
                          <Select value={selectedMunicipality} onValueChange={setSelectedMunicipality}>
                            <SelectTrigger data-testid="select-municipality-filter">
                              <SelectValue placeholder="Todos os municípios" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {municipalities.map((municipality) => (
                                <SelectItem key={municipality} value={municipality}>
                                  {municipality}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {selectedMunicipality && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedMunicipality("")}
                              data-testid="button-clear-municipality"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {(selectedProvince || selectedMunicipality || selectedStatus !== "all") && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setSelectedProvince("");
                          setSelectedMunicipality("");
                          setSelectedStatus("all");
                        }}
                        data-testid="button-clear-filters"
                      >
                        Limpar Filtros
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 text-white">Legenda do Mapa</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500" />
                      <span className="text-white">Disponível para recolha</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-orange-500" />
                      <span className="text-white">Já aceito por reciclador</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {filteredCollections.length > 0 && (
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 text-white">Recolhas Recentes</h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {filteredCollections.slice(0, 5).map((collection) => (
                        <div
                          key={collection.id}
                          className="p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/20 hover-elevate cursor-pointer"
                          data-testid={`collection-${collection.id}`}
                        >
                          <div className="flex gap-3">
                            {collection.photoUrl && (
                              <img
                                src={collection.photoUrl}
                                alt={getWasteTypeLabel(collection.wasteType)}
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-sm text-white">
                                  {getWasteTypeLabel(collection.wasteType)}
                                </h4>
                                <Badge
                                  variant={collection.status === "disponivel" ? "default" : "secondary"}
                                >
                                  {collection.status}
                                </Badge>
                              </div>
                              {collection.generator && (
                                <div className="mb-2">
                                  <p className="text-xs font-medium text-white">
                                    {collection.generator.fullName}
                                  </p>
                                  <p className="text-xs text-white/70">
                                    {collection.generator.phone}
                                  </p>
                                </div>
                              )}
                              <div className="flex items-center gap-1 text-xs text-white/80">
                                <MapPin className="h-3 w-3" />
                                <span>{collection.address}</span>
                              </div>
                              <p className="text-xs text-white/70 mt-1">
                                {collection.quantity} kg
                              </p>
                              {collection.pointsGenerated > 0 && (
                                <p className="text-xs font-semibold text-green-400 mt-1">
                                  {collection.pointsGenerated} pontos
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Card className="bg-black/60 backdrop-blur-md border-white/10">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-white">
                  Quer publicar ou recolher resíduos?
                </h2>
                <p className="mb-6 text-white/90">
                  Crie sua conta gratuitamente e comece a contribuir para um Angola mais sustentável
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={() => setLocation("/register")}
                    className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30"
                    data-testid="button-cta-register"
                  >
                    Criar Conta Grátis
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setLocation("/login")}
                    className="border-white/30 text-white hover:bg-white/10"
                    data-testid="button-cta-login"
                  >
                    Já tenho conta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

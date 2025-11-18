import { useQuery } from "@tanstack/react-query";
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
import { useState, useEffect } from "react";

export default function ExploreMap() {
  const [, setLocation] = useLocation();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("");
  const [municipalities, setMunicipalities] = useState<string[]>([]);

  const { data: collections = [], isLoading } = useQuery<CollectionWithUsers[]>({
    queryKey: ["/api/collections"],
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

  const filteredCollections = collections.filter(collection => {
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

  const availableCount = collections.filter(c => c.status === "disponivel").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b z-[9999]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => setLocation("/login")}
              data-testid="button-login"
            >
              Entrar
            </Button>
            <Button
              onClick={() => setLocation("/register")}
              data-testid="button-register"
            >
              Registar-se
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-20">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" data-testid="text-title">
              Explorar Mapa de Recolhas
            </h1>
            <p className="text-muted-foreground">
              Veja todos os pontos de recolha disponíveis em Angola
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3">
              {isLoading ? (
                <Skeleton className="h-[600px] w-full rounded-xl" />
              ) : (
                <MapView
                  collections={filteredCollections}
                  className="h-[600px] w-full rounded-xl shadow-lg border"
                />
              )}
            </div>

            <div className="lg:w-1/3 space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Filtros</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <div className="space-y-2">
                        <Button
                          variant={selectedStatus === "all" ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => setSelectedStatus("all")}
                          data-testid="filter-all"
                        >
                          Todas ({collections.length})
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
                        <Button
                          variant={selectedStatus === "aceito" ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => setSelectedStatus("aceito")}
                          data-testid="filter-accepted"
                        >
                          <div className="w-3 h-3 rounded-full bg-orange-500 mr-2" />
                          Aceitos ({collections.filter(c => c.status === "aceito").length})
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Província</label>
                      <div className="flex gap-2">
                        <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                          <SelectTrigger data-testid="select-province-filter">
                            <SelectValue placeholder="Todas as províncias" />
                          </SelectTrigger>
                          <SelectContent>
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
                        <label className="text-sm font-medium">Município</label>
                        <div className="flex gap-2">
                          <Select value={selectedMunicipality} onValueChange={setSelectedMunicipality}>
                            <SelectTrigger data-testid="select-municipality-filter">
                              <SelectValue placeholder="Todos os municípios" />
                            </SelectTrigger>
                            <SelectContent>
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

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Legenda do Mapa</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500" />
                      <span>Disponível para recolha</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-orange-500" />
                      <span>Já aceito por reciclador</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-500" />
                      <span>Concluído ou cancelado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {filteredCollections.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Recolhas Recentes</h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {filteredCollections.slice(0, 5).map((collection) => (
                        <div
                          key={collection.id}
                          className="p-3 rounded-lg border hover-elevate cursor-pointer"
                          data-testid={`collection-${collection.id}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm">
                              {getWasteTypeLabel(collection.wasteType)}
                            </h4>
                            <Badge
                              variant={collection.status === "disponivel" ? "default" : "secondary"}
                            >
                              {collection.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{collection.address}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {collection.quantity} kg
                          </p>
                          {collection.pointsGenerated > 0 && (
                            <p className="text-xs font-semibold text-primary mt-1">
                              {collection.pointsGenerated} pontos
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">
                  Quer publicar ou recolher resíduos?
                </h2>
                <p className="mb-6 opacity-90">
                  Crie sua conta gratuitamente e comece a contribuir para um Angola mais sustentável
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => setLocation("/register")}
                    data-testid="button-cta-register"
                  >
                    Criar Conta Grátis
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setLocation("/login")}
                    className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
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

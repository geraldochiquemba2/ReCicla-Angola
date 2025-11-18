import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/header";
import { StatsCard } from "@/components/stats-card";
import { MapView } from "@/components/map-view";
import { CollectionCard } from "@/components/collection-card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import type { CollectionWithUsers, UserStats } from "@shared/schema";
import { Package, Leaf, Award, TrendingUp, ArrowRight } from "lucide-react";
import statsBackground1 from "@assets/stock_images/recycling_bins_waste_b9da8572.jpg";
import statsBackground2 from "@assets/stock_images/recycling_bins_waste_29917863.jpg";
import statsBackground3 from "@assets/stock_images/recycling_bins_waste_d7189b05.jpg";
import statsBackground4 from "@assets/stock_images/recycling_bins_waste_dfcca984.jpg";
import dashboardBackground from "@assets/pexels-singkham-178541-1108572_1763479730976.jpg";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: stats, isLoading: isLoadingStats } = useQuery<UserStats>({
    queryKey: ["/api/stats"],
    enabled: !!user,
  });

  const { data: collections = [], isLoading: isLoadingCollections } = useQuery<CollectionWithUsers[]>({
    queryKey: ["/api/collections"],
    enabled: !!user,
  });

  const availableCollections = collections.filter(c => c.status === "disponivel");
  const recentCollections = collections.slice(0, 3);

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${dashboardBackground})` }}
      />
      <div className="fixed inset-0 bg-background/30 dark:bg-background/30" />
      
      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-welcome">
            Olá, {user?.fullName}! 👋
          </h1>
          <p className="text-muted-foreground">
            {user?.userType === "gerador"
              ? "Gerencie seus pedidos de recolha e acompanhe seu impacto"
              : "Encontre recolhas próximas e ganhe pontos"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isLoadingStats ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </>
          ) : (
            <>
              <StatsCard
                title="Total de Pontos"
                value={stats?.totalPoints || 0}
                subtitle={`≈ ${((stats?.totalPoints || 0) * 100).toLocaleString()} Kz`}
                icon={Award}
                backgroundImage={statsBackground1}
              />
              <StatsCard
                title="Resíduos Reciclados"
                value={`${stats?.totalRecycled || 0} kg`}
                subtitle="Total acumulado"
                icon={Leaf}
                backgroundImage={statsBackground2}
              />
              <StatsCard
                title="Recolhas Totais"
                value={stats?.totalCollections || 0}
                subtitle={`${stats?.completedCollections || 0} concluídas`}
                icon={Package}
                backgroundImage={statsBackground3}
              />
              <StatsCard
                title="CO₂ Evitado"
                value={`${stats?.environmentalImpact?.co2Saved || 0} kg`}
                subtitle="Impacto ambiental"
                icon={TrendingUp}
                backgroundImage={statsBackground4}
              />
            </>
          )}
        </div>

        {/* Map Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              {user?.userType === "gerador" ? "Suas Recolhas" : "Recolhas Disponíveis"}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/collections")}
              data-testid="link-view-all"
            >
              Ver todas
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {isLoadingCollections ? (
            <Skeleton className="h-96 w-full rounded-xl" />
          ) : collections.length > 0 ? (
            <MapView
              collections={availableCollections}
              className="h-[500px] w-full rounded-xl border"
              userLocation={
                user?.latitude && user?.longitude
                  ? [parseFloat(user.latitude), parseFloat(user.longitude)]
                  : undefined
              }
            />
          ) : (
            <div className="border rounded-xl p-12">
              <EmptyState
                title="Nenhuma recolha ainda"
                description={
                  user?.userType === "gerador"
                    ? "Crie seu primeiro pedido de recolha e comece a ganhar pontos!"
                    : "Não há recolhas disponíveis no momento. Verifique novamente em breve."
                }
                actionLabel={user?.userType === "gerador" ? "Criar Recolha" : undefined}
                onAction={user?.userType === "gerador" ? () => setLocation("/new-collection") : undefined}
              />
            </div>
          )}
        </div>

        {/* Recent Collections */}
        {recentCollections.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Recolhas Recentes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentCollections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          </div>
        )}
        </main>
      </div>
    </div>
  );
}

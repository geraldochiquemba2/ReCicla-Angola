import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Recycle, Users, Award, MapPin, TrendingUp, Leaf } from "lucide-react";
import { useAuth } from "@/lib/auth";
import heroVideo from "@assets/9323702-uhd_3840_2160_24fps_1763477442263.mp4";
import cardImage1 from "@assets/stock_images/smartphone_taking_ph_42557168.jpg";
import cardImage2 from "@assets/stock_images/people_working_toget_e1e22104.jpg";
import cardImage3 from "@assets/stock_images/rewards_prizes_money_5dfcdf13.jpg";
import generatorBgImage from "@assets/stock_images/person_sorting_recyc_c62d4a9b.jpg";
import ctaBackgroundImage from "@assets/stock_images/recycling_sustainabi_076cfd4e.jpg";
import recyclerBgImage from "@assets/stock_images/recycling_workers_co_8e8551af.jpg";

interface PlatformStats {
  totalUsers: number;
  totalKgRecycled: number;
  totalCollections: number;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  const { data: stats } = useQuery<PlatformStats>({
    queryKey: ["/api/platform/stats"],
    retry: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-md border-b" 
          : "bg-transparent border-transparent"
      }`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2">
            <Recycle className={`h-8 w-8 transition-colors duration-300 ${
              isScrolled ? "text-primary" : "text-white"
            }`} />
            <h1 className={`text-2xl font-bold transition-colors duration-300 ${
              isScrolled ? "text-foreground" : "text-white"
            }`}>
              ReCicla<span className="text-primary">+</span> Angola
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                onClick={() => setLocation("/dashboard")}
                data-testid="button-dashboard"
              >
                Ir para Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setLocation("/login")}
                  className={isScrolled ? "" : "text-white hover:bg-white/10"}
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
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ 
              filter: 'brightness(0.7) blur(1px)',
              transform: 'scale(1.05)',
              width: '100%',
              height: '100%',
              imageRendering: 'crisp-edges'
            }}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 max-w-7xl text-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Transforme Resíduos em Recompensas
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
            Conecte-se com recicladores, ganhe pontos e contribua para um ambiente mais limpo e sustentável em Angola
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setLocation("/register")}
              className="bg-primary hover:bg-primary/90 border border-primary-border"
              data-testid="button-hero-register"
            >
              Começar Agora
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation("/login")}
              className="text-white border-white/30 bg-black/20 backdrop-blur-sm hover:bg-white/10"
              data-testid="button-hero-login"
            >
              Já tenho conta
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stats?.totalUsers || 0}</div>
              <div className="text-white/80">Usuários</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stats ? Math.round(stats.totalKgRecycled) : 0} kg
              </div>
              <div className="text-white/80">Reciclados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stats?.totalCollections || 0}
              </div>
              <div className="text-white/80">Recolhas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">21</div>
              <div className="text-white/80">Províncias</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Como Funciona</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Três passos simples para começar a reciclar e ganhar recompensas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover-elevate overflow-hidden relative">
              <div className="absolute inset-0">
                <img
                  src={cardImage1}
                  alt="Publique seus resíduos"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
              </div>
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">1. Publique seus Resíduos</h3>
                <p className="text-white/90">
                  Tire uma foto dos seus recicláveis, adicione detalhes e publique na plataforma para que recicladores próximos vejam
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate overflow-hidden relative">
              <div className="absolute inset-0">
                <img
                  src={cardImage2}
                  alt="Conecte-se com recicladores"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
              </div>
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">2. Conecte-se com Recicladores</h3>
                <p className="text-white/90">
                  Recicladores profissionais aceitam seus pedidos e agendam a recolha de forma rápida e conveniente
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate overflow-hidden relative">
              <div className="absolute inset-0">
                <img
                  src={cardImage3}
                  alt="Ganhe pontos e recompensas"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
              </div>
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">3. Ganhe Pontos e Recompensas</h3>
                <p className="text-white/90">
                  Acumule pontos por cada recolha concluída e troque por prémios ou dinheiro
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={generatorBgImage}
            alt="Geradores de resíduos"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/60" />
        </div>
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Para Geradores de Resíduos
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Transforme o que você não precisa em valor. Nossa plataforma facilita a conexão com recicladores profissionais que recolhem seus resíduos e você ainda ganha pontos por contribuir para um planeta mais limpo.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm mt-0.5">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-white">Ganhe Pontos</h4>
                  <p className="text-white/80">Acumule pontos por cada kg reciclado</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm mt-0.5">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-white">Recolha no Local</h4>
                  <p className="text-white/80">Recicladores vão até você</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm mt-0.5">
                  <Leaf className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-white">Impacto Real</h4>
                  <p className="text-white/80">Acompanhe seu contributo ambiental</p>
                </div>
              </li>
            </ul>
            <Button
              size="lg"
              onClick={() => setLocation("/register")}
              className="bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20"
              data-testid="button-generator-register"
            >
              Começar como Gerador
            </Button>
          </div>
        </div>
      </section>

      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${recyclerBgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70" />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Para Recicladores
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Encontre oportunidades de recolha próximas, otimize suas rotas e aumente sua receita. Nossa plataforma conecta você diretamente com quem tem resíduos para reciclar.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 mt-0.5">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-white">Encontre Recolhas Próximas</h4>
                  <p className="text-white/80">Veja pedidos na sua área em tempo real</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 mt-0.5">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-white">Aumente sua Receita</h4>
                  <p className="text-white/80">Mais recolhas, mais lucro</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 mt-0.5">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-white">Comunidade Ativa</h4>
                  <p className="text-white/80">Conecte-se com milhares de geradores</p>
                </div>
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => setLocation("/register")}
                className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30"
                data-testid="button-recycler-register"
              >
                Começar como Reciclador
              </Button>
              <Button
                size="lg"
                onClick={() => setLocation("/explore-map")}
                className="bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20"
                data-testid="button-explore-map"
              >
                <MapPin className="h-5 w-5 mr-2" />
                Explorar Mapa
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${ctaBackgroundImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70" />
        
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Pronto para Fazer a Diferença?
          </h2>
          <p className="text-xl mb-12 text-white/90">
            Junte-se a milhares de angolanos que já estão transformando resíduos em recompensas
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
              onClick={() => setLocation("/login")}
              className="bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20"
              data-testid="button-cta-login"
            >
              Entrar
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-background border-t">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Recycle className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">ReCicla+ Angola</span>
              </div>
              <p className="text-muted-foreground">
                Transformando resíduos em recompensas por um Angola mais sustentável
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Como funciona</li>
                <li>Para Geradores</li>
                <li>Para Recicladores</li>
                <li>Impacto</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Sobre Nós</li>
                <li>Contacto</li>
                <li>Parcerias</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Privacidade</li>
                <li>Termos de Uso</li>
                <li>Cookies</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 ReCicla+ Angola. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

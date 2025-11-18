import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Recycle, Users, Award, MapPin, TrendingUp, Leaf } from "lucide-react";
import heroImage1 from "@assets/stock_images/people_recycling_pla_ca7df6ad.jpg";
import heroImage2 from "@assets/stock_images/people_recycling_pla_935b694a.jpg";
import heroImage3 from "@assets/stock_images/community_volunteers_a6207be6.jpg";
import heroImage4 from "@assets/stock_images/recycling_plastic_bo_2d700759.jpg";
import heroImage5 from "@assets/stock_images/recycling_plastic_bo_05892f92.jpg";
import heroImage6 from "@assets/stock_images/recycling_plastic_bo_f9238c6a.jpg";
import heroImage7 from "@assets/stock_images/recycling_plastic_bo_c2b84f71.jpg";
import heroImage8 from "@assets/stock_images/recycling_plastic_bo_2bce4b15.jpg";
import recyclingImage from "@assets/stock_images/people_recycling_pla_4826874a.jpg";
import natureImage from "@assets/stock_images/clean_environment_na_cab6887e.jpg";
import communityImage from "@assets/stock_images/community_volunteers_20ba1c74.jpg";

const heroImages = [
  heroImage1,
  heroImage2,
  heroImage3,
  heroImage4,
  heroImage5,
  heroImage6,
  heroImage7,
  heroImage8,
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
          </div>
        </div>
      </header>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Reciclagem em Angola ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
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
              className="text-lg px-8 py-6 h-auto bg-primary hover:bg-primary/90 border border-primary-border"
              data-testid="button-hero-register"
            >
              Começar Agora
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation("/login")}
              className="text-lg px-8 py-6 h-auto text-white border-white/30 bg-black/20 backdrop-blur-sm hover:bg-white/10"
              data-testid="button-hero-login"
            >
              Já tenho conta
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">10k+</div>
              <div className="text-white/80">Usuários Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">50k+</div>
              <div className="text-white/80">Kg Reciclados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">500+</div>
              <div className="text-white/80">Recolhas Diárias</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">18</div>
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
            <Card className="hover-elevate">
              <CardContent className="p-8">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">1. Publique seus Resíduos</h3>
                <p className="text-muted-foreground">
                  Tire uma foto dos seus recicláveis, adicione detalhes e publique na plataforma para que recicladores próximos vejam
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="p-8">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">2. Conecte-se com Recicladores</h3>
                <p className="text-muted-foreground">
                  Recicladores profissionais aceitam seus pedidos e agendam a recolha de forma rápida e conveniente
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="p-8">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">3. Ganhe Pontos e Recompensas</h3>
                <p className="text-muted-foreground">
                  Acumule pontos por cada recolha concluída e troque por prémios ou dinheiro
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Para Geradores de Resíduos
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Transforme o que você não precisa em valor. Nossa plataforma facilita a conexão com recicladores profissionais que recolhem seus resíduos e você ainda ganha pontos por contribuir para um planeta mais limpo.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 mt-0.5">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Ganhe Pontos</h4>
                    <p className="text-muted-foreground">Acumule pontos por cada kg reciclado</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 mt-0.5">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Recolha no Local</h4>
                    <p className="text-muted-foreground">Recicladores vão até você</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 mt-0.5">
                    <Leaf className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Impacto Real</h4>
                    <p className="text-muted-foreground">Acompanhe seu contributo ambiental</p>
                  </div>
                </li>
              </ul>
              <Button
                size="lg"
                onClick={() => setLocation("/register")}
                data-testid="button-generator-register"
              >
                Começar como Gerador
              </Button>
            </div>
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={recyclingImage}
                alt="Geradores de resíduos"
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Para Recicladores
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Encontre oportunidades de recolha próximas, otimize suas rotas e aumente sua receita. Nossa plataforma conecta você diretamente com quem tem resíduos para reciclar.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 mt-0.5">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Encontre Recolhas Próximas</h4>
                  <p className="text-muted-foreground">Veja pedidos na sua área em tempo real</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 mt-0.5">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Aumente sua Receita</h4>
                  <p className="text-muted-foreground">Mais recolhas, mais lucro</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 mt-0.5">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Comunidade Ativa</h4>
                  <p className="text-muted-foreground">Conecte-se com milhares de geradores</p>
                </div>
              </li>
            </ul>
            <Button
              size="lg"
              onClick={() => setLocation("/register")}
              data-testid="button-recycler-register"
            >
              Começar como Reciclador
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={natureImage}
            alt="Ambiente limpo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Nosso Impacto em Angola
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Juntos estamos criando um futuro mais sustentável
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-8 text-center">
                <Recycle className="h-12 w-12 text-white mx-auto mb-4" />
                <div className="text-4xl font-bold text-white mb-2">2.5 Ton</div>
                <div className="text-white/80">Plástico Reciclado</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-8 text-center">
                <Leaf className="h-12 w-12 text-white mx-auto mb-4" />
                <div className="text-4xl font-bold text-white mb-2">15k</div>
                <div className="text-white/80">Árvores Salvas</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-8 text-center">
                <Award className="h-12 w-12 text-white mx-auto mb-4" />
                <div className="text-4xl font-bold text-white mb-2">500k</div>
                <div className="text-white/80">Pontos Distribuídos</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto para Fazer a Diferença?
          </h2>
          <p className="text-xl mb-12 opacity-90">
            Junte-se a milhares de angolanos que já estão transformando resíduos em recompensas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setLocation("/register")}
              className="text-lg px-8 py-6 h-auto"
              data-testid="button-cta-register"
            >
              Criar Conta Grátis
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation("/login")}
              className="text-lg px-8 py-6 h-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
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

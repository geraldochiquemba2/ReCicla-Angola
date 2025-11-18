import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { insertCollectionSchema, type InsertCollection } from "@shared/schema";
import { WasteTypeIcon, getWasteTypeLabel } from "@/components/waste-type-icon";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MapPin, Package, FileText, Image, CheckCircle, ArrowLeft, Upload, X } from "lucide-react";
import { getProvinces, getMunicipalities, getCoordinates } from "@shared/angola-locations";

const wasteTypes = ["plastico", "papel", "vidro", "metal", "eletronicos", "organico"] as const;

export default function NewCollection() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("");
  const [municipalities, setMunicipalities] = useState<string[]>([]);

  const form = useForm<InsertCollection>({
    resolver: zodResolver(insertCollectionSchema),
    defaultValues: {
      wasteType: "plastico",
      quantity: "",
      description: "",
      photoUrl: "",
      address: "",
      latitude: "-8.8383",
      longitude: "13.2344",
      generatorId: "",
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("photo", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Falha no upload da foto");
      }
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCollection) => {
      let photoUrl = data.photoUrl;
      
      if (photoFile) {
        const uploadResult = await uploadMutation.mutateAsync(photoFile);
        photoUrl = uploadResult.url;
      }
      
      return apiRequest("POST", "/api/collections", { ...data, photoUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Recolha criada!",
        description: "Seu pedido foi publicado com sucesso",
      });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar a recolha",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCollection) => {
    if (step !== 3) {
      return;
    }
    createMutation.mutate(data);
  };

  const nextStep = async () => {
    if (step === 1) {
      const isValid = await form.trigger(["wasteType", "quantity"]);
      if (isValid) {
        setStep(step + 1);
      }
    } else if (step === 2) {
      if (!selectedProvince || !selectedMunicipality) {
        toast({
          title: "Localização incompleta",
          description: "Por favor, selecione a província e o município",
          variant: "destructive",
        });
        return;
      }
      setStep(step + 1);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview("");
    form.setValue("photoUrl", "");
  };

  useEffect(() => {
    if (selectedProvince) {
      const munis = getMunicipalities(selectedProvince);
      setMunicipalities(munis);
      setSelectedMunicipality("");
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedProvince && selectedMunicipality) {
      const coords = getCoordinates(selectedProvince, selectedMunicipality);
      if (coords) {
        form.setValue("latitude", coords.latitude);
        form.setValue("longitude", coords.longitude);
        form.setValue("address", `${selectedMunicipality}, ${selectedProvince}`);
      }
    }
  }, [selectedProvince, selectedMunicipality, form]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => setLocation("/dashboard")}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Nova Recolha</CardTitle>
            <CardDescription>
              Preencha os detalhes do resíduo que deseja disponibilizar
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`flex items-center justify-center h-10 w-10 rounded-full border-2 transition-all ${
                    s <= step ? 'border-primary bg-primary text-primary-foreground' : 'border-muted'
                  }`}>
                    {s < step ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="font-semibold">{s}</span>
                    )}
                  </div>
                  {s < 3 && (
                    <div className={`w-24 h-0.5 mx-2 ${
                      s < step ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} onKeyDown={(e) => {
                if (e.key === 'Enter' && step !== 3) {
                  e.preventDefault();
                  nextStep();
                }
              }} className="space-y-6">
                {/* Step 1: Tipo e Quantidade */}
                {step === 1 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="wasteType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Tipo de Resíduo
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-waste-type">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {wasteTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  <div className="flex items-center gap-2">
                                    <WasteTypeIcon type={type} />
                                    <span>{getWasteTypeLabel(type)}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Selecione o tipo de resíduo que deseja reciclar
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade (kg)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="5.0"
                              {...field}
                              data-testid="input-quantity"
                            />
                          </FormControl>
                          <FormDescription>
                            Peso estimado do resíduo em kilogramas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Descrição (opcional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Garrafas PET vazias, limpar e sem tampas..."
                              className="min-h-24"
                              {...field}
                              data-testid="input-description"
                            />
                          </FormControl>
                          <FormDescription>
                            Adicione detalhes sobre o estado e condição do resíduo
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormLabel className="flex items-center gap-2 mb-2">
                        <Image className="h-4 w-4" />
                        Foto do Resíduo (opcional)
                      </FormLabel>
                      
                      {!photoPreview ? (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                            id="photo-upload"
                            data-testid="input-photo-upload"
                          />
                          <label 
                            htmlFor="photo-upload" 
                            className="block border-2 border-dashed rounded-lg p-8 text-center hover-elevate active-elevate-2 cursor-pointer"
                          >
                            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-2">
                              Clique para fazer upload de uma foto
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG até 10MB
                            </p>
                          </label>
                        </div>
                      ) : (
                        <div className="relative rounded-lg overflow-hidden border">
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-full h-64 object-cover"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2"
                            onClick={removePhoto}
                            data-testid="button-remove-photo"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      
                      <p className="text-sm text-muted-foreground mt-2">
                        Adicione uma foto para ajudar os recicladores a identificar o resíduo
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 2: Localização */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <FormLabel className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4" />
                        Província
                      </FormLabel>
                      <Select
                        value={selectedProvince}
                        onValueChange={setSelectedProvince}
                      >
                        <SelectTrigger data-testid="select-province">
                          <SelectValue placeholder="Selecione a província" />
                        </SelectTrigger>
                        <SelectContent>
                          {getProvinces().map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground mt-2">
                        Selecione a província onde o resíduo está localizado
                      </p>
                    </div>

                    {selectedProvince && (
                      <div>
                        <FormLabel className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4" />
                          Município
                        </FormLabel>
                        <Select
                          value={selectedMunicipality}
                          onValueChange={setSelectedMunicipality}
                        >
                          <SelectTrigger data-testid="select-municipality">
                            <SelectValue placeholder="Selecione o município" />
                          </SelectTrigger>
                          <SelectContent>
                            {municipalities.map((municipality) => (
                              <SelectItem key={municipality} value={municipality}>
                                {municipality}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground mt-2">
                          Selecione o município onde o resíduo está localizado
                        </p>
                      </div>
                    )}

                    {selectedProvince && selectedMunicipality && (
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Endereço Complementar (opcional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Rua, Bairro, Número..."
                                {...field}
                                data-testid="input-address"
                              />
                            </FormControl>
                            <FormDescription>
                              Adicione detalhes específicos do local (rua, bairro, número)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="p-4 bg-primary/10 rounded-lg text-sm">
                      <p className="font-semibold mb-1">Localização selecionada:</p>
                      <p className="text-muted-foreground">
                        {selectedMunicipality && selectedProvince
                          ? `${selectedMunicipality}, ${selectedProvince}`
                          : "Selecione a província e município"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3: Resumo */}
                {step === 3 && (
                  <div className="space-y-6">
                    {/* Summary */}
                    <div className="p-6 bg-primary/10 rounded-lg space-y-3">
                      <h3 className="font-semibold mb-3">Resumo da Recolha</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tipo:</span>
                          <span className="font-medium flex items-center gap-1">
                            <WasteTypeIcon type={form.watch("wasteType")} className="h-4 w-4" />
                            {getWasteTypeLabel(form.watch("wasteType"))}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Quantidade:</span>
                          <span className="font-medium">{form.watch("quantity")} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Endereço:</span>
                          <span className="font-medium text-right max-w-xs line-clamp-1">
                            {form.watch("address")}
                          </span>
                        </div>
                        {photoPreview && (
                          <div className="pt-2 border-t">
                            <span className="text-muted-foreground block mb-2">Foto:</span>
                            <img
                              src={photoPreview}
                              alt="Preview do resíduo"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-muted-foreground">Pontos estimados:</span>
                          <span className="font-bold text-primary text-lg">
                            {Math.ceil(parseFloat(form.watch("quantity") || "0") * 10)} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-4">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                      className="flex-1"
                      data-testid="button-previous"
                    >
                      Anterior
                    </Button>
                  )}

                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex-1"
                      data-testid="button-next"
                    >
                      Próximo
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="flex-1"
                      data-testid="button-submit"
                    >
                      {createMutation.isPending ? "Finalizando..." : "Finalizar"}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

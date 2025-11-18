import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WasteTypeIcon, getWasteTypeLabel } from "@/components/waste-type-icon";
import type { CollectionWithUsers } from "@shared/schema";
import { MapPin, Calendar, User, Package, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CollectionCardProps {
  collection: CollectionWithUsers;
  onAccept?: (id: string) => void;
  onComplete?: (id: string) => void;
  onCancel?: (id: string) => void;
  showActions?: boolean;
  isAccepting?: boolean;
  isCompleting?: boolean;
}

const statusConfig = {
  disponivel: { label: "Disponível", variant: "default" as const, icon: Clock },
  aceito: { label: "Aceito", variant: "secondary" as const, icon: CheckCircle },
  concluido: { label: "Concluído", variant: "outline" as const, icon: CheckCircle },
  cancelado: { label: "Cancelado", variant: "destructive" as const, icon: XCircle },
};

export function CollectionCard({
  collection,
  onAccept,
  onComplete,
  onCancel,
  showActions = false,
  isAccepting = false,
  isCompleting = false,
}: CollectionCardProps) {
  const statusInfo = statusConfig[collection.status];
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="hover-elevate transition-all duration-300" data-testid={`card-collection-${collection.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <WasteTypeIcon type={collection.wasteType} className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg" data-testid="text-waste-type">
                {getWasteTypeLabel(collection.wasteType)}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                <Package className="h-3.5 w-3.5" />
                <span data-testid="text-quantity">{collection.quantity} kg</span>
              </div>
            </div>
          </div>
          <Badge variant={statusInfo.variant} className="flex items-center gap-1" data-testid="badge-status">
            <StatusIcon className="h-3.5 w-3.5" />
            {statusInfo.label}
          </Badge>
        </div>

        {collection.description && (
          <p className="text-sm text-muted-foreground mb-4" data-testid="text-description">
            {collection.description}
          </p>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1" data-testid="text-address">{collection.address}</span>
          </div>
          {collection.generator && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4 flex-shrink-0" />
              <span data-testid="text-generator">{collection.generator.fullName}</span>
            </div>
          )}
          {collection.recycler && (collection.status === "aceito" || collection.status === "concluido") && (
            <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-xs font-semibold text-green-800 dark:text-green-400 mb-1">
                Reciclador que aceitou:
              </p>
              <div className="flex items-center gap-2 text-green-900 dark:text-green-300">
                <User className="h-4 w-4 flex-shrink-0" />
                <div>
                  <p className="font-medium" data-testid="text-recycler-name">{collection.recycler.fullName}</p>
                  <p className="text-xs" data-testid="text-recycler-phone">{collection.recycler.phone}</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span data-testid="text-created-at">
              {format(new Date(collection.createdAt), "dd MMM yyyy, HH:mm", { locale: ptBR })}
            </span>
          </div>
        </div>

        {collection.photoUrl && (
          <div className="mt-4 rounded-lg overflow-hidden">
            <img
              src={collection.photoUrl}
              alt="Foto do resíduo"
              className="w-full h-48 object-cover"
              data-testid="img-photo"
            />
          </div>
        )}

        {collection.pointsGenerated > 0 && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg flex items-center justify-between">
            <span className="text-sm font-medium">Pontos</span>
            <span className="text-lg font-bold text-primary" data-testid="text-points">
              {collection.pointsGenerated} pts
            </span>
          </div>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="p-6 pt-0 flex gap-2">
          {collection.status === "disponivel" && onAccept && (
            <Button
              onClick={() => onAccept(collection.id)}
              disabled={isAccepting}
              className="flex-1"
              data-testid="button-accept"
            >
              {isAccepting ? "Aceitando..." : "Aceitar Recolha"}
            </Button>
          )}
          {collection.status === "aceito" && onComplete && (
            <Button
              onClick={() => onComplete(collection.id)}
              disabled={isCompleting}
              className="flex-1"
              data-testid="button-complete"
            >
              {isCompleting ? "Concluindo..." : "Concluir Recolha"}
            </Button>
          )}
          {collection.status === "disponivel" && onCancel && (
            <Button
              variant="outline"
              onClick={() => onCancel(collection.id)}
              className="flex-1"
              data-testid="button-cancel"
            >
              Cancelar
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { revokeConsent } from "@/app/actions/consent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Consent } from "@/types/consent";

interface ConsentManagementProps {
  userConsents: Consent[];
}

const consentTypeLabels: Record<string, string> = {
  registration: "Регистрация на сайте",
  contact: "Форма обратной связи",
  newsletter: "Рассылка новостей",
  lesson_booking: "Запись на занятие",
};

export function ConsentManagement({ userConsents }: ConsentManagementProps) {
  const [isPending, startTransition] = useTransition();

  const handleRevoke = (consentId: string) => {
    if (!confirm("Вы уверены, что хотите отозвать это согласие?")) return;

    startTransition(async () => {
      const result = await revokeConsent(consentId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const activeConsents = userConsents.filter((c) => c.isActive);
  const revokedConsents = userConsents.filter((c) => !c.isActive);

  return (
    <Card className="mb-6 border-amber-200 bg-amber-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          Управление вашими согласиями
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeConsents.length === 0 ? (
          <p className="text-sm text-slate-600">
            У вас нет активных согласий на обработку персональных данных.
          </p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Ниже перечислены ваши активные согласия. Вы можете отозвать любое
              из них в любой момент.
            </p>
            {activeConsents.map((consent) => (
              <div
                key={consent.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-lg border border-slate-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <p className="font-medium text-slate-800">
                      {consentTypeLabels[consent.consentType] ||
                        consent.consentType}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      v{consent.policyVersion}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    Дано:{" "}
                    {new Date(consent.consentDate).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                  onClick={() => handleRevoke(consent.id)}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-1" />
                      Отозвать
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}

        {revokedConsents.length > 0 && (
          <div className="pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-2">
              Отозванные согласия ({revokedConsents.length}):
            </p>
            <div className="space-y-2">
              {revokedConsents.slice(0, 3).map((consent) => (
                <div
                  key={consent.id}
                  className="flex items-center gap-2 text-xs text-slate-500"
                >
                  <XCircle className="w-3 h-3 text-slate-400" />
                  <span>
                    {consentTypeLabels[consent.consentType]} — отозвано{" "}
                    {consent.revokedAt &&
                      new Date(consent.revokedAt).toLocaleDateString("ru-RU")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

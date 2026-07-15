import { ConsentType } from "@/lib/generated/prisma/enums";
import type { Consent as PrismaConsent } from "@/lib/generated/prisma/client";
export type { ConsentType } from "@/lib/generated/prisma/client";
export interface Consent extends Omit<PrismaConsent, "consentType"> {
  consentType: ConsentType;
}

"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { verifyAdultAge } from "@/actions/age-verification";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AgeVerificationModalProps {
  children?: React.ReactNode;
}

export function AgeVerificationModal({ children }: AgeVerificationModalProps) {
  const tActions = useTranslations("global.actions");
  const tAlert = useTranslations("components.alerts.adult_content");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(!children);

  const handleConfirm = async () => {
    await verifyAdultAge();
    setIsOpen(false);
    router.refresh();
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (!children) router.back();
  };

  return (
    <AlertDialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      {children ? children : <div className="hidden" aria-hidden="true" />}

      <AlertDialog>
        <AlertDialogHeader>
          <AlertDialogTitle>{tAlert("title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {tAlert("description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onPress={handleCancel}>
            {tActions("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onPress={handleConfirm}>
            {tActions("confirm_over_18")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    </AlertDialogTrigger>
  );
}

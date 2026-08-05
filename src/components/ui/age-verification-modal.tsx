// components/ui/age-verification-modal.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  // Si NO hay children, se abre automáticamente (estado inicial true)
  const [isOpen, setIsOpen] = useState(!children);
  const router = useRouter();

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
          <AlertDialogTitle>Contenido para adultos</AlertDialogTitle>
          <AlertDialogDescription>
            Este contenido está clasificado para adultos y puede contener
            material explícito o violencia. ¿Confirmas que eres mayor de 18
            años?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onPress={handleCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onPress={handleConfirm}>
            Sí, soy mayor de 18 años
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    </AlertDialogTrigger>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { sileo } from "sileo";
import { useNetworkStatus } from "@/hooks/use-network-status";

interface NetworkNotifierProps {
  dictionary: {
    onlineTitle: string;
    onlineDescription: string;
    offlineTitle: string;
    offlineDescription: string;
  };
}

export function NetworkNotifier({ dictionary }: NetworkNotifierProps) {
  const isOnline = useNetworkStatus();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (isOnline) {
      sileo.success({
        title: dictionary.onlineTitle,
        description: dictionary.onlineDescription,
      });
    } else {
      sileo.error({
        title: dictionary.offlineTitle,
        description: dictionary.offlineDescription,
        duration: 8000,
      });
    }
  }, [isOnline, dictionary]);

  return null;
}

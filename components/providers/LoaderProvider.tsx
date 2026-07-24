"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Loader from "@/components/ui/Loader";

interface LoaderContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  withLoading: <T>(promise: Promise<T>) => Promise<T>;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export function useLoader() {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
}

function LoaderRouteTracker({ stopLoading }: { stopLoading: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // When the route actually changes (pathname or search parameters), we stop the loader
    stopLoading();
  }, [pathname, searchParams, stopLoading]);

  return null;
}

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const isInitialLoad = React.useRef(true);

  useEffect(() => {
    // Ensure the initial loading animation plays out before hiding
    const timer = setTimeout(() => {
      setIsLoading(false);
      isInitialLoad.current = false;
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const startLoading = () => setIsLoading(true);
  
  const stopLoading = () => {
    // Don't let route changes interrupt the initial loading sequence
    if (!isInitialLoad.current) {
      setIsLoading(false);
    }
  };

  const withLoading = async <T,>(promise: Promise<T>): Promise<T> => {
    startLoading();
    try {
      const result = await promise;
      return result;
    } finally {
      stopLoading();
    }
  };

  return (
    <LoaderContext.Provider value={{ isLoading, startLoading, stopLoading, withLoading }}>
      {children}
      <Loader isLoading={isLoading} />
      <Suspense fallback={null}>
        <LoaderRouteTracker stopLoading={stopLoading} />
      </Suspense>
    </LoaderContext.Provider>
  );
}

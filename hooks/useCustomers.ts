
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  initialCustomers,
  type Customer,
} from "@/data/customers";

const STORAGE_KEY = "nexora-customers";

export function useCustomers() {
  const [customers, setCustomersState] =
    useState<Customer[]>(initialCustomers);

  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Load customers from localStorage
  useEffect(() => {
    try {
      const savedCustomers = localStorage.getItem(STORAGE_KEY);

      if (savedCustomers !== null) {
        const parsedCustomers = JSON.parse(savedCustomers);

        if (Array.isArray(parsedCustomers)) {
          setCustomersState(parsedCustomers as Customer[]);
        }
      }
    } catch (error) {
      console.error("Error loading customers:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Save customers whenever the data changes
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(customers)
      );
    } catch (error) {
      console.error("Error saving customers:", error);
    }
  }, [customers, isLoaded]);

  // 3. Sync changes from other browser tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;

      if (event.newValue === null) {
        setCustomersState(initialCustomers);
        return;
      }

      try {
        const parsedCustomers = JSON.parse(event.newValue);

        if (Array.isArray(parsedCustomers)) {
          setCustomersState(parsedCustomers as Customer[]);
        }
      } catch (error) {
        console.error("Error syncing customers:", error);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // 4. Update customers
  const setCustomers = useCallback(
    (update: Customer[] | ((current: Customer[]) => Customer[])) => {
      setCustomersState(update);
    },
    []
  );

  return {
    customers,
    setCustomers,
    isLoaded,
  };
}

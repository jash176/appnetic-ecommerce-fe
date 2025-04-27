import { useCallback, useEffect, useState } from "react"
import { HomeLayout } from "../services/types"
import payloadClient, { createAuthenticatedClient } from "../payloadClient";
import { useAuthStore } from "@/store/authStore";
import { getStoreId } from "@/service/storeService";
export const useHomeLayout = () => {
  const store = getStoreId()
  const [data, setData] = useState<HomeLayout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { token } = useAuthStore();

  const fetchLayout = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const client = token
        ? createAuthenticatedClient(token)
        : payloadClient;
      const result = await client.collections.home_layouts.find({where: {store: {equals: store}}});
      setData(result.docs[0]);
    } catch (error) {
      console.error('Error fetching products:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [token])
  useEffect(() => {
    fetchLayout();
  }, [fetchLayout]);
  return { data, isLoading, isError, refetch: fetchLayout };
}
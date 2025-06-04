import { useEffect, useState } from "react";
import payloadClient from "../payloadClient";
import { PrivacyPolicy } from "../services/types";

export const usePrivacyPolicy = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState<PrivacyPolicy & {contentHTML: string}>();
  const [isLoading, setIsLoading] = useState(true);
  const fetchPrivacyPolicy = async () => {
    setIsLoading(true);
    try {
      const client = payloadClient;
      const response = await client.globals["privacy-policies"].get();
      if (response) {
        setPrivacyPolicy(response as any);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);
  return { privacyPolicy, isLoading, refetch: fetchPrivacyPolicy };
};

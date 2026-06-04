import { useSyncExternalStore } from "react";

/**
 * A custom hook to safely detect if the component is running on the client.
 * Use this to avoid Hydration Mismatch errors when accessing browser-only APIs.
 */
// Helper for React 19 to detect client-side without useEffect

const emptySubscribe = () => () => {};

export function useIsClient(): boolean {
  return useSyncExternalStore(
    emptySubscribe, // a function to register a callback
    () => true, // Client value
    () => false, // Server value (SSR)
  );
}

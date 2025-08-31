declare module "@gsap/react" {
  import { DependencyList } from "react";

  export function useGSAP(
    callback: () => void,
    deps?: DependencyList
  ): void;
}

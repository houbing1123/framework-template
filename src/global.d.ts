import { RouteObject } from "react-router";

interface ImportMeta {
  readonly hot?: {
    accept: (callback?: () => void) => void;
    acceptDeps: (deps: string[], callback: (modules: any[]) => void) => void;
    dispose: (callback: (data: any) => void) => void;
    data: any;
    on: (event: string, callback: (...args: any[]) => void) => void;
  };
}

interface Routes {
  path: string;
  component: string|RouteObject;
  children?: Route[];
}
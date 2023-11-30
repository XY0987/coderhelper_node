interface React {
  createElement: (
    type: string | Function,
    props?: object,
    ...children: any[]
  ) => any;
  Fragment: (props: object) => any;
  useState: <T>(initialState: T | (() => T)) => [T, (newValue: T) => void];
  useEffect: (effect: () => void, deps?: any[]) => void;
  useContext: <T>(context: React.Context<T>) => T;
  useRef: <T>(initialValue: T) => { current: T };
  useMemo: <T>(factory: () => T, deps?: any[]) => T;
  useCallback: <T>(callback: T, deps?: any[]) => T;
  useReducer: <S, A>(
    reducer: (state: S, action: A) => S,
    initialState: S,
  ) => [S, (action: A) => void];
  createContext: <T>(defaultValue: T) => React.Context<T>;
  useContext: <T>(context: React.Context<T>) => T;
  useState: <T>(initialState: T | (() => T)) => [T, (newValue: T) => void];
  useLayoutEffect: (effect: () => void, deps?: any[]) => void;
  useImperativeHandle: <T>(
    ref: React.Ref<T>,
    createHandle: () => T,
    deps?: any[],
  ) => void;
  useDebugValue: (value: any) => void;
  forwardRef: <T, P>(
    component: (props: P, ref: React.Ref<T>) => React.ReactNode,
  ) => (props: P) => React.ReactNode;
  memo: <T>(
    component: T,
    areEqual?: (prevProps: any, nextProps: any) => boolean,
  ) => T;
  lazy: <T>(factory: () => Promise<{ default: T }>) => T;
  Suspense: (props: { fallback: React.ReactNode }) => React.ReactNode;
  useState: <T>(initialState: T | (() => T)) => [T, (newValue: T) => void];
  useReducer: <S, A>(
    reducer: (state: S, action: A) => S,
    initialState: S,
  ) => [S, (action: A) => void];
  useMutationEffect: (effect: () => void, deps?: any[]) => void;
  useTransition: () => [boolean, (startPending: () => void) => void];
  useDeferredValue: <T>(value: T, config?: { timeoutMs: number }) => T;
  useTransition: () => [boolean, (startPending: () => void) => void];
  useTransition: () => [boolean, (startPending: () => void) => void];
  useDeferredValue: <T>(value: T, config?: { timeoutMs: number }) => T;
  useOpaqueIdentifier: () => any;
  useOpaqueIdentifier: () => any;
  useOpaqueIdentifier: () => any;
  useOpaqueIdentifier: () => any;
  useOpaqueIdentifier: () => any;
  useOpaqueIdentifier: () => any;
  useOpaqueIdentifier: () => any;
  useOpaqueIdentifier: () => any;
}

// react.d.ts

declare module JSX {
  interface Element {}
  interface IntrinsicElements {
    div: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >;
    span: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLSpanElement>,
      HTMLSpanElement
    >;
    // ... other HTML elements
  }
}

declare module 'react' {
  export = react;
}

declare var react: React;

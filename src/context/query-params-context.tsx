import queryString, { ParseOptions, StringifyOptions } from "query-string";
import { createContext, use, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";

type ContextProps<T extends object> = {
  getValue: (key: keyof T, fallbackValue: T[keyof T]) => T[keyof T];
  setQuery: (object: Partial<T>) => void;
  queryAsObject: Partial<T>;
  queryAsString: string;
};

type Props<T extends object> = {
  defaultValues?: Partial<T> | ((objectParams: Partial<T>) => Partial<T>);
  stringifyOptions?: StringifyOptions;
  parseOptions?: ParseOptions;
  children: React.ReactNode;
};

const Context = createContext<ContextProps<any> | undefined>(undefined);

export default function QueryParamProvider<T extends object>({
  stringifyOptions,
  defaultValues,
  parseOptions,
  children,
}: Props<T>) {
  const [query, handleSetQuery] = useSearchParams();
  const initialValues = useRef(defaultValues);
  const initialOptions = useRef({
    stringifyOptions: stringifyOptions ?? {
      arrayFormat: "separator",
      skipEmptyString: true,
      skipNull: true,
    },
    parseOptions: parseOptions ?? {
      arrayFormat: "separator",
      parseBooleans: true,
      parseNumbers: true,
    },
  });

  useEffect(() => {
    if (!initialValues.current) return;
    const parsed = queryString.parse(
      window.location.search,
      initialOptions.current.parseOptions
    );
    const newSearchParams = queryString.stringify(
      { ...initialValues.current, ...parsed },
      initialOptions.current.stringifyOptions
    );
    handleSetQuery(newSearchParams);
    initialValues.current = undefined;
  }, [handleSetQuery]);

  const queryAsObject = useMemo(() => {
    const parsedQuery = queryString.parse(
      query.toString(),
      initialOptions.current.parseOptions
    );
    return { ...initialValues.current, ...parsedQuery } as Partial<T>;
  }, [query]);

  const value: ContextProps<T> = useMemo(
    () => ({
      getValue: (key, fallbackValue) => {
        return queryAsObject[key] ?? fallbackValue;
      },
      setQuery: (object: Partial<T>) => {
        handleSetQuery((prev) => {
          const current = queryString.parse(
            prev.toString(),
            initialOptions.current.parseOptions
          );
          const merged = { ...current, ...object };
          Object.entries(merged).forEach(([key, value]) => {
            if (value === null || value === undefined) {
              delete merged[key];
            }
          });
          return queryString.stringify(
            merged,
            initialOptions.current.stringifyOptions
          );
        });
      },
      queryAsString: queryString.stringify(
        { ...initialValues.current, ...queryAsObject },
        initialOptions.current.stringifyOptions
      ),
      queryAsObject,
    }),
    [handleSetQuery, queryAsObject]
  );

  return <Context value={value}>{children}</Context>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useQueryParams<T extends object>() {
  const context = use(Context);
  if (!context) {
    throw new Error("Solo puede usarse dentro de QueryParamProvider");
  }
  return context as ContextProps<T>;
}

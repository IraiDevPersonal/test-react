import { useDebounce } from "@uidotdev/usehooks";
import React, { ChangeEventHandler } from "react";
import { useQueryParams } from "../context/query-params-context";
import { SearchFilters } from "../interfaces/search-filters";

const Page = () => {
  const { setQuery, getValue } = useQueryParams<SearchFilters>();
  return (
    <div
      style={{
        maxWidth: 700,
        marginLeft: "auto",
        marginRight: "auto",
        flexDirection: "column",
        display: "flex",
        gap: "2rem",
      }}
    >
      <select
        name="option"
        value={getValue("option", "")}
        onChange={(e) => setQuery({ option: e.target.value })}
      >
        <option value="">seleccione</option>
        <option value="1">opcion 1</option>
        <option value="2">opcion 2</option>
        <option value="3">opcion 3</option>
      </select>

      <ChildComponent />
    </div>
  );
};

export default Page;

let flag = false;
function ChildComponent() {
  const { setQuery, getValue } = useQueryParams<SearchFilters>();
  const [inputValue, setInputValue] = React.useState(getValue("name", ""));
  // const [isSearching, setIsSearching] = React.useState(false);
  const debouncedValue = useDebounce(inputValue, 300);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.target.value);
  };

  React.useEffect(() => {
    const search = () => {
      // setIsSearching(true);
      if (flag) {
        setQuery({ name: debouncedValue });
      }
      // setIsSearching(false);
    };

    search();
    flag = true;
  }, [debouncedValue, setQuery]);

  return (
    <div>
      <input
        type="text"
        name="name"
        value={inputValue}
        onChange={handleChange}
        // disabled={isSearching}
      />
    </div>
  );
}

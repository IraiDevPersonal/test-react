import { BrowserRouter, Route, Routes } from "react-router-dom";
import Page from "./componente/page";
import QueryParamProvider from "./context/query-params-context";
import { SearchFilters } from "./interfaces/search-filters";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <QueryParamProvider<SearchFilters>
              defaultValues={{
                name: "ignacio",
                option: "2",
              }}
            >
              <Page />
            </QueryParamProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

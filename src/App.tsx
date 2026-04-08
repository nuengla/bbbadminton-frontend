import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home";
import PlayingPage from "./pages/playing";
import SummaryPage from "./pages/summary";
import { ThemeProvider } from "@emotion/react";
import { customTheme } from "./theme";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/playing",
      element: <PlayingPage />,
    },
    {
      path: "/summary",
      element: <SummaryPage />,
    },
  ]);

  return (
    <div className="App">
      <ThemeProvider theme={customTheme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}

export default App;

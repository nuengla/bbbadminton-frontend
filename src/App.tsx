import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home";
import PlayingPage from "./pages/playing";
import SummaryPage from "./pages/summary";

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
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home";
import PlayingPage from "./pages/playing";

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
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

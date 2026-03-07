import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import Layout from "./components/Common/Layout";
import routes from "./routes/routes";

import { SidebarProvider } from "./context/SidebarContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

const renderRoutes = (routes) =>
  routes.map(({ path, element, children }, index) => (
    <Route
      key={path || index}
      path={path}
      element={<Layout>{element}</Layout>}
    >
      {children && renderRoutes(children)}
    </Route>
  ));

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <ThemeProvider>
        <AuthProvider>
          <SidebarProvider>
            <Routes>{renderRoutes(routes)}</Routes>
          </SidebarProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

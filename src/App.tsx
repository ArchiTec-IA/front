import { Routes, Route } from "react-router-dom";
import { PrivateLayout } from "./components/layouts/PrivateLayout";
import ProtectedRoute from "./components/ProtectedRoutes";
import { LoginPageComponent } from "./components/Login";
import { HomePage } from "./pages/HomePage";
import { IaPage } from "./pages/IaPage";
import { SplashComponent } from "./components/Splash";

const LoginPage = () => <LoginPageComponent />;
const RegisterPage = () => <h1>Registro (Rota Pública)</h1>;
const SplashPage = () => <SplashComponent />;

const HomePageComponent = () => <HomePage />;
const FoldersPage = () => <h1>Perfil (Rota Privada)</h1>;
const IaPageComponent = () => <IaPage />;

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/splash" element={<SplashPage />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/*"
          element={
            <PrivateLayout>
              <Routes>
                <Route path="/home" element={<HomePageComponent />} />
                <Route path="/folders" element={<FoldersPage />} />
                <Route path="/ia" element={<IaPageComponent />} />
              </Routes>
            </PrivateLayout>
          }
        />
      </Route>

      <Route path="*" element={<h1>404 - Não Encontrado</h1>} />
    </Routes>
  );
}

export default App;

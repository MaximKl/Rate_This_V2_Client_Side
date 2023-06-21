import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { MainPage } from './pages/MainPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ErrorPage } from './pages/ErrorPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useNavigation } from './hooks/use-navigation';
import { ProductPage } from './pages/ProductPage';
import 'moment/locale/uk';
import { ChatPage } from './pages/ChatPage';
import { ProfileProductPage } from './pages/ProfileProductPage';
import { AddProductPage } from './pages/AddProductPage';
import { DeveloperPage } from './pages/DeveloperPage';

const App: React.FC = () => {
  const { basePath, service, currentPath } = useNavigation();

  const footer = () => {
    if (service === 'chat') return [];
    if (
      currentPath.split('/').length === 3 &&
      (service === 'book' || service === 'film' || service === 'game')
    ) {
      return <Footer isStaticPage />;
    }
    if (currentPath.split('/').length === 4 && service === 'profile') {
      return <Footer isStaticPage />;
    }
    if (service === 'error') {
      return <Footer isStaticPage />;
    }
    return <Footer />;
  };

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path={basePath} element={<MainPage></MainPage>} />
          <Route
            path={`${basePath}/films/:id`}
            element={<ProductPage></ProductPage>}
          />
          <Route
            path={`${basePath}/books/:id`}
            element={<ProductPage></ProductPage>}
          />
          <Route
            path={`${basePath}/games/:id`}
            element={<ProductPage></ProductPage>}
          />
          <Route
            path={`${basePath}/profile/:name`}
            element={<ProfilePage></ProfilePage>}
          />
          <Route
            path={`${basePath}/profile/:name/:type/:id`}
            element={<ProfileProductPage></ProfileProductPage>}
          />
          <Route
            path={`${basePath}/games`}
            element={<ProductsPage></ProductsPage>}
          />
          <Route
            path={`${basePath}/films`}
            element={<ProductsPage></ProductsPage>}
          />
          <Route
            path={`${basePath}/books`}
            element={<ProductsPage></ProductsPage>}
          />
          <Route
            path={`${basePath}/add-product`}
            element={<AddProductPage></AddProductPage>}
          />
          <Route
            path={`${basePath}/developer/:id`}
            element={<DeveloperPage></DeveloperPage>}
          />
          <Route path={`${basePath}/chat`} element={<ChatPage></ChatPage>} />
          <Route path="*" element={<ErrorPage></ErrorPage>} />
        </Routes>
        {footer()}
      </BrowserRouter>
    </>
  );
};

export { App };

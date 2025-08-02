
import { Route, Routes, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotificationPage from './pages/NotificationPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import CallPage from './pages/CallPage.jsx';
import FriendsPage from "./pages/FriendsPage.jsx";
import PageLoader from './components/PageLoader.jsx';
import useAuthUser from './hooks/useAuthUser.js';
import Layout from './components/Layout.jsx';
import { useThemeStore } from './store/useThemeStore.js';
import './index.css'

import  { Toaster} from 'react-hot-toast'




const App = () => {
  //AXIOS (optional)
  // REACT QUERY TANSTACK QUERY (need for production grade application)
  // => need to fetch some data saves time, code
  
  const {isLoading, authUser} = useAuthUser();

  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = Boolean(authUser?.isOnboarded);

  if( isLoading ) return <PageLoader/>

  return (
    <div className="h-screen" data-theme={theme}>

      <Routes>
        <Route 
          path="/" 
            element={isAuthenticated && isOnboarded ? 
              ( 
                <Layout showSidebar={true}> {/* // only showSidebar also show it */}
                  <HomePage /> 
                </Layout>
              ) : ( 
                < Navigate to={ !isAuthenticated ? "/login" : "/onboarding"} /> 
              )
            } 
        />

        <Route 
          path="/signup" 
            element={
              !isAuthenticated? <SignupPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            } 
        />

        <Route 
          path="/login" 
            element={ 
              !isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            } 
        />

        <Route 
          path="/notifications" 
            element={
              isAuthenticated && isOnboarded ? (
                <Layout showSidebar={true}>
                  <NotificationPage /> 
                </Layout>
              ) : (
                <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />
              )
            }
        />

        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        
        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route 
          path="/friends" 
            element={
              isAuthenticated && isOnboarded ? (
                <Layout showSidebar>
                  <FriendsPage />
                </Layout>
              ): (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
        />
      </Routes>
      <Toaster/>
    </div>
  );
};

export default App;
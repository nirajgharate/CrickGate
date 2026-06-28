import "./App.css";
import Footer from "./components/footer.jsx";
import Navbar from "./components/navbar.jsx";
import Routers from "./routes/Routers.jsx";
import AIAssistant from "./components/common/AIAssistant.jsx";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  
  // Hide navbar, footer and bot assistant on signin/signup and portal selector pages
  const hideNavbarFooter = ['/', '/signin', '/Signup', '/signup', '/Signin','/forgot-password'].includes(location.pathname);

  return (
    <>
      {!hideNavbarFooter && <Navbar/>}
      <main className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
        <Routers />
      </main>
      {!hideNavbarFooter && <AIAssistant />}
      {!hideNavbarFooter && <Footer/>}
    </>
  );
}

export default App;
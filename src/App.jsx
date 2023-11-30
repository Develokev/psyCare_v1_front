import { AppRouters } from "./Routers/AppRouters";
import { FooterBar } from "./Home/Components/FooterBar";

export function App() {
  
  return (
    <>
      <main>
        <AppRouters />
      </main>

      <footer>
        <FooterBar />
      </footer>

    </>
  )
}

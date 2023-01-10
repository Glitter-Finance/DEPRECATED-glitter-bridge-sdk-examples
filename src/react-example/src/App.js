import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Algorand from "./views/Algorand";
import Home from "./views/Home";
import NotFound from "./views/NotFound";
import Solana from "./views/Solana";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/solana" element={<Solana />} />{" "}
          <Route path="/algorand" element={<Algorand />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

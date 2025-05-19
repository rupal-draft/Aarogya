import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { AnimationProvider } from "./context/Animation/AnimationContext.tsx"
import { ToastContainer } from "react-toastify"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AnimationProvider>
      <App />
      <ToastContainer />
    </AnimationProvider>
  </React.StrictMode>,
)

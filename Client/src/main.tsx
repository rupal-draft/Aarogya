import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { AnimationProvider } from "./context/Animation/AnimationContext.tsx"
import { ToastContainer } from "react-toastify"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { persistor, store } from "./redux/store.ts"
import { CartProvider } from "./context/Cart/CartContext.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <AnimationProvider>
      <CartProvider>
      <App />
      <ToastContainer /></CartProvider>
    </AnimationProvider></PersistGate></Provider>
  </React.StrictMode>,
)

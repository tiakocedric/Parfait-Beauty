import React from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCatalog from './components/ProductCatalog';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cart from './components/Cart';

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <section id="home">
            <Hero />
          </section>
          <ProductCatalog />
          <About />
          <Contact />
        </main>
        <Footer />
        <Cart />
      </div>
    </CartProvider>
  );
}

export default App;
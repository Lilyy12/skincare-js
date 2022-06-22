import React, { useState, useEffect } from 'react'
import { commerce } from './lib/commerce';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Products, Navbar, Cart, Checkout } from './components';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [order, setOrder] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  //the way to get item to the list from commerce js
  const fetchProducts = async () => {
    const { data } = await commerce.products.list();

    setProducts(data);
  }

  //the way to get cart from commerce js
  const fetchCart = async ( ) => {
    setCart(await commerce.cart.retrieve());
  }

  //handle and get data of current cart from commerce js
  const handleAddToCart = async (productId, quantity) => {
    const { cart } = await commerce.cart.add(productId, quantity);
    setCart(cart);
  }

  //update by update cart from cemmerce js
  const handleUpdateCartQty = async (productId, quantity) => {
    const {cart} = await commerce.cart.update(productId, { quantity });
    setCart(cart);
  }; 

  //update by remove item from cart 
  const handleRemoveFromCart = async (productId) => {
    const {cart} = await commerce.cart.remove(productId);
    setCart(cart);
  }

  //update cart by empty it all 
  const handleEmptyCart = async (productId) => {
    const {cart} = await commerce.cart.empty(productId);
    setCart(cart);
  }

  const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    try {
      const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);

      setOrder(incomingOrder);

      refreshCart();
    } catch (error) {
      setErrorMessage(error.data.error.message);
    }
  };

  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();

    setCart(newCart);
  };

  useEffect(() => {
    fetchProducts();
  },[]);

  console.log(cart);

  return (
    <Router>
      <div>
          <Navbar totalItems={cart.total_items}/>
          <Routes>
            <Route exact path="/" element={<Products products={products} onAddToCart={handleAddToCart} />} />
            <Route exact path="/cart" element={<Cart 
              cart={cart}
              handleUpdateCartQty ={handleUpdateCartQty}
              handleRemoveFromCart ={handleRemoveFromCart}
              handleEmptyCart ={handleEmptyCart}
            />} />
            <Route exact path="/checkout" element={<Checkout 
              cart={cart}
              order={order}
              onCaptureCheckout={handleCaptureCheckout}
              error={errorMessage}
             />} />
          </Routes>
      </div>
    </Router>
  )
}

export default App
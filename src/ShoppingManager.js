import React, { Component } from 'react';

import CartItem from './CartItem';
import CartItemList from './CartItemList';
import CartManager from './CartManager';
import Form from './Form';
import Product from './Product';
import EditForm from './EditForm';
import productData from './productData';
import logo from './logo.svg';
import './App.css';

class ShoppingManager extends Component {
  constructor() {
    super();

    this.state = {
      productData,
      cartItems: [],
    };
  }

  lastID = () => (this.state.productData[this.state.productData.length - 1].id)

  deleteProduct = (id) => {
    const updatedProducts = this.state.productData.filter(product => product.id !== id);
    this.setState({
      productData: updatedProducts,
    });
  }

  addProduct = (newProduct) => {
    newProduct.id = this.lastID() + 1;
    const updatedProducts = [...this.state.productData, newProduct];
    this.setState({
      productData: updatedProducts,
    });
  }

  editProduct = (id, productInfo) => {
    productInfo.id = Number(id);
    const newProductData = this.state.productData.map((product) => {
      if (product.id === id) { return productInfo; }
      return product;
    });

    this.setState({
      productData: newProductData,
    });
  }

  addToCart = (id) => {
    let cartItems;

    const remainingProducts = this.state.productData.map((product) => {
      if (product.id === id) {
        const newProduct = Object.assign({}, product);
        newProduct.quantity -= 1;
        return newProduct;
      }
      return product;
    });

    const toAddToCart = this.state.productData.find(product => product.id === id);
    const foundItem = this.state.cartItems.find(product => product.id === id);

    if (foundItem) {
      cartItems = this.state.cartItems.map((item) => {
        if (foundItem === item) {
          const itemCopy = Object.assign({}, item);
          itemCopy.quantity += 1;
          return itemCopy;
        }
        return item;
      });
    } else {
      const newItem = Object.assign({}, toAddToCart);
      newItem.quantity = 1;
      cartItems = this.state.cartItems.concat(newItem);
    }

    this.setState(prevState => ({
      // should we use prevState to calculate remainingProducts here? if so, any suggestions?
      productData: remainingProducts,
      cartItems,
    }));
  }

  removeFromCart = (id) => {
    const foundItem = this.state.cartItems.find((product) => {
      return product.id === id;
    });

    const newProducts = this.state.productData.map((product) => {
      if (id === product.id) {
        const productCopy = Object.assign({}, product);
        productCopy.quantity += foundItem.quantity; // should add the total quantity back from the same item
        return productCopy;
      } else {
        return product;
      }
    });

    const newCart = this.state.cartItems.filter((item) => {
      return item.id !== id
    })

    this.setState(prevState => {
      return {
        productData: newProducts,
        cartItems: newCart
      }
    })
  }

  checkout = () => {
    this.setState(prevState => {
      return {
        cartItems: []
      }
    })
  }

  render() {
    return (
    <main>
      <header className="header">
        <h1>Welcome to the Shop!</h1>
      </header>
      <ProductManager
        productData={this.state.productData}
        addToCart={this.addToCart}
        deleteProduct={this.deleteProduct}
        editProduct={this.editProduct}

      />

      <Form
        addProduct={this.addProduct}
      />
      <CartManager
        cartItems={this.state.cartItems}
        removeFromCart={this.removeFromCart}
        checkout={this.checkout}
      />
    </main>
    );
  }
}

class ProductManager extends Component {
  render () {
    return (
      <ProductList productData={this.props.productData}
                   addToCart={this.props.addToCart}
                   deleteProduct={this.props.deleteProduct}
                   editProduct={this.props.editProduct}
      />
    );
  }
}

class ProductList extends Component {
  render () {
    let products = this.props.productData.map((product, index) => {
                    return <Product key={product.title + '-' + index}
                                    id={product.id}
                                    title={product.title}
                                    price={product.price}
                                    quantity={product.quantity}
                                    addToCart={this.props.addToCart}
                                    deleteProduct={this.props.deleteProduct}
                                    editProduct={this.props.editProduct}
                           />
                   });
    return (
      <div>
        {products}
      </div>
    );
  }
}

export default ShoppingManager;
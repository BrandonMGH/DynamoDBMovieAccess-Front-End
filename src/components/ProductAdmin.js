import React, { Component, Fragment } from "react";
import Product from "./Product";
import axios from "axios";
const config = require("../config.json");

export default class ProductAdmin extends Component {
  state = {
    newproduct: {
      productname: "",
      id: "",
    },
    products: [],
  };

  handleAddProduct = async (id, event) => {
    event.preventDefault();
    // add call to AWS API Gateway add product endpoint here

    try {
      const baseUrl = config.api.invokeUrl;
      const intId = parseInt(id);
      const params = {
        id: intId,
        metaCritic: "70%",
        movie: this.state.newproduct.productname,
        releaseYear: 2018,
      };
      await axios.post(`${baseUrl}/movies/{id}`, params);
      this.setState({
        products: [...this.state.products, this.state.newproduct],
      });
      this.setState({ newproduct: { productname: "", id: "" } });
    } catch (err) {
      console.log(err);
    }
  };

  handleUpdateProduct = async (id, name) => {
    // add call to AWS API Gateway update product endpoint here
    try {
      const baseUrl = config.api.invokeUrl;
      const intId = parseInt(id);
      console.log(intId)
      const params = {
        id: intId,
        metaCritic: "70%",
        movie: name,
        releaseYear: 2000,
      };
      await axios.patch(`${baseUrl}/movies/${intId}`, params);
      const productToUpdate = [...this.state.products].find(
        (product) => product.id === id
      );
      const updatedProducts = [...this.state.products].filter(
        (product) => product.id !== id
      );
      productToUpdate.productname = name;
      updatedProducts.push(productToUpdate);
      this.setState({ products: updatedProducts });
    } catch (err) {
      console.log(err);
    }
  };

  handleDeleteProduct = async (id, event) => {
    event.preventDefault();
    // add call to AWS API Gateway delete product endpoint here
    try {
      const intId = parseInt(id);
      const baseUrl = config.api.invokeUrl;
      await axios.delete(`${baseUrl}/movies/${intId}`);
      const updatedProducts = [...this.state.products].filter(
        (product) => product.id !== intId
      );
      this.setState({ products: updatedProducts });
    } catch (err) {
      console.log(err);
    }
  };

  fetchProducts = async () => {
    // add call to AWS API Gateway to fetch products here
    // then set them in state
    try {
      const baseUrl = config.api.invokeUrl;
      const res = await axios.get(`${baseUrl}/movies`);
      this.setState({ products: res.data });
      console.log(this.state.products);
    } catch (err) {
      console.log(err);
    }
  };

  onAddProductNameChange = (event) =>
    this.setState({
      newproduct: { ...this.state.newproduct, productname: event.target.value },
    });
  onAddProductIdChange = (event) =>
    this.setState({
      newproduct: { ...this.state.newproduct, id: event.target.value },
    });

  componentDidMount = () => {
    this.fetchProducts();
  };

  render() {
    return (
      <Fragment>
        <section className="section">
          <div className="container">
            <h1>Product Admin</h1>
            <p className="subtitle is-5">
              Add and remove products using the form below:
            </p>
            <br />
            <div className="columns">
              <div className="column is-one-third">
                <form
                  onSubmit={(event) =>
                    this.handleAddProduct(this.state.newproduct.id, event)
                  }
                >
                  <div className="field has-addons">
                    <div className="control">
                      <input
                        className="input is-medium"
                        type="text"
                        placeholder="Enter name"
                        value={this.state.newproduct.productname}
                        onChange={this.onAddProductNameChange}
                      />
                    </div>
                    <div className="control">
                      <input
                        className="input is-medium"
                        type="text"
                        placeholder="Enter id"
                        value={this.state.newproduct.id}
                        onChange={this.onAddProductIdChange}
                      />
                    </div>
                    <div className="control">
                      <button
                        type="submit"
                        className="button is-primary is-medium"
                      >
                        Add product
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="column is-two-thirds">
                <div className="tile is-ancestor">
                  <div className="tile is-4 is-parent  is-vertical">
                    {this.state.products.map((product, index) => (
                      <Product
                        isAdmin={true}
                        handleUpdateProduct={this.handleUpdateProduct}
                        handleDeleteProduct={this.handleDeleteProduct}
                        name={product.movie}
                        id={product.id}
                        key={product.id}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}

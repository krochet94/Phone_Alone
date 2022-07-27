import React, { useEffect, useState } from "react";
import "../App.css";
import Product from "./product/Product";
import MetaData from "./layouts/MetaData";
import Loader from "./layouts/Loader";
import { getProducts } from "../actions/productActions";
import Pagination from "react-js-pagination";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { useLocation } from "react-router-dom";

//rc-slider initialization
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const location = useLocation();
  const brands = [
    "-",
    "Samsung",
    "Apple",
    "Huawei",
    "Xiaomi",
    "Oppo",
    "Vivo",
    "Motorola",
    "Lenovo",
    "LG",
    "Asus",
    "Realme",
    "Sony",
    "ZTE",
    "Nokia",
    "Poco",
    "Infinix",
    "Others",
  ];

  const [keyword, setKeyword] = useState(""); /* search variable*/
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageStatus, setCurrentPageStatus] = useState(true);
  const [price, setPrice] = useState([1, 100000]);
  const [brand, setBrand] = useState("");
  const [rating, setRating] = useState(0);
  const [memory, setMemory] = useState(0);
  const [storage, setStorage] = useState(0);

  const {
    loading,
    products,
    error,
    productCount,
    resPerPage,
    filteredProductCount,
  } = useSelector((state) => state.products);

  const reset = () => {
    setBrand("");
    //setPrice([1, 100000]);
    setRating(0);
    setMemory(0);
    setStorage(0);
  };

  useEffect(() => {
    if (error) {
      return alert.error(error);
    }
    if (location.state) {
      setKeyword(location.state.keyword);
    }
    if (currentPageStatus) {
      setCurrentPage(1);
    }
    if (keyword === "") {
      reset();
    }

    dispatch(
      getProducts(keyword, currentPage, price, brand, rating, memory, storage)
    );
    setCurrentPageStatus(true);
  }, [
    dispatch,
    alert,
    error,
    keyword,
    currentPage,
    price,
    brand,
    rating,
    memory,
    storage,
    location.state,
  ]);

  let count = productCount;
  if (keyword) {
    count = filteredProductCount;
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="container">
          <MetaData title={"Buy Smartphone Online"} />
          <h1 id="products_heading">Latest Products</h1>
          <section id="products" className="container mt-5">
            <div className="row">
              {keyword !== "" ? (
                <>
                  <div className="col-6 col-md-3 my-5">
                    <div className="px-3">
                      <Range
                        marks={{
                          1: "$1",
                          100000: "$100,000",
                        }}
                        min={1}
                        max={100000}
                        defaultValue={[1, 100000]}
                        tipFormatter={(value) => `$${value}`}
                        tipProps={{
                          placement: "top",
                          visible: true,
                        }}
                        value={price}
                        onChange={(price) => setPrice(price)}
                      />

                      <hr className="mt-5" />
                      <div className="mx-1 my-3">
                        <h4 className="mb-2">Brand</h4>
                        <select
                          className="form-control"
                          id="category_field"
                          value={brand}
                          onChange={(e) =>
                            e.target.value === "-"
                              ? setBrand("")
                              : setBrand(e.target.value)
                          }
                        >
                          {brands.map((brand) =>
                            brand === "-" ? (
                              <option key={brand} value={brand} selected>
                                {brand}
                              </option>
                            ) : (
                              <option key={brand} value={brand}>
                                {brand}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <hr />
                      <div className="mt-3 w-100">
                        <h4 className="mb-3">Rating</h4>
                        <div className="d-flex align-items-center h-100 justify-content-center">
                          <p className="h4">&ge;</p>
                          <select
                            className="form-control mx-3"
                            id="category_field"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                          >
                            {[0, 1, 2, 3, 4, 5].map((star) =>
                              star === 0 ? (
                                <option key={star} value={0} selected>
                                  {star}
                                </option>
                              ) : (
                                <option key={star} value={star * 2}>
                                  {star}
                                </option>
                              )
                            )}
                          </select>
                          <p className="text-warning h4">&#9733;</p>
                        </div>
                      </div>

                      <hr />
                      <div className="mt-3 w-100">
                        <h4 className="mb-3">Memory</h4>
                        <div className="d-flex align-items-center h-100 justify-content-center">
                          <p className="h4">&ge;</p>
                          <select
                            className="form-control mx-3"
                            value={memory}
                            onChange={(e) =>
                              e.target.value === "-"
                                ? setMemory(0)
                                : setMemory(e.target.value)
                            }
                          >
                            {["-", 1, 2, 4, 8, 16, 32, 64].map((ram) =>
                              ram === "-" ? (
                                <option key={ram} value={ram} selected>
                                  {ram}
                                </option>
                              ) : (
                                <option key={ram} value={ram}>
                                  {ram}
                                </option>
                              )
                            )}
                          </select>
                          <p className="h5">GB</p>
                        </div>

                        <h4 className="mb-3 mt-3">Storage</h4>
                        <div className="d-flex align-items-center h-100 justify-content-center">
                          <p className="h4">&ge;</p>
                          <select
                            className="form-control mx-3"
                            value={storage}
                            onChange={(e) =>
                              e.target.value === "-"
                                ? setStorage(0)
                                : setStorage(e.target.value)
                            }
                          >
                            {["-", 8, 16, 32, 64, 128, 256, 512, 1024].map(
                              (rom) =>
                                rom === "-" ? (
                                  <option key={rom} value={rom} selected>
                                    {rom}
                                  </option>
                                ) : (
                                  <option key={rom} value={rom}>
                                    {rom}
                                  </option>
                                )
                            )}
                          </select>
                          <p className="h5">GB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-9">
                    <div className="row">
                      {products &&
                        products.map((product) => (
                          <Product
                            key={product._id}
                            product={product}
                            col={4}
                          />
                        ))}
                    </div>
                  </div>
                </>
              ) : (
                /* home */
                products &&
                products.map((product) => (
                  <Product key={product._id} product={product} col={3} />
                ))
              )}
            </div>
          </section>

          {/* pagination function  */}
          {resPerPage < count && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resPerPage}
                totalItemsCount={count}
                onChange={(pageNumber) => {
                  setCurrentPageStatus(false);
                  setCurrentPage(pageNumber);
                }}
                nextPageText={">"}
                prevPageText={"<"}
                firstPageText={`<<`}
                lastPageText={">>"}
                itemClass="page-item"
                linkClass="page-link"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Home;

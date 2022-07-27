import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import {
  updateProduct,
  getProductDetails,
  clearErrors,
} from "../../actions/productActions";
import MetaData from "../layouts/MetaData";
import Sidebar from "./Sidebar";
import "../../App.css";

const UpdateProduct = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [updateData, setUpdateData] = useState(true);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [brand, setBrand] = useState("Samsung");
  const [specs, setSpecs] = useState({
    processor: "",
    memory: 0,
    storage: 0,
    display: 0,
    camera: {
      front: 0,
      rear: 0,
    },
    os: "",
  });
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(0);
  const [seller, setSeller] = useState("");
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]); //previous images uploaded
  const [imagesPreview, setImagesPreview] = useState([]);
  const { error, product } = useSelector((state) => state.productDetails);
  const { loading, error: updateError, isUpdated } = useSelector(
    (state) => state.product
  );
  const UPDATE_PRODUCT_RESET = "UPDATE_PRODUCT_RESET";
  const brands = [
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

  const onChange = (e) => {
    const files = Array.from(e.target.files);
    setImagesPreview([]);
    setImages([]);
    setOldImages([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", name);
    formData.set("price", price);
    formData.set("brand", brand);
    formData.set("specs", JSON.stringify(specs));
    formData.set("description", description);
    formData.set("stock", stock);
    formData.set("seller", seller);
    images.forEach((image) => {
      formData.append("images", image);
    });
    dispatch(updateProduct(product._id, formData));
  };

  useEffect(() => {
    if (product && product._id !== id) {
      dispatch(getProductDetails(id));
    } else {
      if(updateData){
        setUpdateData(false);
        dispatch(getProductDetails(id));
      }
      setName(product.name);
      setPrice(product.price);
      setBrand(product.brand);
      setSpecs(product.specs);
      setDescription(product.description);
      setSeller(product.seller);
      setStock(product.stock);
      setOldImages(product.images);
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      navigate("/admin/products");
      alert.success("Product updated successfully");
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }
  }, [dispatch, alert, error, updateError, isUpdated, product, id]);

  return (
    <>
      <MetaData title="Update Product - Admin" />
      <div className="row">
        <div className="col-12 col-md-3">
          <Sidebar />
        </div>
        <div className="col-12 col-md-9 px-5">
          <div className="wrapper my-5">
            <form
              className="shadow-lg"
              encType="multipart/form-data"
              onSubmit={submitHandler}
            >
              <h1 className="mb-4">Update Product</h1>

              <div className="form-group">
                <label htmlFor="name_field">Name</label>
                <input
                  type="text"
                  id="name_field"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="price_field">Price ($)</label>
                <input
                  type="number"
                  id="price_field"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="category_field">Brand</label>
                <select
                  className="form-control"
                  id="category_field"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                >
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              <label htmlFor="specs_field">Specs</label>
              <div className="shadow p-3 mb-3" id="specs_field">
                <div className="form-group">
                  <label htmlFor="processor_field">Processor</label>
                  <input
                    type="text"
                    id="processor_field"
                    className="form-control"
                    value={specs.processor}
                    name="processor"
                    onChange={(e) =>
                      setSpecs({
                        ...specs,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="memory_field">Memory (GB)</label>
                  <input
                    type="number"
                    id="memory_field"
                    className="form-control"
                    value={specs.memory}
                    name="memory"
                    onChange={(e) =>
                      setSpecs({
                        ...specs,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="storage_field">Storage (GB)</label>
                  <input
                    type="number"
                    id="storage_field"
                    className="form-control"
                    value={specs.storage}
                    name="storage"
                    onChange={(e) =>
                      setSpecs({
                        ...specs,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="display_field">Display (inches)</label>
                  <input
                    type="number"
                    id="display_field"
                    className="form-control"
                    value={specs.display}
                    name="display"
                    onChange={(e) =>
                      setSpecs({
                        ...specs,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="frontcam_field">Front (MP)</label>
                  <input
                    type="number"
                    id="frontcam_field"
                    className="form-control"
                    value={specs.camera.front}
                    name="front"
                    onChange={(e) =>
                      setSpecs({
                        ...specs, 
                        camera: { ...specs.camera, [e.target.name]: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rearcam_field">Rear (MP)</label>
                  <input
                    type="number"
                    id="rearcam_field"
                    className="form-control"
                    value={specs.camera.rear}
                    name="rear"
                    onChange={(e) =>
                      setSpecs({
                        ...specs,
                        camera: { ...specs.camera, [e.target.name]: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="os_field">OS</label>
                  <input
                    type="text"
                    id="os_field"
                    className="form-control"
                    value={specs.os}
                    name="os"
                    onChange={(e) =>
                      setSpecs({
                        ...specs,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description_field">Description</label>
                <textarea
                  className="form-control"
                  id="description_field"
                  rows="8"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="stock_field">Stock (units)</label>
                <input
                  type="number"
                  id="stock_field"
                  className="form-control"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="seller_field">Seller Name</label>
                <input
                  type="text"
                  id="seller_field"
                  className="form-control"
                  value={seller}
                  onChange={(e) => setSeller(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Images</label>

                <div className="custom-file">
                  <input
                    type="file"
                    name="product_images"
                    className="custom-file-input"
                    inputId="customFile2"
                    accept="images/*"
                    onChange={onChange}
                    multiple
                  />
                  <label className="custom-file-label" htmlFor="customFile2">
                    Choose Images
                  </label>
                </div>
                {oldImages.map((img) => (
                  <img
                    className="mt-3 me-2"
                    height="55"
                    src={img.url}
                    key={img.url}
                    alt={img.url}
                  />
                ))}
                {imagesPreview.map((img) => (
                  <img
                    className="mt-3 me-2"
                    height="55"
                    src={img}
                    key={img}
                    alt="Preview"
                  />
                ))}
              </div>

              <button
                id="login_button"
                type="submit"
                className="btn w-100 py-3"
                disabled={loading ? true : false}
              >
                UPDATE
              </button>
                  
              {/* <div className="form-group">
                <textarea
                  className="form-control"
                  rows="8"
                  value={JSON.stringify(specs)}
                ></textarea>
              </div>
 */}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateProduct;

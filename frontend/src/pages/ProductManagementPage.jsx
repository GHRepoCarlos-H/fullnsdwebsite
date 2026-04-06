import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  Table,
  Modal,
  Form,
  Spinner,
  Badge,
} from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";
import ToastMessage from "../components/ToastMessage";
import ConfirmModal from "../components/ConfirmModal";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

const initialFormState = {
  image: "",
  us: "",
  stockNumber: "",
  description: "",
  uom: "",
  pkgSize: "",
  vendorPartNumber: "",
  category: "",
};

function ProductManagementPage() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    productId: null,
    message: "",
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const canDelete = user && ["manager", "admin"].includes(user.role);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Error loading products",
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setSelectedFile(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      image: product.image || "",
      us: product.us || "",
      stockNumber: product.stockNumber || "",
      description: product.description || "",
      uom: product.uom || "",
      pkgSize: product.pkgSize || "",
      vendorPartNumber: product.vendorPartNumber || "",
      category: product.category || "",
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving || uploadingImage) return;
    setShowModal(false);
    setEditingProduct(null);
    setFormData(initialFormState);
    setSelectedFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0] || null);
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      setToast({
        show: true,
        message: "Please select an image first",
        variant: "danger",
      });
      return;
    }

    try {
      setUploadingImage(true);

      const formDataUpload = new FormData();
      formDataUpload.append("image", selectedFile);

      const response = await api.post("/upload", formDataUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData((prev) => ({
        ...prev,
        image: response.data.imageUrl,
      }));

      setToast({
        show: true,
        message: "Image uploaded successfully",
        variant: "success",
      });
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Error uploading image",
        variant: "danger",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        image: formData.image.trim(),
        us: formData.us.trim(),
        stockNumber: formData.stockNumber.trim(),
        description: formData.description.trim(),
        uom: formData.uom.trim(),
        pkgSize: formData.pkgSize.trim(),
        vendorPartNumber: formData.vendorPartNumber.trim(),
        category: formData.category.trim(),
      };

      if (!payload.stockNumber || !payload.description || !payload.category) {
        setToast({
          show: true,
          message: "Stock number, description, and category are required",
          variant: "danger",
        });
        return;
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        setToast({
          show: true,
          message: "Product updated successfully",
          variant: "success",
        });
      } else {
        await createProduct(payload);
        setToast({
          show: true,
          message: "Product created successfully",
          variant: "success",
        });
      }

      closeModal();
      await loadProducts();
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Error saving product",
        variant: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  const openDeleteConfirm = (productId) => {
    setConfirmModal({
      show: true,
      productId,
      message: "Are you sure you want to deactivate this product?",
    });
  };

  const closeDeleteConfirm = () => {
    if (saving) return;
    setConfirmModal({
      show: false,
      productId: null,
      message: "",
    });
  };

  const handleDeleteProduct = async () => {
    try {
      setSaving(true);
      await deleteProduct(confirmModal.productId);

      setToast({
        show: true,
        message: "Product deactivated successfully",
        variant: "success",
      });

      closeDeleteConfirm();
      await loadProducts();
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Error deleting product",
        variant: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <NavigationBar />

      <ToastMessage
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <ConfirmModal
        show={confirmModal.show}
        message={confirmModal.message}
        onCancel={closeDeleteConfirm}
        onConfirm={handleDeleteProduct}
      />

      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Product Management</h2>
            <p className="text-muted mb-0">
              Create, edit, and manage the active product catalog.
            </p>
          </div>

          <Button onClick={openCreateModal}>Add Product</Button>
        </div>

        <Card className="shadow-sm border-0">
          <Card.Body>
            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" />
                <div className="mt-2">Loading products...</div>
              </div>
            ) : products.length === 0 ? (
              <p className="mb-0">No active products found.</p>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Stock #</th>
                    <th>Category</th>
                    <th>Unit</th>
                    <th>Pkg Size</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="fw-semibold">{product.description}</div>
                      </td>
                      <td>{product.stockNumber}</td>
                      <td>{product.category}</td>
                      <td>{product.uom}</td>
                      <td>{product.pkgSize}</td>
                      <td>
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.description}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                        ) : (
                          <Badge bg="light" text="dark">
                            No Image
                          </Badge>
                        )}
                      </td>
                      <td className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => openEditModal(product)}
                        >
                          Edit
                        </Button>

                        {canDelete && (
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => openDeleteConfirm(product.id)}
                          >
                            Deactivate
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>

      <Modal show={showModal} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton={!saving && !uploadingImage}>
          <Modal.Title>
            {editingProduct ? "Edit Product" : "Add Product"}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSaveProduct}>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Label>Product Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  disabled={saving || uploadingImage}
                  onChange={handleFileChange}
                />

                <Button
                  className="mt-2"
                  size="sm"
                  type="button"
                  onClick={handleUploadImage}
                  disabled={uploadingImage || saving}
                >
                  {uploadingImage ? "Uploading..." : "Upload Image"}
                </Button>

                {formData.image && (
                  <>
                    <div className="mt-3">
                      <img
                        src={formData.image}
                        alt="Preview"
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                      />
                    </div>

                    <Form.Control
                      className="mt-2"
                      type="text"
                      value={formData.image}
                      readOnly
                    />
                  </>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <Form.Label>US</Form.Label>
                <Form.Control
                  type="text"
                  name="us"
                  value={formData.us}
                  disabled={saving}
                  onChange={handleChange}
                  placeholder="Enter US"
                />
              </div>

              <div className="col-md-6 mb-3">
                <Form.Label>Stock Number</Form.Label>
                <Form.Control
                  type="text"
                  name="stockNumber"
                  value={formData.stockNumber}
                  disabled={saving}
                  onChange={handleChange}
                  placeholder="Enter stock number"
                />
              </div>

              <div className="col-md-6 mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={formData.description}
                  disabled={saving}
                  onChange={handleChange}
                  placeholder="Enter description"
                />
              </div>

              <div className="col-md-6 mb-3">
                <Form.Label>UOM</Form.Label>
                <Form.Control
                  type="text"
                  name="uom"
                  value={formData.uom}
                  disabled={saving}
                  onChange={handleChange}
                  placeholder="Enter unit of measure"
                />
              </div>

              <div className="col-md-6 mb-3">
                <Form.Label>Package Size</Form.Label>
                <Form.Control
                  type="text"
                  name="pkgSize"
                  value={formData.pkgSize}
                  disabled={saving}
                  onChange={handleChange}
                  placeholder="Enter package size"
                />
              </div>

              <div className="col-md-6 mb-3">
                <Form.Label>Vendor Part Number</Form.Label>
                <Form.Control
                  type="text"
                  name="vendorPartNumber"
                  value={formData.vendorPartNumber}
                  disabled={saving}
                  onChange={handleChange}
                  placeholder="Enter vendor part number"
                />
              </div>

              <div className="col-md-6 mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={formData.category}
                  disabled={saving}
                  onChange={handleChange}
                  placeholder="Enter category"
                />
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              disabled={saving || uploadingImage}
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving || uploadingImage}>
              {saving
                ? "Saving..."
                : editingProduct
                ? "Update Product"
                : "Create Product"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default ProductManagementPage;
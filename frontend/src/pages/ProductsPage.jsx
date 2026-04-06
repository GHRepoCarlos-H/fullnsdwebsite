import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Form,
  Modal,
  Spinner,
} from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";
import ToastMessage from "../components/ToastMessage";
import api from "../services/api";
import { createCart, getMyCarts, addItemToCart } from "../services/cartService";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [myCarts, setMyCarts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedCartId, setSelectedCartId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [newCartTitle, setNewCartTitle] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  useEffect(() => {
    fetchProducts();
    fetchMyDraftCarts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Error loading products",
        variant: "danger",
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchMyDraftCarts = async () => {
    try {
      const carts = await getMyCarts();
      const draftCarts = carts.filter((cart) => cart.status === "draft");
      setMyCarts(draftCarts);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Error loading carts",
        variant: "danger",
      });
    }
  };

  const openAddToCartModal = (productId) => {
    setSelectedProductId(productId);
    setSelectedCartId("");
    setQuantity(1);
    setNewCartTitle("");
    setShowCartModal(true);
  };

  const handleCreateCartAndAdd = async () => {
    try {
      if (!newCartTitle.trim()) {
        setToast({
          show: true,
          message: "Please enter a cart title",
          variant: "danger",
        });
        return;
      }

      setModalLoading(true);

      const newCart = await createCart({
        title: newCartTitle,
        notes: "",
      });

      await addItemToCart(newCart.id, {
        productId: selectedProductId,
        quantity: Number(quantity),
      });

      setToast({
        show: true,
        message: "New cart created and item added successfully",
        variant: "success",
      });

      await fetchMyDraftCarts();
      setShowCartModal(false);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Error creating cart",
        variant: "danger",
      });
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddToExistingCart = async () => {
    try {
      if (!selectedCartId) {
        setToast({
          show: true,
          message: "Please select a cart",
          variant: "danger",
        });
        return;
      }

      setModalLoading(true);

      await addItemToCart(Number(selectedCartId), {
        productId: selectedProductId,
        quantity: Number(quantity),
      });

      setToast({
        show: true,
        message: "Item added to cart successfully",
        variant: "success",
      });

      setShowCartModal(false);
      await fetchMyDraftCarts();
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Error adding item to cart",
        variant: "danger",
      });
    } finally {
      setModalLoading(false);
    }
  };

  const filteredProducts = products
    .filter((p) =>
      p.description.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) => (category ? p.category === category : true));

  return (
    <>
      <NavigationBar />

      <ToastMessage
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Product Catalog</h2>
            <p className="text-muted mb-0">
              Browse products and add them to a draft cart.
            </p>
          </div>
        </div>

        <Row className="mb-4">
          <Col md={6}>
            <Form.Control
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>

          <Col md={4}>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Bread">Bread</option>
              <option value="Pastry">Pastry</option>
              <option value="Cake">Cake</option>
            </Form.Select>
          </Col>
        </Row>

        {loadingProducts ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
            <div className="mt-3">Loading products...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <Alert variant="info">No active products found.</Alert>
        ) : (
          <Row>
            {filteredProducts.map((product) => (
              <Col key={product.id} md={6} lg={4} className="mb-4">
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{product.description}</Card.Title>
                    <Card.Text className="mb-1">
                      <strong>Category:</strong> {product.category}
                    </Card.Text>
                    <Card.Text className="mb-1">
                      <strong>Stock #:</strong> {product.stockNumber}
                    </Card.Text>
                    <Card.Text className="mb-1">
                      <strong>Unit:</strong> {product.uom}
                    </Card.Text>
                    <Card.Text className="mb-3">
                      <strong>Pkg Size:</strong> {product.pkgSize}
                    </Card.Text>

                    <div className="mt-auto">
                      <Button onClick={() => openAddToCartModal(product.id)}>
                        Add to Cart
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <Modal
        show={showCartModal}
        onHide={() => !modalLoading && setShowCartModal(false)}
        centered
      >
        <Modal.Header closeButton={!modalLoading}>
          <Modal.Title>Add Product to Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={quantity}
              disabled={modalLoading}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Select Existing Draft Cart</Form.Label>
            <Form.Select
              value={selectedCartId}
              disabled={modalLoading}
              onChange={(e) => setSelectedCartId(e.target.value)}
            >
              <option value="">Choose a draft cart</option>
              {myCarts.map((cart) => (
                <option key={cart.id} value={cart.id}>
                  {cart.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="text-center my-3 text-muted">OR</div>

          <Form.Group className="mb-3">
            <Form.Label>Create New Cart</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter new cart title"
              value={newCartTitle}
              disabled={modalLoading}
              onChange={(e) => setNewCartTitle(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            disabled={modalLoading}
            onClick={() => setShowCartModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={modalLoading}
            onClick={handleAddToExistingCart}
          >
            {modalLoading ? "Working..." : "Add to Existing Cart"}
          </Button>
          <Button
            variant="success"
            disabled={modalLoading}
            onClick={handleCreateCartAndAdd}
          >
            {modalLoading ? "Working..." : "Create New Cart"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProductsPage;
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
} from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";
import api from "../services/api";
import { createCart, getMyCarts, addItemToCart } from "../services/cartService";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [myCarts, setMyCarts] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedCartId, setSelectedCartId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [newCartTitle, setNewCartTitle] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchMyDraftCarts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error loading products");
    }
  };

  const fetchMyDraftCarts = async () => {
    try {
      const carts = await getMyCarts();
      const draftCarts = carts.filter((cart) => cart.status === "draft");
      setMyCarts(draftCarts);
    } catch (err) {
      setError(err.response?.data?.message || "Error loading carts");
    }
  };

  const openAddToCartModal = (productId) => {
    setSelectedProductId(productId);
    setSelectedCartId("");
    setQuantity(1);
    setNewCartTitle("");
    setShowCartModal(true);
    setError("");
    setSuccess("");
  };

  const handleCreateCartAndAdd = async () => {
    try {
      if (!newCartTitle.trim()) {
        setError("Please enter a cart title");
        return;
      }

      const newCart = await createCart({
        title: newCartTitle,
        notes: "",
      });

      await addItemToCart(newCart.id, {
        productId: selectedProductId,
        quantity: Number(quantity),
      });

      setSuccess("New cart created and item added successfully");
      await fetchMyDraftCarts();
      setShowCartModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error creating cart");
    }
  };

  const handleAddToExistingCart = async () => {
    try {
      if (!selectedCartId) {
        setError("Please select a cart");
        return;
      }

      await addItemToCart(Number(selectedCartId), {
        productId: selectedProductId,
        quantity: Number(quantity),
      });

      setSuccess("Item added to cart successfully");
      setShowCartModal(false);
      await fetchMyDraftCarts();
    } catch (err) {
      setError(err.response?.data?.message || "Error adding item to cart");
    }
  };

  return (
    <>
      <NavigationBar />

      <Container className="py-4">
        <h2 className="mb-4">Product Catalog</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Row>
          {products.map((product) => (
            <Col key={product.id} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{product.description}</Card.Title>
                  <Card.Text>
                    <strong>Category:</strong> {product.category}
                  </Card.Text>
                  <Card.Text>
                    <strong>Stock #:</strong> {product.stockNumber}
                  </Card.Text>
                  <Card.Text>
                    <strong>Unit:</strong> {product.uom}
                  </Card.Text>
                  <Card.Text>
                    <strong>Pkg Size:</strong> {product.pkgSize}
                  </Card.Text>

                  <Button onClick={() => openAddToCartModal(product.id)}>
                    Add to Cart
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal show={showCartModal} onHide={() => setShowCartModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product to Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Select Existing Draft Cart</Form.Label>
            <Form.Select
              value={selectedCartId}
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

          <div className="text-center my-3">OR</div>

          <Form.Group className="mb-3">
            <Form.Label>Create New Cart</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter new cart title"
              value={newCartTitle}
              onChange={(e) => setNewCartTitle(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCartModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddToExistingCart}>
            Add to Existing Cart
          </Button>
          <Button variant="success" onClick={handleCreateCartAndAdd}>
            Create New Cart
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProductsPage;
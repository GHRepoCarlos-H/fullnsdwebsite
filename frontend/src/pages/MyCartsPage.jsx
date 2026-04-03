import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  Alert,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";
import {
  getMyCarts,
  submitCart,
  updateCartItem,
  removeCartItem,
} from "../services/cartService";

function MyCartsPage() {
  const [carts, setCarts] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCarts = async () => {
    try {
      const data = await getMyCarts();
      setCarts(data);
    } catch (err) {
      setError(err.response?.data?.message || "Error loading carts");
    }
  };

  useEffect(() => {
    loadCarts();
  }, []);

  const handleSubmitCart = async (cartId) => {
    try {
      await submitCart(cartId);
      setSuccess("Cart submitted successfully");
      setError("");
      loadCarts();
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting cart");
      setSuccess("");
    }
  };

  const handleUpdateQuantity = async (cartId, itemId, quantity) => {
    try {
      await updateCartItem(cartId, itemId, Number(quantity));
      setSuccess("Quantity updated successfully");
      setError("");
      loadCarts();
    } catch (err) {
      setError(err.response?.data?.message || "Error updating quantity");
      setSuccess("");
    }
  };

  const handleRemoveItem = async (cartId, itemId) => {
    try {
      await removeCartItem(cartId, itemId);
      setSuccess("Item removed successfully");
      setError("");
      loadCarts();
    } catch (err) {
      setError(err.response?.data?.message || "Error removing item");
      setSuccess("");
    }
  };

  return (
    <>
      <NavigationBar />

      <Container className="py-4">
        <h2 className="mb-4">My Carts</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {carts.map((cart) => (
          <Card key={cart.id} className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>{cart.title}</Card.Title>
              <Card.Text>
                <strong>Status:</strong> {cart.status}
              </Card.Text>
              <Card.Text>
                <strong>Notes:</strong> {cart.notes || "None"}
              </Card.Text>

              {cart.items.length === 0 ? (
                <p>No items in this cart.</p>
              ) : (
                cart.items.map((item) => (
                  <Row key={item.id} className="align-items-center border-bottom py-2">
                    <Col md={4}>
                      <strong>{item.product.description}</strong>
                    </Col>
                    <Col md={2}>{item.product.stockNumber}</Col>
                    <Col md={2}>
                      {cart.status === "draft" ? (
                        <Form.Control
                          type="number"
                          min="1"
                          defaultValue={item.quantity}
                          onBlur={(e) =>
                            handleUpdateQuantity(cart.id, item.id, e.target.value)
                          }
                        />
                      ) : (
                        item.quantity
                      )}
                    </Col>
                    <Col md={2}>{item.product.category}</Col>
                    <Col md={2}>
                      {cart.status === "draft" && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveItem(cart.id, item.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </Col>
                  </Row>
                ))
              )}

              {cart.status === "draft" && (
                <Button
                  className="mt-3"
                  onClick={() => handleSubmitCart(cart.id)}
                >
                  Submit Cart
                </Button>
              )}
            </Card.Body>
          </Card>
        ))}
      </Container>
    </>
  );
}

export default MyCartsPage;
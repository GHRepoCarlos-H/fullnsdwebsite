import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  Alert,
  Form,
  Row,
  Col,
  Spinner,
  Badge,
} from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";
import ToastMessage from "../components/ToastMessage";
import {
  getMyCarts,
  submitCart,
  updateCartItem,
  removeCartItem,
} from "../services/cartService";

function MyCartsPage() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const loadCarts = async () => {
    try {
      setLoading(true);
      const data = await getMyCarts();
      setCarts(data);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Error loading carts",
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCarts();
  }, []);

  const handleSubmitCart = async (cartId) => {
    try {
      setActionLoading(true);
      await submitCart(cartId);

      setToast({
        show: true,
        message: "Cart submitted successfully",
        variant: "success",
      });

      await loadCarts();
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Error submitting cart",
        variant: "danger",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartId, itemId, quantity) => {
    try {
      setActionLoading(true);
      await updateCartItem(cartId, itemId, Number(quantity));

      setToast({
        show: true,
        message: "Quantity updated successfully",
        variant: "success",
      });

      await loadCarts();
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Error updating quantity",
        variant: "danger",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveItem = async (cartId, itemId) => {
    try {
      setActionLoading(true);
      await removeCartItem(cartId, itemId);

      setToast({
        show: true,
        message: "Item removed successfully",
        variant: "success",
      });

      await loadCarts();
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Error removing item",
        variant: "danger",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const badgeVariant = (status) => {
    if (status === "draft") return "secondary";
    if (status === "submitted") return "warning";
    if (status === "reviewed") return "info";
    if (status === "completed") return "success";
    return "secondary";
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

      <Container className="py-4">
        <div className="mb-4">
          <h2 className="mb-1">My Carts</h2>
          <p className="text-muted mb-0">
            Manage your draft carts and track submitted ones.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
            <div className="mt-3">Loading carts...</div>
          </div>
        ) : carts.length === 0 ? (
          <Alert variant="info">You do not have any carts yet.</Alert>
        ) : (
          carts.map((cart) => (
            <Card key={cart.id} className="mb-4 shadow-sm border-0">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <Card.Title className="mb-1">{cart.title}</Card.Title>
                    <Card.Text className="mb-1">
                      <strong>Notes:</strong> {cart.notes || "None"}
                    </Card.Text>
                  </div>
                  <Badge bg={badgeVariant(cart.status)}>{cart.status}</Badge>
                </div>

                {cart.items.length === 0 ? (
                  <Alert variant="light" className="mb-0">
                    No items in this cart.
                  </Alert>
                ) : (
                  cart.items.map((item) => (
                    <Row key={item.id} className="align-items-center border-top py-3">
                      <Col md={4}>
                        <strong>{item.product.description}</strong>
                      </Col>
                      <Col md={2}>{item.product.stockNumber}</Col>
                      <Col md={2}>
                        {cart.status === "draft" ? (
                          <Form.Control
                            type="number"
                            min="1"
                            disabled={actionLoading}
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
                            variant="outline-danger"
                            size="sm"
                            disabled={actionLoading}
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
                    disabled={actionLoading}
                    onClick={() => handleSubmitCart(cart.id)}
                  >
                    {actionLoading ? "Working..." : "Submit Cart"}
                  </Button>
                )}
              </Card.Body>
            </Card>
          ))
        )}
      </Container>
    </>
  );
}

export default MyCartsPage;
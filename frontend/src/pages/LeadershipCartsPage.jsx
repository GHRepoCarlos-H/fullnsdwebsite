import { useEffect, useState } from "react";
import { Container, Card, Button, Alert, Row, Col } from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";
import { getLeadershipCarts, updateCartStatus } from "../services/cartService";

function LeadershipCartsPage() {
  const [carts, setCarts] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCarts = async () => {
    try {
      const data = await getLeadershipCarts();
      setCarts(data);
    } catch (err) {
      setError(err.response?.data?.message || "Error loading leadership carts");
    }
  };

  useEffect(() => {
    loadCarts();
  }, []);

  const handleStatusUpdate = async (cartId, status) => {
    try {
      await updateCartStatus(cartId, status);
      setSuccess(`Cart marked as ${status}`);
      setError("");
      loadCarts();
    } catch (err) {
      setError(err.response?.data?.message || "Error updating status");
      setSuccess("");
    }
  };

  return (
    <>
      <NavigationBar />

      <Container className="py-4">
        <h2 className="mb-4">Leadership Carts</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {carts.map((cart) => (
          <Card key={cart.id} className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>{cart.title}</Card.Title>
              <Card.Text>
                <strong>User:</strong> {cart.user?.name} ({cart.user?.email})
              </Card.Text>
              <Card.Text>
                <strong>Status:</strong> {cart.status}
              </Card.Text>
              <Card.Text>
                <strong>Notes:</strong> {cart.notes || "None"}
              </Card.Text>

              {cart.items.map((item) => (
                <Row key={item.id} className="border-bottom py-2">
                  <Col md={4}>
                    <strong>{item.product.description}</strong>
                  </Col>
                  <Col md={3}>{item.product.stockNumber}</Col>
                  <Col md={2}>Qty: {item.quantity}</Col>
                  <Col md={3}>{item.product.category}</Col>
                </Row>
              ))}

              <div className="mt-3 d-flex gap-2">
                {cart.status === "submitted" && (
                  <Button onClick={() => handleStatusUpdate(cart.id, "reviewed")}>
                    Mark Reviewed
                  </Button>
                )}

                {cart.status === "reviewed" && (
                  <Button
                    variant="success"
                    onClick={() => handleStatusUpdate(cart.id, "completed")}
                  >
                    Mark Completed
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        ))}
      </Container>
    </>
  );
}

export default LeadershipCartsPage;
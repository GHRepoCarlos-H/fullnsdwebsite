import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  Alert,
  Row,
  Col,
  Spinner,
  Badge,
} from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";
import ToastMessage from "../components/ToastMessage";
import ConfirmModal from "../components/ConfirmModal";
import { getLeadershipCarts, updateCartStatus } from "../services/cartService";

function LeadershipCartsPage() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    cartId: null,
    status: "",
    message: "",
  });

  const loadCarts = async () => {
    try {
      setLoading(true);
      const data = await getLeadershipCarts();
      setCarts(data);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Error loading leadership carts",
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCarts();
  }, []);

  const handleStatusUpdate = async (cartId, status) => {
    try {
      setActionLoading(true);
      await updateCartStatus(cartId, status);

      setToast({
        show: true,
        message: `Cart marked as ${status}`,
        variant: "success",
      });

      await loadCarts();
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Error updating status",
        variant: "danger",
      });
    } finally {
      setActionLoading(false);
      setConfirmModal({
        show: false,
        cartId: null,
        status: "",
        message: "",
      });
    }
  };

  const openConfirmModal = (cartId, status) => {
    const message =
      status === "reviewed"
        ? "Are you sure you want to mark this cart as reviewed?"
        : "Are you sure you want to mark this cart as completed?";

    setConfirmModal({
      show: true,
      cartId,
      status,
      message,
    });
  };

  const closeConfirmModal = () => {
    if (actionLoading) return;

    setConfirmModal({
      show: false,
      cartId: null,
      status: "",
      message: "",
    });
  };

  const badgeVariant = (status) => {
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

      <ConfirmModal
        show={confirmModal.show}
        message={confirmModal.message}
        onCancel={closeConfirmModal}
        onConfirm={() =>
          handleStatusUpdate(confirmModal.cartId, confirmModal.status)
        }
      />

      <Container className="py-4">
        <div className="mb-4">
          <h2 className="mb-1">Leadership Carts</h2>
          <p className="text-muted mb-0">
            Review submitted carts and move them through completion.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
            <div className="mt-3">Loading leadership carts...</div>
          </div>
        ) : carts.length === 0 ? (
          <Alert variant="info">
            No submitted, reviewed, or completed carts found.
          </Alert>
        ) : (
          carts.map((cart) => (
            <Card key={cart.id} className="mb-4 shadow-sm border-0">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <Card.Title className="mb-1">{cart.title}</Card.Title>
                    <Card.Text className="mb-1">
                      <strong>User:</strong> {cart.user?.name} ({cart.user?.email})
                    </Card.Text>
                    <Card.Text className="mb-0">
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
                    <Row key={item.id} className="border-top py-3">
                      <Col md={4}>
                        <strong>{item.product.description}</strong>
                      </Col>
                      <Col md={3}>{item.product.stockNumber}</Col>
                      <Col md={2}>Qty: {item.quantity}</Col>
                      <Col md={3}>{item.product.category}</Col>
                    </Row>
                  ))
                )}

                <div className="mt-3 d-flex gap-2">
                  {cart.status === "submitted" && (
                    <Button
                      disabled={actionLoading}
                      onClick={() => openConfirmModal(cart.id, "reviewed")}
                    >
                      {actionLoading ? "Working..." : "Mark Reviewed"}
                    </Button>
                  )}

                  {cart.status === "reviewed" && (
                    <Button
                      variant="success"
                      disabled={actionLoading}
                      onClick={() => openConfirmModal(cart.id, "completed")}
                    >
                      {actionLoading ? "Working..." : "Mark Completed"}
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </Container>
    </>
  );
}

export default LeadershipCartsPage;
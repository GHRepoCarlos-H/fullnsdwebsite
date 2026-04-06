import { useState } from "react";
import { Container, Form, Button, Card, Spinner } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import ToastMessage from "../components/ToastMessage";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "danger",
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      login(response.data.user, response.data.token);

      setToast({
        show: true,
        message: "Login successful",
        variant: "success",
      });

      navigate("/products");
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Login failed",
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastMessage
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card style={{ width: "100%", maxWidth: "420px" }} className="p-4 shadow">
          <h2 className="mb-4 text-center">Login</h2>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </Form.Group>

            <Button type="submit" className="w-100" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </Form>
        </Card>
      </Container>
    </>
  );
}

export default LoginPage;
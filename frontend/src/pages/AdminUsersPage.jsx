import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Table,
  Spinner,
} from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";
import ToastMessage from "../components/ToastMessage";
import api from "../services/api";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Error loading users",
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await api.post("/users", {
        name,
        email,
        password,
        role,
      });

      setToast({
        show: true,
        message: "User created successfully",
        variant: "success",
      });

      setName("");
      setEmail("");
      setPassword("");
      setRole("user");

      await loadUsers();
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Error creating user",
        variant: "danger",
      });
    } finally {
      setSubmitting(false);
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

      <Container className="py-4">
        <div className="mb-4">
          <h2 className="mb-1">Admin User Management</h2>
          <p className="text-muted mb-0">
            Create users and assign roles.
          </p>
        </div>

        <Card className="shadow-sm border-0 mb-4">
          <Card.Body>
            <h4 className="mb-3">Create New User</h4>

            <Form onSubmit={handleCreateUser}>
              <div className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  disabled={submitting}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                />
              </div>

              <div className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  disabled={submitting}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </div>

              <div className="mb-3">
                <Form.Label>Temporary Password</Form.Label>
                <Form.Control
                  type="text"
                  value={password}
                  disabled={submitting}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter temporary password"
                />
              </div>

              <div className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={role}
                  disabled={submitting}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </div>

              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create User"}
              </Button>
            </Form>
          </Card.Body>
        </Card>

        <Card className="shadow-sm border-0">
          <Card.Body>
            <h4 className="mb-3">Existing Users</h4>

            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" />
                <div className="mt-2">Loading users...</div>
              </div>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Active</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.isActive ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default AdminUsersPage;
import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function NavigationBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/products">
          NorthStar Distributors
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/products">
              Products
            </Nav.Link>

            <Nav.Link as={Link} to="/my-carts">
              My Carts
            </Nav.Link>

            {user && ["supervisor", "manager", "admin"].includes(user.role) && (
              <Nav.Link as={Link} to="/leadership-carts">
                Leadership Carts
              </Nav.Link>
            )}

            {user && user.role === "admin" && (
              <Nav.Link as={Link} to="/admin-users">
                Admin Users
              </Nav.Link>
            )}

            {user && ["supervisor", "manager", "admin"].includes(user.role) && (
              <Nav.Link as={Link} to="/manage-products">
                Manage Products
              </Nav.Link>
            )}
          </Nav>

          <div className="d-flex align-items-center gap-2 text-white">
            <span>{user?.name}</span>
            <Badge bg="secondary">{user?.role}</Badge>
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;

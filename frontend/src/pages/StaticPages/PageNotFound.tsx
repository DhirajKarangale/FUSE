import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh"
    }}>
      <h1>404</h1>
      <h2>Page Not Found</h2>

      <button onClick={() => navigate("/")}>
        Go Home
      </button>
    </div>
  );
}
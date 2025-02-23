import { useNavigate } from "react-router-dom";

function ConfirmationPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>🎉 Form Submitted Successfully!</h1>
      <p>Thank you for your submission. We will review your details and get back to you.</p>
      <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
    </div>
  );
}

export default ConfirmationPage;

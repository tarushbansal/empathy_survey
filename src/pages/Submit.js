import { useLocation } from "react-router-dom";

export default function Submit() {
  const { state } = useLocation();
  return state.status === "SUCCESS" ? (
    <div style={{ marginTop: 20, color: "green" }}>
      "Your responses have been successfully recorded. Thank you for taking this
      survey!"{" "}
    </div>
  ) : (
    <div style={{ marginTop: 20, color: "red" }}>
      "Oops! An error occured while submitting your responses. Please try again
      later."{" "}
    </div>
  );
}

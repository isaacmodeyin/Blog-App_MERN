import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div>
      <h2>Page Not Found!</h2>
      <p>This page does not seem to exist.</p>
      <p>
        Go to the <Link to="/">Homepage</Link>.
      </p>
    </div>
  );
}

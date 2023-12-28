const isProduction = process.env.NODE_ENV === "production";
export const serverUrl = isProduction
  ? "https://tic-tac-toe-server-tre2.onrender.com"
  : "http://localhost:3000";

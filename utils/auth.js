import jwt from "jsonwebtoken";

// Utility function to extract userId from token
export function getUserIdFromToken(authHeader) {
  if (!authHeader) {
    throw new Error("Authorization token is required");
  }
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw new Error("Authorization header format should be: Bearer <token>");
  }

  const token = parts[1];
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // Use whichever field your JWT uses
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

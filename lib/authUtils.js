import { getToken as nextAuthGetToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default class AuthUtils {
  static secret = process.env.NEXTAUTH_SECRET;

  /**
   * Get the authenticated user's token
   * @param {Object} req - Next.js request object
   * @returns {Promise<{ data: Object|null, error: any, errorResponse: Response|null }>}
   */
  static async getToken(req) {
    try {
      const token = await nextAuthGetToken({ req, secret: this.secret });
      return { data: token || null, error: null, errorResponse: null };
    } catch (error) {
      return {
        data: null,
        error,
        errorResponse: new NextResponse(
          JSON.stringify({ message: "Failed to get token" }),
          { status: 500 }
        ),
      };
    }
  }

  /**
   * Get the user ID from the token
   * @param {Object} req
   * @returns {Promise<{ data: string|null, error: any, errorResponse: Response|null }>}
   */
  static async getUserId(req) {
    const { data: token, error, errorResponse } = await this.getToken(req);
    if (error) return { data: null, error, errorResponse };

    return {
      data: token?.id || null,
      error: null,
      errorResponse: null,
    };
  }

  /**
   * Get the user role from the token
   * @param {Object} req
   * @returns {Promise<{ data: string|null, error: any, errorResponse: Response|null }>}
   */
  static async getUserRole(req) {
    const { data: token, error, errorResponse } = await this.getToken(req);
    if (error) return { data: null, error, errorResponse };

    return {
      data: token?.role || null,
      error: null,
      errorResponse: null,
    };
  }

  /**
   * Get full user info
   * @param {Object} req
   * @returns {Promise<{ data: { id: string, email: string, role: string }|null, error: any, errorResponse: Response|null }>}
   */
  static async getUserInfo(req) {
    const { data: token, error, errorResponse } = await this.getToken(req);
    if (error) return { data: null, error, errorResponse };

    if (!token) {
      return {
        data: null,
        error: new Error("Token is null"),
        errorResponse: new NextResponse(
          JSON.stringify({ message: "Unauthorized access" }),
          { status: 401 }
        ),
      };
    }

    return {
      data: {
        id: token.id,
        email: token.email,
        role: token.role,
      },
      error: null,
      errorResponse: null,
    };
  }

  /**
   * Check if user has the required role
   * @param {Object} req
   * @param {string} requiredRole
   * @returns {Promise<{ data: boolean, error: any, errorResponse: Response|null }>}
   */
  static async hasRole(req, requiredRole) {
    const { data: role, error, errorResponse } = await this.getUserRole(req);
    if (error) return { data: false, error, errorResponse };

    return {
      data: role === requiredRole,
      error: null,
      errorResponse: null,
    };
  }

  /**
   * Validate request has authenticated user
   * @param {Object} req
   * @returns {Promise<{ isValid: boolean, userInfo: Object|null, error: any, errorResponse: Response|null }>}
   */
  static async validateRequest(req) {
    try {
      const {
        data: userInfo,
        error,
        errorResponse,
      } = await this.getUserInfo(req);

      if (error || !userInfo) {
        return {
          isValid: false,
          userInfo: null,
          error: error || new Error("Unauthorized"),
          errorResponse:
            errorResponse ||
            new NextResponse(
              JSON.stringify({ message: "Authorization token is required" }),
              { status: 401 }
            ),
        };
      }

      return {
        isValid: true,
        userInfo,
        error: null,
        errorResponse: null,
      };
    } catch (error) {
      console.error("AuthUtils.validateRequest() error:", error);
      return {
        isValid: false,
        userInfo: null,
        error,
        errorResponse: new NextResponse(
          JSON.stringify({
            message: "Internal server error during auth validation",
          }),
          { status: 500 }
        ),
      };
    }
  }
}

import authService from '../services/auth.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import { refreshTokenCookieOptions } from '../utils/generateToken.js';
import HTTP_STATUS from '../constants/httpStatus.js';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: "John Doe" }
 *               email: { type: string, format: email, example: "john@example.com" }
 *               password: { type: string, example: "Secret123" }
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiSuccess' }
 *       409:
 *         description: Email already registered
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.register({ name, email, password });

    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

    res.status(HTTP_STATUS.CREATED).json(
      new ApiResponse(HTTP_STATUS.CREATED, { user, accessToken }, 'Account created successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user and get tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login({ email, password });

    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, { user, accessToken }, 'Login successful')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout the current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
export const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user._id);

    res.clearCookie('refreshToken', refreshTokenCookieOptions);

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, null, 'Logged out successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token using refresh token cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: New access token issued
 *       401:
 *         description: Invalid or expired refresh token
 */
export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    const { accessToken, refreshToken, user } = await authService.refresh(token);

    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, { accessToken, user }, 'Token refreshed')
    );
  } catch (error) {
    next(error);
  }
};

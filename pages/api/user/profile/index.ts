import { withAuth } from "@/src/auth/middleware";
import getProfileInteractor from "@/src/user/profile/get-profile";
import updateProfileInteractor from "@/src/user/profile/update-profile";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get User Profile
 *     description: Retrieves the profile information of the authenticated user.
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *                 avatarId:
 *                   type: integer
 *                   example: 1
 *                 isAdmin:
 *                   type: boolean
 *                   example: false
 *                 phoneNumber:
 *                   type: string
 *                   example: "+1234567890"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *       405:
 *         description: Method not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Method POST not allowed"
 *   patch:
 *     summary: Update User Profile
 *     description: Updates the profile information of the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 example: "jane.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "newpassword123"
 *               avatarId:
 *                 type: integer
 *                 example: 2
 *               phoneNumber:
 *                 type: string
 *                 example: "+1987654321"
 *           example:
 *             name: "Jane Doe"
 *             email: "jane.doe@example.com"
 *             password: "newpassword123"
 *             avatarId: 2
 *             phoneNumber: "+1987654321"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Jane Doe"
 *                     email:
 *                       type: string
 *                       example: "jane.doe@example.com"
 *                     avatarId:
 *                       type: integer
 *                       example: 2
 *                     phoneNumber:
 *                       type: string
 *                       example: "+1987654321"
 *       400:
 *         description: Validation error or duplicate email/phone number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email is already in use by another user."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 *       405:
 *         description: Method not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Method DELETE not allowed"
 */
function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        getProfileInteractor(req, res);
    } else if (req.method === "PATCH") {
        updateProfileInteractor(req, res);
    } else {
        res.setHeader("Allow", ["GET", "PATCH"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default withAuth(handler);

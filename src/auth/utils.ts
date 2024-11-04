import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Hashes a plaintext password.
 * @param password - The plaintext password to hash.
 * @returns The hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

/**
 * Compares a plaintext password with a hashed password.
 * @param password - The plaintext password to verify.
 * @param hashedPassword - The hashed password to compare against.
 * @returns `true` if the passwords match, otherwise `false`.
 */
export const verifyPassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
};

/**
 * Authenticated requests are passed on to handlers with data as specified by AuthenticatedRequest.
 */
export interface AuthenticatedRequest extends NextApiRequest {
    user: {
        userId: string;
        isAdmin: boolean;
    };
}

// OptionallyAuthenticatedRequest's are passed on to handlers where auth is optional.
export interface OptionallyAuthenticatedRequest extends NextApiRequest {
    user: {
        userId: string;
        isAdmin: boolean;
    } | null;
}

export type AuthenticatedHandler<T> = (
    req: AuthenticatedRequest,
    res: NextApiResponse<T>
) => unknown | Promise<unknown>;

export type OptionallyAuthenticatedHandler<T> = (
    req: OptionallyAuthenticatedRequest,
    res: NextApiResponse<T>
) => unknown | Promise<unknown>;

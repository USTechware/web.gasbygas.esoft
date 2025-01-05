import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

class AuthProvider {
    private static secret: string = process.env.JWT_SECRET as string;
    private static expiresIn: string = process.env.JWT_EXPIRES_IN as string;

    static generateToken(data: Record<string, string>): string {
        return jwt.sign(data, this.secret, { expiresIn: this.expiresIn });
    }

    static verify(token: string): jwt.JwtPayload | string {
        return jwt.verify(token, this.secret);
    }

    static async encryptPassword(pass: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const encryptedPass = await bcrypt.hash(pass, salt);

        return encryptedPass
    }

    static async matchPassword(passwordInput: string, userPassword: string ): Promise<boolean> {
        return await bcrypt.compare(passwordInput, userPassword);
    }

    static generateTempPassword = (length = 8): string => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
        return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
    };
}

export default AuthProvider;

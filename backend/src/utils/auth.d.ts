export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (password: string, hash: string) => Promise<boolean>;
export declare const generateToken: (userId: string, role: string) => string;
export declare const verifyToken: (token: string) => {
    userId: string;
    role: string;
} | null;
//# sourceMappingURL=auth.d.ts.map
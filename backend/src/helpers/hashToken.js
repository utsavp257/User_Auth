import crypto from 'node:crypto';
export const hashToken = (token) => {
    return crypto.createHash("sha256").update(token.toString()).digest("hex");

};
export default hashToken;
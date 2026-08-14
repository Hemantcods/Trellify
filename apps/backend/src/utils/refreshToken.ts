import crypto from "crypto"
export const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex")
}

export const hashRefrehToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex")
}
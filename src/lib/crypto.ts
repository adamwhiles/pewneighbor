/**
 * Application-level message encryption using AES-256-GCM.
 * Keys are stored in Azure Key Vault (via env var at runtime).
 * Messages are encrypted before storage and decrypted only when served
 * to authorized connection members.
 */

const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;

/**
 * Import the base64-encoded encryption key from the environment.
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  const keyBase64 = process.env.MESSAGE_ENCRYPTION_KEY;
  if (!keyBase64) {
    throw new Error("MESSAGE_ENCRYPTION_KEY environment variable is not set");
  }

  const keyBytes = Buffer.from(keyBase64, "base64");
  return crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt a plaintext message.
 * Returns base64-encoded ciphertext and IV, safe to store in the database.
 */
export async function encryptMessage(
  plaintext: string
): Promise<{ ciphertext: string; iv: string }> {
  const key = await getEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM
  const encoded = new TextEncoder().encode(plaintext);

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoded
  );

  return {
    ciphertext: Buffer.from(encrypted).toString("base64"),
    iv: Buffer.from(iv).toString("base64"),
  };
}

/**
 * Decrypt a message retrieved from the database.
 */
export async function decryptMessage(
  ciphertext: string,
  iv: string
): Promise<string> {
  const key = await getEncryptionKey();
  const ciphertextBytes = Buffer.from(ciphertext, "base64");
  const ivBytes = Buffer.from(iv, "base64");

  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv: ivBytes },
    key,
    ciphertextBytes
  );

  return new TextDecoder().decode(decrypted);
}

/**
 * Generate a new AES-256 key encoded as base64.
 * Use this once to generate MESSAGE_ENCRYPTION_KEY and store in Key Vault.
 */
export async function generateEncryptionKey(): Promise<string> {
  const key = await crypto.subtle.generateKey(
    { name: ALGORITHM, length: KEY_LENGTH },
    true,
    ["encrypt", "decrypt"]
  );
  const exported = await crypto.subtle.exportKey("raw", key);
  return Buffer.from(exported).toString("base64");
}

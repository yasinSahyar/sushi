import bcrypt from "bcryptjs";

// Crypt password function
async function cryptPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export { cryptPassword };

import bcrypt from "bcrypt";

const generaHash = async (password) => {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    console.log(`Hash per "${password}":\n${hash}`);
  } catch (err) {
    console.error("Errore nella generazione dell'hash:", err);
  }
};

generaHash("pippo123");

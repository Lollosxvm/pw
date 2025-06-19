import { getSaldoAggiornato } from "../controllers/utenteController.js";
import { verifyToken } from "../middleware/verifyToken.js";

router.get("/saldo", verifyToken, getSaldoAggiornato);

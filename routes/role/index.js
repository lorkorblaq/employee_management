import Router from 'express';
import role from "./role.js";
const router = Router();

router.get("/", (req, res, next) => {
    res.send("Auth API");
});

//Patient Routes
router.use('/role', role);

export default router;


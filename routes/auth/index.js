import Router from 'express';
import user from "./user.js";
const router = Router();

router.get("/", (req, res, next) => {
    res.send("Auth API");
});

//Patient Routes
router.use('/auth', user);

export default router;


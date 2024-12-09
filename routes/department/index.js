import Router from 'express';
import department from "./department.js";
const router = Router();

router.get("/", (req, res, next) => {
    res.send("Auth API");
});

router.use('/department', department);

export default router;


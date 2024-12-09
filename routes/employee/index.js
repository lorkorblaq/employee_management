import Router from 'express';
import employee from "./employee.js";
const router = Router();

router.get("/", (req, res, next) => {
    res.send("Auth API");
});

//Patient Routes
router.use('/employee', employee);

export default router;


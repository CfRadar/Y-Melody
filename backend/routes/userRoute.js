import express from 'express';
import {registerUser} from '../controllers/registerUser.js';
import { signinUser } from "../controllers/signinUser.js";

const router = express.Router();

router.post('/register', registerUser);
router.post("/signin", signinUser);

export default router;
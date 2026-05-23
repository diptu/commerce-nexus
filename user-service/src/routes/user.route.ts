import express from "express";
import User from "../models/user.model.ts";
import { getUsers, getUser, createUser, updateUser, deleteUser, loginUser, myProfile } from '../controllers/user.controller.ts';
import { isAuthenticated } from "../middlewares/Auth.ts";
const router = express.Router();


router.get('/', getUsers);
router.get('/login', loginUser);


router.get('/me', isAuthenticated, myProfile)
router.get("/:id", getUser);

router.post("/", createUser);

// update a product
router.put("/:id", updateUser);

// delete a product
router.delete("/:id", deleteUser);


export default router;
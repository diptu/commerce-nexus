import express from "express";
import User from "../models/user.model.ts";
import { getUsers, getUser, createUser, updateUser, deleteUser, loginUser } from '../controllers/user.controller.ts';
const router = express.Router();


router.get('/', getUsers);
router.get("/:id", getUser);

router.post("/", createUser);

// update a product
router.put("/:id", updateUser);

// delete a product
router.delete("/:id", deleteUser);


export default router;
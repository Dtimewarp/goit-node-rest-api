import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateContactStatus,
  filterFavoriteContacts
} from "../controllers/contactsControllers.js";
import { verifyToken } from "../helpers/tokenCheck.js";
import { isValidId } from "../helpers/idValidation.js";




const contactsRouter = express.Router();

contactsRouter.get("/", verifyToken, (req, res, next) => {
  if (req.query.favorite === 'true') {
      filterFavoriteContacts(req, res, next);
  } else {
      getAllContacts(req, res, next);
  }
});


contactsRouter.get("/:id", verifyToken, isValidId, getOneContact);

contactsRouter.delete("/:id", verifyToken, isValidId, deleteContact);

contactsRouter.post("/", verifyToken, createContact);

contactsRouter.put("/:id", verifyToken, isValidId, updateContact);

contactsRouter.patch("/:id/favourite",  verifyToken, isValidId, updateContactStatus)


export default contactsRouter;

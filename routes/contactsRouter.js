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




const contactsRouter = express.Router();

contactsRouter.get("/", verifyToken, (req, res, next) => {
  if (req.query.favorite === 'true') {
      filterFavoriteContacts(req, res, next);
  } else {
      getAllContacts(req, res, next);
  }
});


contactsRouter.get("/:id", verifyToken, getOneContact);

contactsRouter.delete("/:id", verifyToken, deleteContact);

contactsRouter.post("/", verifyToken, createContact);

contactsRouter.put("/:id", verifyToken, updateContact);

contactsRouter.patch("/:contactId/favourite", verifyToken, updateContactStatus)


export default contactsRouter;

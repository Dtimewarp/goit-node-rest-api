
import { listContacts, getContactById } from "../services/contactsServices.js";

export const getAllContacts =async (req, res, next) => {
    try {
        const contacts = await listContacts();
        res.status(200).json(contacts);
    } catch(error) {
        next(error);
    }
};

export const getOneContact = async (req, res) => {
    const {id} =  req.params;
    try {
        const contact = await getContactById(id);

        if (contact) {
            res.status(200).json(contact)
        } else {
            res.status(404).json({message: "Not found"})
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error"})
    }
};

export const deleteContact = (req, res) => {};

export const createContact = (req, res) => {};

export const updateContact = (req, res) => {};

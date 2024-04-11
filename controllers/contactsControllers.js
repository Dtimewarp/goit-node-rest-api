
import { listContacts, getContactById, removeContact, addContact, updateContactById, updateStatusContact  } from "../services/contactsServices.js";
import { createContactSchema, updateContactSchema, validateUpdateStatus  } from "../schemas/contactsSchemas.js";
import { isValidId } from "../helpers/idValidation.js";
import { Types } from 'mongoose';
import { Contact } from "../db/contactModel.js";


//GET ALL
export const getAllContacts = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const contacts = await Contact.find({ owner: userId });
        res.status(200).json(contacts);
    } catch(error) {
        next(error);
    }
};

//GET by ID
export const getOneContact = async (req, res) => {
    const { id } = req.params;
    
    isValidId(req, res, async () => {
        try {
            const contact = await getContactById(id);

            if (contact) {
                res.status(200).json(contact);
            } else {
                res.status(404).json({ message: "Not found" });
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Server Error" });
        }
    });
};

//DELETE
export const deleteContact = async (req, res, next) => {
    const {id} = req.params;
    isValidId(req, res, async () => {
        try {
            const deletedContact = await removeContact(id);
            if (!deletedContact) {
                return res.status(404).json({ message: "Not found" });
            }
            res.status(200).json(deletedContact);
        } catch (error) {
            next(error);
        }
    });
};

//POST
export const createContact = async (req, res, next) => {
    const { error, value } = createContactSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    const { name, email, phone } = value;
    const ownerId = req.user._id; 

    try {
        const existingContact = await Contact.findOne({ email });

        if (existingContact) {
            return res.status(409).json({ message: 'Contact with this email already exists' });
        }
        const newContact = await addContact(name, email, phone, ownerId);
        res.status(201).json(newContact);
    } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server Error' });
        }
};

// PUT
export const updateContact = async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    try {
        if (Object.keys(body).length === 0) {
            return res.status(400).json({ message: 'Body must have at least one field' });
        }

        const validation = updateContactSchema.validate(body, { abortEarly: false });
        if (validation.error) {
            return res.status(400).json({ message: validation.error.message });
        }

        isValidId(req, res, async () => {
            try {
                
                const updatedContact = await updateContactById(id, body);

                if (!updatedContact) {
                    return res.status(404).json({ message: 'Not found' });
                }

                return res.status(200).json(updatedContact);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Server error' });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

//PATCH
export const updateContactStatus = async (req, res) => {
    const { contactId } = req.params;
    const { error: validationError } = validateUpdateStatus(req.body);

    if (validationError) {
        return res.status(400).json({ message: validationError.details[0].message });
    }

    if (!Types.ObjectId.isValid(contactId)) {
        return res.status(400).json({ error: `${contactId} is not a valid ObjectId` });
    }

    const { favorite } = req.body;

    try {
        const updatedContact = await updateStatusContact(contactId, { favorite });

        if (updatedContact) {
            res.status(200).json(updatedContact);
        } else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

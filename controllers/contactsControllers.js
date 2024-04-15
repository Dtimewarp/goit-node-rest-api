
import { listContacts, getContactById, removeContact, addContact, updateContactById, updateStatusContact  } from "../services/contactsServices.js";
import { createContactSchema, updateContactSchema, validateUpdateStatus  } from "../schemas/contactsSchemas.js";
// import { isValidId } from "../helpers/idValidation.js";
// import { Types } from 'mongoose';
import { Contact } from "../db/contactModel.js";



//GET ALL with pagination

export const getAllContacts = async (req, res, next) => {
    try {
        const ownerId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const contacts = await Contact.find({ owner: ownerId }).skip(skip).limit(limit);

        const totalContacts = await Contact.countDocuments({ owner: ownerId });

        res.status(200).json({
            page,
            limit,
            totalContacts,
            totalPages: Math.ceil(totalContacts / limit),
            data: contacts
        });
    } catch (error) {
        next(error);
    }
};

//GET by ID
// export const getOneContact = async (req, res) => {
//     const { id } = req.params;
    
//     isValidId(req, res, async () => {
//         try {
//             const contact = await getContactById(id);

//             if (!contact) {
//                 return res.status(404).json({ message: "Contact not found" });
//             }

//             if (contact.owner.toString() !== req.user._id.toString()) {
//                 return res.status(403).json({ message: "You are not authorized to access this contact" });
//             }

//             res.status(200).json(contact);

//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ error: "Server Error" });
//         }
//     });
// };

export const getOneContact = async (req, res) => {
    const { id } = req.params;

    try {
        const ownerId = req.user._id;
        const contact = await Contact.findOne({ _id: id, owner: ownerId });

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        res.status(200).json(contact);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};

//GET filter by FAVOURITE(by owner)

export const filterFavoriteContacts = async (req, res, next) => {
    try {
        const ownerId = req.user._id; 

        const { favorite } = req.query;

        const filter = { owner: ownerId };
        if (favorite) {
            filter.favorite = favorite === 'true'; 
        }

        const contacts = await Contact.find(filter);

        res.status(200).json(contacts);
    } catch (error) {
        next(error);
    }
};

//DELETE by ID
// export const deleteContact = async (req, res, next) => {
//     const { id } = req.params;

//     isValidId(req, res, async () => {
//         try {
//             const contact = await getContactById(id);

//             if (!contact) {
//                 return res.status(404).json({ message: "Contact not found" });
//             }

//             if (contact.owner.toString() !== req.user._id.toString()) {
//                 return res.status(403).json({ message: "You are not authorized to delete this contact" });
//             }

//             const deletedContact = await removeContact(id);
            
//             if (!deletedContact) {
//                 return res.status(404).json({ message: "Contact not found" });
//             }

//             res.status(200).json(deletedContact);
//         } catch (error) {
//             next(error);
//         }
//     });
// };

export const deleteContact = async (req, res, next) => {
    const { id } = req.params;

    try {
        const ownerId = req.user._id;

        const contact = await Contact.findOneAndDelete({ _id: id, owner: ownerId });

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
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
        const existingContact = await Contact.findOne({ email, owner: ownerId });

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
// export const updateContact = async (req, res) => {
//     const { id } = req.params;
//     const { body } = req;
//     const ownerId = req.user._id;

//     try {
//         if (Object.keys(body).length === 0) {
//             return res.status(400).json({ message: 'Body must have at least one field' });
//         }

//         const validation = updateContactSchema.validate(body, { abortEarly: false });
//         if (validation.error) {
//             return res.status(400).json({ message: validation.error.message });
//         }

//         isValidId(req, res, async () => {
//             try {
//                 const existingContact = await Contact.findOne({ _id: id, owner: ownerId });
//                 if (!existingContact) {
//                     return res.status(404).json({ message: 'Contact not found' });
//                 }

//                 const updatedContact = await updateContactById(id, body);
//                 return res.status(200).json(updatedContact);
//             } catch (error) {
//                 console.error(error);
//                 return res.status(500).json({ message: 'Server error' });
//             }
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Server error' });
//     }
// };

export const updateContact = async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const ownerId = req.user._id;

    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'Body must have at least one field' });
        }

        const validation = updateContactSchema.validate(body, { abortEarly: false });
        if (validation.error) {
            return res.status(400).json({ message: validation.error.message });
        }

        const existingContact = await Contact.findOne({ email: body.email });
        if (existingContact && existingContact._id.toString() !== id) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        const updatedContact = await updateContactById(id, ownerId, body);

        if (!updatedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        return res.status(200).json(updatedContact);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


//PATCH
// export const updateContactStatus = async (req, res) => {
//     const { contactId } = req.params;
//     const { error: validationError } = validateUpdateStatus(req.body);

//     if (validationError) {
//         return res.status(400).json({ message: validationError.details[0].message });
//     }

//     if (!Types.ObjectId.isValid(contactId)) {
//         return res.status(400).json({ error: `${contactId} is not a valid ObjectId` });
//     }

//     const { favorite } = req.body;

//     try {
//         const contact = await Contact.findById(contactId);

//         if (!contact) {
//             return res.status(404).json({ message: "Contact not found" });
//         }

//         if (contact.owner.toString() !== req.user._id.toString()) {
//             return res.status(403).json({ message: "You are not authorized to update this contact" });
//         }

//         contact.favorite = favorite;
//         await contact.save();

//         res.status(200).json(contact);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server Error" });
//     }
// };

export const updateContactStatus = async (req, res) => {
    const { id } = req.params;
    const { error: validationError } = validateUpdateStatus(req.body);

    if (validationError) {
        return res.status(400).json({ message: validationError.details[0].message });
    }
    
    const { favorite } = req.body;

    try {
        const updatedContact = await updateStatusContact(id, { favorite });

        if (!updatedContact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        res.status(200).json(updatedContact);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

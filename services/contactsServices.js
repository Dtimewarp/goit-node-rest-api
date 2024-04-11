import { Contact } from "../db/contactModel.js";



export async function listContacts() {
    try {
        const contacts = await Contact.find();
        console.log(contacts);
        return contacts;
    } catch (error) {
        console.log(error);
    }
}

export async function getContactById(contactId) {
    try {
        const contacts = await listContacts();
        const contact = contacts.find(({ id }) => id === contactId);
        return contact || null;
    } catch (error) {
        console.log(error);
    }
}

export async function removeContact(contactId) {
    try {
        const removedContact = await Contact.findByIdAndDelete(contactId);
        if (!removedContact) return null;
        
        return removedContact;
    } catch (error) {
        console.log(error);
    }
}

export async function addContact(name, email, phone, ownerId) {
    try {
        const newContact = await Contact.create({ name, email, phone, owner: ownerId });
        return newContact;
    } catch (error) {
        console.log(error);
    }
}

export async function updateContactById(id, newData) {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            newData,
            { new: true } 
        );
        return updatedContact;
    } catch (error) {
        throw new Error('Failed to update contact');
    }
}

export async function updateStatusContact(contactId, newData) {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(
            contactId,
            { $set: newData },
            { new: true }
        );
        return updatedContact;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to update contact status");
    }
}
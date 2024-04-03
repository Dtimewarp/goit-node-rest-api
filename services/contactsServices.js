import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import path from "path";
import { Contact } from "../db/contactModel.js";

// const contactsPath = path.join("db", "contacts.json");

// export async function listContacts() {
//     try {
//         const data = await fs.readFile(contactsPath, "utf-8");
//         return JSON.parse(data);
//     } catch (error) {
//         console.log(error);
//     }
// }

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
        const contacts = await listContacts();
        const removedContact = contacts.find(({ id }) => id === contactId);
        if (!removedContact) return null;

        const updatedContacts = contacts.filter(({ id }) => id !== contactId);
        await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
        return removedContact;
    } catch (error) {
        console.log(error);
    }
}

export async function addContact(name, email, phone) {
    try {
        const contacts = await listContacts();
        const newContact = { id: nanoid(22), name, email, phone };
        contacts.push(newContact);
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        return newContact;
    } catch (error) {
        console.log(error);
    }
}

export async function updateContactById(id, newData) {
    try {
        const data = await fs.readFile(contactsPath, 'utf-8');
        const contacts = JSON.parse(data);

        const index = contacts.findIndex((contact) => contact.id === id);
        if (index === -1) return null;

        const updatedContact = { ...contacts[index], ...newData };
        contacts[index] = updatedContact;

        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        return updatedContact;
    } catch (error) {
        throw new Error('Failed to update contact');
    }
}

import { promises as fs } from "fs";
import path from "path";

const contactsPath = path.join("db", "contacts.json");

export async function listContacts() {
    try {
        const data = await fs.readFile(contactsPath, "utf-8");
        return JSON.parse(data);
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
        const newContact = { id: Date.now(), name, email, phone };
        contacts.push(newContact);
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        return newContact;
    } catch (error) {
        console.log(error);
    }
}

// export default { listContacts, getContactById, removeContact, addContact };

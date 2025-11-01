const Contact = require('../models/contactData');
const sendContactMail = require('../utils/mailer');

exports.createContact = async (req, res) => {
    const { fullName, email, subject, message, profession } = req.body;
    try {
        const newContact = new Contact({
            fullName,
            email,
            subject,
            message,
            profession
        });
        const savedContact = await newContact.save();
        const senderIp = req.ip || req.connection.remoteAddress;
        const mailResponse = await  sendContactMail(fullName, email, subject, message, profession, senderIp);
        res.status(201).json({ message: 'Contact form submitted successfully', data: savedContact });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong, please try again later.' , error: error.message });
    }
};

exports.getAllContacts = async (req, res) => {
    try {
        
        const { subject } = req.params;
        const query = subject ? { subject } : {};
        const records = await Contact.find(query);

        if (records.length === 0) {
            return res.status(404).json({ message: `No records found for subject: ${subject || 'all'}.` });
        }

        res.status(200).json({
            message: `${records.length} record(s) found${subject ? ` for subject: ${subject}` : ''}.`,
            size: records.length,
            data: records
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong while fetching records.' });
    }
};

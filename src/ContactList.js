import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactList = ({ formSubmitted }) => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await axios.get('http://54.172.140.174/:3000/api/contacts');
                setContacts(res.data);
            } catch (err) {
                if (err.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error('Error response data:', err.response.data);
                    console.error('Error response status:', err.response.status);
                    console.error('Error response headers:', err.response.headers);
                } else if (err.request) {
                    // The request was made but no response was received
                    console.error('Error request data:', err.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Error message:', err.message);
                }
                console.error('Error config:', err.config);
            }
        };
        fetchContacts();
    }, [formSubmitted]); // Add formSubmitted to the dependency array

    return (
        <div>
            <h1>Existing Customers</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(contacts) && contacts.map(item => (
                        <tr key={item.customerid}>
                            <td>{item.customerid}</td>
                            <td>{item.firstname}</td>
                            <td>{item.lastname}</td>
                            <td>{item.email}</td>
                            <td>{item.phone}</td>
                            <td>{item.message}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContactList;

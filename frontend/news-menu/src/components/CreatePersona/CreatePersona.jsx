import { db } from '../../firebase';
import { collection, addDoc } from "firebase/firestore";

import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function CreatePersona() {

    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");

    async function handleCreatePersona() {
        try {
            const collectionRef = collection(db, "personas");

            const customPersona = {
                name: name,
                description: description
            };

            await addDoc(collectionRef, customPersona);
            console.log("Added new persona");
        } catch (error) {
            console.error("Error adding persona: ", error);
        }
    }

    return (
        <div>
            <TextField
                onChange={(e) => setName(e.target.value)}
                value={name}
                label="Name"
                sx={{
                    backgroundColor: 'white',
                    borderRadius: '5px',
                }}
                />
            <TextField
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                label="Description"
                multiline
                rows={4}
                sx={{
                    backgroundColor: 'white',
                    borderRadius: '5px',
                }}
                />
            <Button onClick={handleCreatePersona}>Add Persona</Button>
        </div>
    );
}

export default CreatePersona;
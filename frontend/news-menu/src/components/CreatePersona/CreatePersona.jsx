import { db } from '../../firebase';
import { collection, addDoc, query, getDocs, doc, deleteDoc } from "firebase/firestore";

import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

function CreatePersona({ user, userPersonas, setUserPersonas }) {

    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [missingFields, setMissingFields] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);

    const [drawerOpen, setDrawerOpen] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);



    
    // let's get the personas that the user made
    // Source: https://firebase.google.com/docs/firestore/query-data/get-data
    async function personasFromFB() {
        const personas = [];
        const q = query(collection(db, "personas"));
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((doc) => {
                    if (doc.data().userID === user.uid) {
                        personas.push({id: doc.id, ...doc.data()});
                    }
                });
        return personas;
    }

    React.useEffect(() => {
        async function getPersonas() {
            try {
                const databasePersonas = await personasFromFB();
                setUserPersonas(databasePersonas);
                console.log("Fetched personas: ", databasePersonas);
            } catch (error) {
                console.error("Error fetching personas: ", error);
            }
        }
        getPersonas();
    }, []);

    async function handleCreatePersona() {
        try {
            if (!user) {
                console.log("User isn't signed in :(");
                return;
            }

            if (!name || !description) {
                console.log("missing name or description");
                setMissingFields(true);
                return;
            }

            setIsLoading(true);

            const collectionRef = collection(db, "personas");

            const customPersona = {
                name: name,
                description: description,
                userID: user.uid
            };

            await addDoc(collectionRef, customPersona);
            console.log("Added new persona");
            setMissingFields(false);
            setSubmitted(true);
            setIsLoading(false);

            // clear the textboxes
            setName("");
            setDescription("");

            // clear the submitted message
            setTimeout(() => {
                setSubmitted(false);
            }, 2500);

            // pull from database
            const databasePersonas = await personasFromFB();
            setUserPersonas(databasePersonas);
            console.log("Fetched personas: ", databasePersonas);

        } catch (error) {
            console.error("Error adding persona: ", error);
        }
    }

    async function handleRemovePersona(documentID) {
        try {
            await deleteDoc(doc(db, "personas", documentID));

            // update  personas
            const databasePersonas = await personasFromFB();
            setUserPersonas(databasePersonas);
            console.log("Fetched personas: ", databasePersonas);
        } catch (error) {
            console.error("Error removing persona: ", error);
        }
    }

    return (
        <div>
            <Drawer open={drawerOpen}
            variant="persistent"
            sx={{
                width: 300,
                flexShrink: 0,
                // height: '100vh',

                '& .MuiDrawer-paper': {
                    width: 300,
                    // height: '100vh',
                    boxSizing: 'border-box',
                    backgroundColor: 'bisque',
                    paddingTop: '20px',
                    // paddingLeft: '5px',
                    // paddingRight: '5px',
                },
            }}
            >
                <h2>Create and save a custom persona</h2>
                <TextField
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    label="Name"
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: '5px',
                    }}
                    inputProps={{
                        maxLength: 50,
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
                    inputProps={{
                        maxLength: 500,
                    }}
                    />
                {isLoading ? (<CircularProgress />) : (
                <Button onClick={handleCreatePersona} variant="contained">Add Persona</Button>
                )}

                <Box sx={{
                    overflow: 'auto',
                    maxHeight: '70vh',
                }}>
                    {userPersonas.map((persona, index) => (
                        <Card key={index} sx={{
                            marginBottom: '30px',
                            marginTop: '30px',
                        }}>
                            <CardHeader
                                title={persona.name}
                                sx={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                }}
                                />
                            <CardContent>
                                <Typography gutterBottom>{persona.description}</Typography>
                            </CardContent>
                            {/* <Button onClick={() => handleRemovePersona(persona.id)} variant="contained">Remove</Button> */}
                            <IconButton onClick={() => handleRemovePersona(persona.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Card>
                    ))}
                </Box>
                {submitted && <Alert severity="success">Successfully created a custom persona!</Alert>}
                {missingFields && <Alert severity="error" className="alert">Please fill out the name and description.</Alert>}
            </Drawer>
        </div>
    );
}

export default CreatePersona;
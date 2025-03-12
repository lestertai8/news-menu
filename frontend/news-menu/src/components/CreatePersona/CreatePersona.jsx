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
import InputAdornment from '@mui/material/InputAdornment';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';

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
                    // alignItems: 'center',
                    // flexDirection: 'column',
                    // paddingLeft: '5px',
                    // paddingRight: '5px',
                    borderRadius: '50px',
                    boxShadow: '4px 2px 2px black',
                    padding: '3px',

                },
            }}
            >
                <Typography variant="h5" sx={{
                    marginTop: '40px',
                    marginBottom: '5px',
                    textAlign: 'center',
                }}
                >Create your own voice</Typography>
                <Box sx={{
                    display: 'flex',
                    textAlign: 'center',
                    justifyContent: 'center',
                }}
                >
                    <Divider sx={{
                        borderColor: 'gray',
                        borderWidth: '1px',
                        width: '80%',
                        // marginTop: '20px',
                        marginBottom: '35px',
                    }}/>
                </Box>
                <TextField
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    label="Name"
                    // helperText="Ex: 'Enthusiastic Journalist'"
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: '5px',
                        marginBottom: '20px',
                    }}
                    inputProps={{
                        maxLength: 50,
                    }}
                    // According to chatgpt, inputProps is different from InputProps...
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Tooltip title="Ex: 'Enthusiastic Journalist'">
                                    <InfoIcon/>
                                </Tooltip>
                            </InputAdornment>
                        )
                    }}
                    // endAdornment={
                    //     <InputAdornment position="end">
                    //         <InfoIcon />
                    //     </InputAdornment>
                    // }
                    />
                <TextField
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    label="Description"
                    // helperText="Ex: 'Long-time reporter who is particularly passionate about technology.'"
                    multiline
                    rows={4}
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: '5px',
                        marginBottom: '20px',
                    }}
                    inputProps={{
                        maxLength: 500,
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Tooltip title="Ex: 'Long-time reporter who is particularly passionate about technology.'">
                                    <InfoIcon/>
                                </Tooltip>
                            </InputAdornment>
                        )
                    }}
                    />
                {isLoading ? (<CircularProgress />) : (
                <Button onClick={handleCreatePersona} variant="contained"
                sx={{
                    borderRadius: '30px',
                    textTransform: 'none',
                    width: '100%',
                    backgroundColor: '#0084f5',
                }}
                >Add Persona</Button>
                )}

                <Box sx={{
                    overflow: 'auto',
                    maxHeight: '70vh',
                }}>
                    {userPersonas.map((persona, index) => (
                        <Card key={index} sx={{
                            marginBottom: '30px',
                            marginTop: '30px',
                            borderRadius: '40px',
                            boxShadow: '2px 2px 2px gray',
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
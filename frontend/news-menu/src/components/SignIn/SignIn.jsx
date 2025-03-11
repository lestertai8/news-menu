import { auth, provider, signInWithGoogle } from "../../firebase";

import * as React from 'react';
import Button from '@mui/material/Button';

// Source: https://firebase.google.com/docs/auth/web/google-signin

// Adapted from SignIn.jsx file here: https://github.com/394-w25/CourseBuddy/tree/master
function SignIn({ setUser }) {

    async function handleSignIn() {
        try {
            const response = await signInWithGoogle();
            if (response) {
                // console.log("Successfully signed in with Google as user: ", response);
                setUser(response);
            }
        } catch (error) {
            console.error("Error with Google sign-in: ", error);
        }
    }

    return (
        <Button onClick={handleSignIn} variant="contained"
        sx={{
            fontSize: '16px',
            borderRadius: '100px',
            width: '250px',
            height: '60px',
            textTransform: 'none',
        }}
        >
            Sign In with Google
        </Button>
    )
}

export default SignIn;
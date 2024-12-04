import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import {
    Integrity, NotFound, Overview, ResetPassword, Settings, SignIn, SignUp,
    Unauthorized
} from 'pages/imports';

import './Tokens.css';
import 'styles/Animations.css';
import 'styles/Utils.css';
import './App.css';


function App() {

    const lastVisitedPage = localStorage.getItem('lastVisitedPage');

    return (
        <Router>
            <Routes>
                <Route path="/" element={lastVisitedPage ? <Navigate to={lastVisitedPage} /> : <SignIn />} />
                <Route path="/integrity" element={<Integrity />} />
                <Route path="/not-found" element={<NotFound />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<Navigate to="/not-found" />} />
            </Routes>
        </Router>
    );
}

export default App;
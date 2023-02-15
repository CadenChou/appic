import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import "./ProteinDetails.css"
import { Button } from '@mui/material';

export default function ProteinDetails() {
    const navigate = useNavigate();
    const [organName, setOrganName] = useState('');

    const location = useLocation();

    useEffect(() => {
        if (location) {
            setOrganName(location.state.organName)
        }
    }, [location])

    return (
        <div className='parent'>
            <div className='layout'>
                <h2>{organName} Cancer Protein Details</h2>
                <Button
                    variant='contained'
                    onClick={() => {
                        navigate('/PPI-graph', {state: {organName: organName}})
                    }}>
                    Go back to PPI Network
                </Button>
            </div>
        </div>
    )
}

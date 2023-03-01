import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import { useNavigate } from 'react-router-dom';
import useImage from 'use-image';
import './BodyDiagram.css';

import { Grid, Button } from '@mui/material';
import { motion } from "framer-motion"

export default function BodyDiagram() {
    const navigate = useNavigate();
    
    // const stageRef = useRef(null);

    // const handleClick = (e) => {
    //     console.log(`You clicked the ${e.target.name()}`)
    //     // Change this
    //     navigate('/PPI-graph')
    // }

    // const bodyX = 550;
    // const lungX = bodyX + 105;

    // const [bodyImage] = useImage('https://i.pinimg.com/736x/6c/be/78/6cbe78f45758fada70c7bd3671e0b3f5--body-template-the-human-body.jpg');
    // const [lungImage] = useImage('https://static.vecteezy.com/system/resources/thumbnails/005/155/375/small_2x/lungs-human-icon-outline-black-color-illustration-flat-style-image-vector.jpg');
    // const [isImagesLoaded, setIsImagesLoaded] = useState(false);
    // const [bodyScale, setBodyScale] = useState({ x: 1, y: 1 });
    // const [lungScale, setLungScale] = useState({ x: 1, y: 1 });





    return (
        <div>
            <h1 style={{ marginBottom: '8vh', marginTop: '2vh' }}>
                Cancer Types
            </h1>
            <Grid container rowSpacing={{ xs: 5, sm: 7, md: 10 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }} >
                <Grid item xs={4}>
                    <motion.div whileHover={{ scale: 1.08 }}>
                        <img
                            src='https://t3.ftcdn.net/jpg/02/45/40/72/360_F_245407237_3OPemYW8TEC0fsDDEtwTqjdmYiDQmj0g.jpg'
                            alt='Lungs'
                            style={{ width: '25%' }}
                            onClick={() => {
                                navigate('/PPI-graph', {state: {organName: 'Lung'}})
                            }}
                        ></img>
                    </motion.div>
                    <h4>Lung</h4>

                </Grid>
                <Grid item xs={4}>
                    <motion.div whileHover={{ scale: 1.08 }}>
                        <img
                            src='https://static.vecteezy.com/system/resources/previews/000/602/622/non_2x/vector-realistic-heart-outline.jpg'
                            alt='Heart'
                            style={{ width: '25%' }}
                            onClick={() => {
                                navigate('/PPI-graph', {state: {organName: 'Heart'}})
                            }}
                        ></img>

                    </motion.div>
                    <h4>Heart</h4>
                </Grid>
                <Grid item xs={4}>
                    <motion.div whileHover={{ scale: 1.08 }}>
                        <img
                            src='https://i.pinimg.com/originals/b8/d4/69/b8d4691b655ca516972d3e6b410cdb8d.jpg'
                            alt='Brain'
                            style={{ width: '25%' }}
                            onClick={() => {
                                navigate('/PPI-graph', {state: {organName: 'Brain'}})
                            }}
                        ></img>
                    </motion.div>
                    <h4>Brain</h4>
                </Grid>
                <Grid item xs={4}>
                    <motion.div whileHover={{ scale: 1.08 }}>
                        <img
                            src='https://media.istockphoto.com/id/1291717088/vector/human-intestinal-illustration.jpg?s=612x612&w=0&k=20&c=tHDohjHAi8afeiH_Tf9OeQjxyM0EjTtfSg40r7j8Y_M='
                            alt='Intestine'
                            style={{ width: '35%' }}
                            onClick={() => {
                                navigate('/PPI-graph', {state: {organName: 'Colon'}})
                            }}
                        ></img>
                    </motion.div>
                    <h4>Colon</h4>
                </Grid>
                <Grid item xs={4}>
                    <motion.div whileHover={{ scale: 1.08 }}>
                        <img
                            src='http://skincancersurgery.co.uk/Info/Skin_info_files/skin_diagram.png'
                            alt='Skin'
                            style={{ width: '35%' }}
                            onClick={() => {
                                navigate('/PPI-graph', {state: {organName: 'Melanoma'}})
                            }}
                        ></img>
                    </motion.div>
                    <h4 style={{ marginTop: '2vh' }}>Melanoma</h4>
                </Grid>
                <Grid item xs={4}>
                    <motion.div whileHover={{ scale: 1.08 }}>
                        <img
                            src='https://coloringhome.com/coloring/LTK/rRg/LTKrRgeqc.jpg'
                            alt='Kidney'
                            style={{ width: '35%' }}
                            onClick={() => {
                                navigate('/PPI-graph', {state: {organName: 'Kidney'}})
                            }}
                        ></img>
                    </motion.div>
                    <h4 style={{ marginTop: '2vh' }}>Kidney</h4>
                </Grid>
            </Grid>
            <div style={{ marginTop: '8vh' }}>
                <Button
                    variant='contained'
                    onClick={() => {
                        navigate('/')
                    }}>
                    Go back to landing page
                </Button>
            </div>

            {/* <div className='body-diagram-container'>
                <img
                    src='https://i.pinimg.com/736x/6c/be/78/6cbe78f45758fada70c7bd3671e0b3f5--body-template-the-human-body.jpg'
                    alt='Body Diagram'
                    className='body-diagram-image'
                ></img>
                <div className='organ-images-container'>
                    <img
                        src='https://static.vecteezy.com/system/resources/thumbnails/005/155/375/small_2x/lungs-human-icon-outline-black-color-illustration-flat-style-image-vector.jpg'
                        alt='Lungs'
                        className='organ-image-lungs'
                    ></img>
                </div>


            </div>

 */}



        </div>
    )
}



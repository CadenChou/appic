import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AppContext from '../services/AppContext';
import { makeStyles } from '@material-ui/core/styles';

import {
    Grid,
    Box,
    Button,
    Typography,
    Modal, Menu,
    MenuItem,
    AppBar,
    Popover,
    Card,
    CardMedia,
    CardContent,
    CardActions,

} from '@mui/material'



export default function BodyDiagram() {
    const navigate = useNavigate();
    const context = useContext(AppContext)

    const [focusedOrgan, setFocusedOrgan] = useState(
        {
            name: '',
            image: '',
            imageWidth: '',
            subtypeNames: [],
        });

    // For subtype menu
    const [anchorElMenu, setAnchorElMenu] = useState(null);

    const handleMenuClick = (event) => {
        setAnchorElMenu(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorElMenu(null);
    };

    const handleOrganClick = (subtype) => {
        // Update the context with organ name and subtype (see app.js)
        context.setOrganName(focusedOrgan.name)
        context.setSubtype(subtype)
        navigate('/PPI-graph', { state: { organName: focusedOrgan.name, subtype: subtype } });
    };

    // For hover-over-subtype popover
    const [anchorElPopover, setAnchorElPopover] = useState(null);

    const handlePopoverHover = (event, subtype) => {
        // Update the context with organ name and subtype (see app.js)
        context.setOrganName(focusedOrgan.name)
        context.setSubtype(subtype)
        setAnchorElPopover(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorElPopover(null);
    };

    const PopoverOpen = Boolean(anchorElPopover);

    const [items, setItems] = useState([
        {
            name: 'bladder',
            image: './images/bladder.png',
            imageWidth: '100%',
            subtypeNames: [
                "papillary cell2017",
                "nonpapillary cell2017",
                "papillary nature2014",
                // "C35",
                // "C91",
                // "C145",
                // "C271",
                // "C369"
            ],
        },
        {
            name: 'brain',
            image: './images/brain_real.png',
            imageWidth: '100%',
            subtypeNames: [
                // "gbm_subgrouping_C15",
                // "gbm_subgrouping_C68",
                // "gbm_subgrouping_C120"
                'Coming Soon'
            ],
        },
        {
            name: 'breast',
            image: './images/breast.png',
            imageWidth: '100%',
            subtypeNames: [
                "mmr deficient",
                "mmr intact",
                "ductal C106",
                "ductal C143",
                "lobular C16",
                "lobular C234",
                // "brca_claudin-low_subgrouping_C15",
                // "brca_claudin-low_subgrouping_C145",
                // "brca_claudin-low_subgrouping_C180"
            ],
        },
        {
            name: 'colon and colorectal',
            image: './images/colon.png',
            imageWidth: '60%',
            subtypeNames: [
                "chromosomal instability",
                "genome stable",
                "microsatellite instability",
                "mutated braf",
                "metastatic",
                "nonmetastatic"
            ],
        },
        {
            name: 'gallbladder',
            image: './images/gallbladder.png',
            imageWidth: '100%',
            subtypeNames: ["cholangiocarcinoma"],
        },
        {
            name: 'lung',
            image: './images/lung.png',
            imageWidth: '100%',
            subtypeNames: [
                "LUAD bronchioloalverolar",
                "LUAD acinar papillary",
                "LUSC basaloid",
                "LUSC papillary",
                // "luad_subgrouping_C28",
                // "luad_subgrouping_C81",
                // "luad_subgrouping_C151",
                // "luad_subgrouping_C212",
                // "luad_subgrouping_C257",
                // "luad_subgrouping_C294"

            ],
        },
        {
            name: 'ovarian',
            image: './images/ovaries.png',
            imageWidth: '100%',
            subtypeNames: [
                // "OCTop100C15",
                // "OCTop100C145",
                // "OCTop100C196",
                // "OCTop100C246"
                'Coming Soon'

            ],
        },
        {
            name: 'pancreas',
            image: './images/pancreas.png',
            imageWidth: '100%',
            subtypeNames: ["adenocarcinoma"],
        },
        {
            name: 'prostate',
            image: './images/prostate.png',
            imageWidth: '100%',
            subtypeNames: ["erg", "spop"],
        },
        {
            name: 'thyroid',
            image: './images/thyroid.png',
            imageWidth: '100%',
            subtypeNames: ["follicular", "papillary"],
        }
    ]);


    return (
        <div>
            <h1 style={{ marginBottom: '9vh', marginTop: '2vh' }}>Cancer Types</h1>
            <Grid container rowSpacing={{ xs: 6, sm: 12, md: 18 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                {items.map((item) => (
                    // Change the number foo in xs={foo} so that 12 / foo is the number of rows you want
                    <Grid item xs={2.4} key={item.name}>
                        <motion.div whileHover={{ scale: 1.08 }}>
                            <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: item.imageWidth }}
                                onClick={(e) => {
                                    handleMenuClick(e);
                                    setFocusedOrgan(item);
                                }}
                            />
                        </motion.div>
                        <h4>{item.name}</h4>
                        <AppBar position="static">
                            <Menu id="simple-menu" anchorEl={anchorElMenu} keepMounted open={Boolean(anchorElMenu)} onClose={handleMenuClose}>
                                {focusedOrgan.subtypeNames && focusedOrgan.subtypeNames.map((subtype) => (
                                    <div>
                                        <div onMouseEnter={(e) => handlePopoverHover(e, subtype)} onMouseLeave={handlePopoverClose}>
                                            <MenuItem onClick={() => handleOrganClick(subtype)}>
                                                {subtype}
                                            </MenuItem>
                                        </div>
                                        <Popover
                                            id="mouse-over-popover"
                                            sx={{
                                                pointerEvents: 'none',
                                            }}
                                            open={PopoverOpen}
                                            anchorEl={anchorElPopover}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            onClose={handlePopoverClose}
                                            disableRestoreFocus
                                        >
                                            <Card sx={{ maxWidth: 345 }}>
                                                <CardContent>
                                                    <Box style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <Typography gutterBottom variant='h5' component="div">
                                                            {context.subtype}
                                                        </Typography>
                                                        <div style={{ padding: '1vh' }} />
                                                        <Grid container spacing={2} >
                                                            <Box style={{ paddingLeft: '2vw' }}>
                                                                <Box textAlign="left">
                                                                    <Typography gutterBottom fontSize='100%' component="div">
                                                                        Dataset (as it appears in cBioPortal)
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        Lorem Ipsum
                                                                    </Typography>
                                                                </Box>
                                                                <div style={{ padding: '1.5vw' }} />
                                                                <Box textAlign="left">
                                                                    <Typography gutterBottom fontSize='100%' component="div">
                                                                        # of patients in cluster
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        Lorem Ipsum
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Popover>
                                    </div>
                                ))}
                            </Menu>
                        </AppBar>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}
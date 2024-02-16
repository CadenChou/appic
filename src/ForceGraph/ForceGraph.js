
import React, { useEffect, useState, useMemo, useContext, useRef } from 'react'
import { useWindowSize } from '@react-hook/window-size';
import ForceGraph3D from 'react-force-graph-3d'
import SpriteText from 'three-spritetext'
import ForceGraph2D from 'react-force-graph-2d'
import { useNavigate, useLocation } from 'react-router-dom';
import './ForceGraph.css'
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
import { AppBar, Button, Menu, MenuItem, Typography, Box } from '@mui/material';
import * as d3 from 'd3';
import * as THREE from 'three';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';
import NodeInfoTile from '../InfoTiles/NodeInfoTile/NodeInfoTile';
import HPATile from '../InfoTiles/HPATile/HPATile';
import CBioPortalTile from '../InfoTiles/CBioPortalTile/CBioPortalTile';
import GProfilerTile from '../InfoTiles/GProfilerTile/GProfilerTile';
import HGNCTile from '../InfoTiles/HGNCTile/HGNCTile';
import AppContext from '../services/AppContext';
import { getSubtypeData } from '../subtypeData/subtypeData';
import html2canvas from 'html2canvas';
import { ThreeDRotation } from '@mui/icons-material';


export default function ForceGraph() {
    const containerRef = useRef(null);

    const context = useContext(AppContext);

    const [organName, setOrganName] = useState('');
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedLink, setSelectedLink] = useState(null);
    const [subtype, setSubtype] = useState();
    const [subtypeBackend, setSubtypeBackend] = useState('');
    const [pathToGeneSet, setPathToGeneSet] = useState('')

    // So we can use react router
    const navigate = useNavigate();

    // To be used when a node is clicked
    const handleNodeClick = (node) => {
        context.setFocusedNode(node.id)
    };

    // We currently do not have any intended functionality for clicking on links
    // const handleLinkClick = (link) => {
    //     console.log("Clicked on link:", link.value);
    //     setSelectedLink(link);
    //     navigate('/protein-details', { state: { organName: organName } });
    // };

    const location = useLocation();

    // Get variable information from changing pages parameter passing
    useEffect(() => {
        if (location) {
            var temp = location.state.organName;
            var displayOrganName = temp.charAt(0).toUpperCase() + temp.slice(1);
            setOrganName(displayOrganName);
            setSubtype(location.state.subtype)
            constructGeneSetPath(temp, location.state.subtype.internalName)
        }
    }, [location])

    /* Construct the path to the gene set file for "download geneset" button */
    function constructGeneSetPath(organName, subtype) {
        const pathStringGeneSet = 'masterData/' + organName + '/' + subtype + '/' + subtype + '_geneSet.txt'
        setPathToGeneSet(pathStringGeneSet)
    }



    // File Reader
    async function appicFileReader(path) {
        var fileData = "initial";

        await fetch(path)
            .then(response => response.text())
            .then(data => { fileData = data })

        return fileData
    }

    const [pathStringGS, setPathStringGS] = useState(null);
    const [pathStringGI, setPathStringGI] = useState(null);

    // Read data and build node networks
    async function networkBuilder(organName, subtype) {

        // Build path to files
        var pathStringGS = "masterData/" + organName + "/" + subtype + "/" + subtype + "_geneSet.txt";
        var pathStringGI = "masterData/" + organName + "/" + subtype + "/" + subtype + "_interactions.txt";
        setPathStringGS(pathStringGS)
        setPathStringGI(pathStringGI)


        console.log(pathStringGS)
        // Read in genetic interaction (GI) and geneset (GS) data
        var currGSFile = await appicFileReader(pathStringGS)
        var gsArray = currGSFile.split("\n")
        var currGIFile = await appicFileReader(pathStringGI)
        var giArray = currGIFile.split("\n") //split by line


        // Initiate datastructure to pass into react-force-graph
        const myMapData = new Map()

        // Parse content of text files. Build "links" for react-force-graph input
        let currLinks = [];
        for (let i = 1; i < giArray.length - 1; i++) {
            // split by source, target, STRING
            var miniGIArray = giArray[i].split("\t")

            // Build object
            let obj = { source: miniGIArray[0], target: miniGIArray[1], value: miniGIArray[2] / 10 }

            // Add object to array
            currLinks.push(obj)
        }
        // Add array to final map structure
        myMapData["links"] = currLinks;

        // Parse content of text files. Build "nodes" for react-force-graph input
        let currNodes = [];
        for (let i = 1; i < gsArray.length; i++) {
            // split by geneName, imputed/group, value
            var miniGSArray = gsArray[i].split("\t")

            // Build object
            let obj = { id: miniGSArray[0], label: miniGSArray[0], color: 'lightBlue' }

            // Add object to array
            currNodes.push(obj)
        }
        // Add array to final map structure
        myMapData["nodes"] = currNodes

        return myMapData;
    }

    // Define null variables
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // useEffect will allow the back-end method "networkBuilder" to run after HTML loads
    useEffect(() => {
        // See above for networkBuilder
        // Builds proper datastructure to pass into react-force-graph
        // myMapData is a promise. It must compute before the HTML loads
        const myMapData = networkBuilder(location.state.organName, location.state.subtype.internalName)

        // Set data
        myMapData.then((data) => {
            setData(data);
            setIsLoading(false);
        });
    }, []);


    /*
     * Clue.io API calls
     * input is gene, output are existing drugs that target the gene
     */
    // Load gene list
    const geneList = useMemo(() => {
        let myList = []
        if (data) {
            for (let i = 0; i < data.nodes.length; i++) {
                let currNode = data.nodes[i];
                let currGeneName = currNode.id;
                myList.push(currGeneName)
            }
        }

        // Clueio moved to local data parsing. No longer needed. 
        // let filter = {
        //     "where": {
        //         "target": {
        //             "inq": myList
        //         }
        //     }
        // }
        
        // const queryString = `filter=${(JSON.stringify(filter))}`;

        const queryString = myList;

        console.log(queryString)

        return queryString;
    }, [data]);

    // Create API call
    async function clueAPICall(geneList) {       
        let searchURI = `https://api.clue.io/api/perts?` + geneList + `&user_key=814d4d42c94e6545cd37185ff4bf0270`
        // Note, this is Benjamin Ahn's unique API key!
        console.log(searchURI);
        const response = await fetch(searchURI, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const myData = response.json();

        return myData;

    }

    const [clueData, setClueData] = useState("Loading...");
    const [isClueDataLoading, setClueDataLoading] = useState(true);

    // useEffect will allow the back-end method "networkBuilder" to run after HTML loads
    //
    // Clue.io api is not very reliable, but they have an option to download their drug repurposing
    // data. Transitioning to local data and parsing method (Feb 2024, Benjamin Ahn)
    //
    // File Reader for clue data
    async function ClueDataReader(path) {
        var fileData = "initial";

        await fetch(path)
            .then(response => response.text())
            .then(data => { fileData = data })

        return fileData
    }

    // Build drug-genetarget map from local Clue data
    async function ClueDrugTargetFinder() {
        // Pick gene target and drug as a dictionary
        // geneTarget is the key, mapped to an array consisting of drugs
        const clue_geneTarget_drug_map = new Map();

        // identify local clue data
        var pathClueData = "Clueio_stable/repurposing_drugs_20180907.txt";
        var currClueFile = "blank";
        currClueFile = await ClueDataReader(pathClueData);
        var clueArray = currClueFile.split("\n");
            
        for (let i=0; i < clueArray.length; i++) {
            // iterrate through entire Clue doc. Find drug and corresponding gene target
            var currDrugInfo = clueArray[i];

            // split drug info by comma
            var currDrugInfo_split = currDrugInfo.split(",");

            // define drug and gene target
            var currDrugName = currDrugInfo_split[0];
            var currGeneTarget = currDrugInfo_split[3];

            // gene targets need to be split
            if (currGeneTarget != undefined && currDrugName != undefined) {
                var currGeneTarget_split = currGeneTarget.split("|");

                // add to map
                for (let j = 0; j < currGeneTarget_split.length; j++) {
                    currGeneTarget = currGeneTarget_split[j];

                    // check that currGeneTarget isn't just a blank var
                    if (currGeneTarget.length > 0) {
                        // if genetarget is not in dict
                        if (clue_geneTarget_drug_map.has(currGeneTarget)) {
                            var currDrugArray_temp = clue_geneTarget_drug_map.get(currGeneTarget);
                            currDrugArray_temp.push(currDrugName);
                            clue_geneTarget_drug_map.set(currGeneTarget, currDrugArray_temp);

                        } 
                        // if genetarget has existing drugs, add drug to array
                        else {
                            var currDrugArray = new Array();
                            currDrugArray.push(currDrugName);
                            clue_geneTarget_drug_map.set(currGeneTarget, currDrugArray);
                        }
                    }
                }
                
            }
        }
        return clue_geneTarget_drug_map;
    }

    useEffect(() => {
        // See above for networkBuilder
        // Builds proper datastructure to pass into react-force-graph
        // myData is a promise. It must compute before the HTML loads
        console.log(geneList);

        const myClueData = ClueDrugTargetFinder();



        // Set clueData
        myClueData.then((clueDataMap) => {
            let myStringData = [] // stored as array of drug, gene name

            // parse through geneList. If a drug exists that targets the gene, find it
            console.log(geneList);
            for (let i = 0; i < geneList.length; i++) {
                var currGene = geneList[i];
                
                // if the gene is in the map, then find the drug
                if (clueDataMap.has(currGene)) {
                    var arrayOfDrugs = clueDataMap.get(currGene);

                    for (let j = 0; j < arrayOfDrugs.length; j++) {
                        var currDrug = arrayOfDrugs[j];
                        myStringData.push(currDrug);
                        myStringData.push(currGene);
                    }
                }

            }

            // for (let i = 0; i < clueData.length; i++) {
            //     let currResult = clueData[i]

            //     let currDrug = currResult.pert_iname;

            //     let currListOfGeneTargets = currResult.target
            //     for (var j = 0; j < currListOfGeneTargets.length; j++){
            //         var currGeneTarget = currListOfGeneTargets[j]
            //         if (geneList.includes(currGeneTarget)) {
            //             // pull data
            //             myStringData.push(currResult.pert_iname) //drug name
            //             myStringData.push(currGeneTarget) //gene target
            //         }    
            //     }
                
            // }

            setClueData(myStringData);
            setClueDataLoading(true);
            console.log(myStringData);
        });
    }, [geneList]); //rebuild HTML after the proteinList is generated and API call is ran

    const clueFinalData = useMemo(() => {
        if (clueData) {
            return {
                clueData
            };
        }
    }, [clueData]);

    // Add Clue.io to table HTML

    // Build table

    //build table data
    const [tableData, setTableData] = useState([]);
    useEffect(() => {
        //build table data
        //clueData is a list, where clueData[0] = drugName and clueData[1] is the corresponding gene target
        //the list continues in an alternating fashion such that clueData[2] is the next drug name and clueData[3] is the next gene target
        if (clueData != "Loading...") {
            for (var i = 0; i < clueData.length; i++) {
                var currDrug = clueData[i]
                var currGeneTarget = clueData[i + 1]

                tableData.push({ drugName: currDrug, geneTarget: currGeneTarget });

                i++ //skip
            }

            setTableData(tableData);
        }

    }, [clueData])

    const generateTableRows = () => {
        return tableData.map((row) => (
            <tr>
                <td>{row.drugName}</td>
                <td>{row.geneTarget}</td>
            </tr>
        ));
    };

    useEffect(() => {
        generateTableRows();
    }, [tableData])


    // Adjust graphData nodes by color based on Clue.io
    const graphData = useMemo(() => {
        if (data) {
            if (clueFinalData) {
                for (let j = 1; j < clueFinalData.clueData.length; j++) {
                    var currDrugTarget = clueFinalData.clueData[j]
                    j++

                    for (let i = 0; i < data.nodes.length; i++) {
                        var currNode = data.nodes[i]
                        if (currDrugTarget == currNode.id) {
                            data.nodes[i].color = 'red'
                        }
                    }
                }

                return {
                    nodes: data.nodes,
                    links: data.links,
                };
            }
        }
    }, [clueFinalData]);

    // Handle node size
    var [nodeSizes, setNodeSizes] = useState();
    var [connections] = useState({});
    const [nodeSizeLoading, setNodeSizeLoading] = useState();
    useEffect(() => {
        if (graphData) {
            data.links.forEach((link) => {
                const { source, target } = link;
                connections[source] = (connections[source] || 0) + 1;
                connections[target] = (connections[target] || 0) + 1;
            });
            setNodeSizes(connections)

        }
    }, [graphData])



    //Handle colors
    const handleLinkColor = (link) => {
        const value = link.value;
        const maxVal = Math.max(...data.links.map((link) => link.value)); // get maximum value
        const minColor = 'white'; // minimum color
        const maxColor = 'grey'; // maximum color
        const colorScale = d3.scaleLinear().domain([0, maxVal]).range([minColor, maxColor]); // define color scale
        return colorScale(value); // return color based on value
    };


    //Loading screens for HTML as APIs run
    const handleEngineInitialized = (engine) => {
        engine.d3Zoom.scaleTo(2); // sets initial zoom level to 2x
    };

    // For API Info Tiles
    const handleAPIButtonClick = (api) => {
        context.setCurrAPI(api)
    }

    // For Node Diagram Tiles
    const handleDiagramDimensionClick = (dimension) => {
        context.setCurrDimension(dimension)
    }

    // This allows for the graph to have a width and height that is responsive to the actual device screen size
    const [graphWidth, setGraphWidth] = useState(window.innerWidth);
    const [graphHeight, setGraphHeight] = useState(window.innerHeight);
 
    useEffect(() => {
        const handleResize = () => {
            setGraphWidth(window.innerWidth);
            setGraphHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [graphWidth]);


    // Load protein list
    const proteinList = useMemo(() => {
        let myList = []
        if (data) {
            for (let i = 0; i < data.nodes.length; i++) {
                let currNode = data.nodes[i];
                let currGeneName = currNode.id;
                myList.push(currGeneName)
            }
        }
        return myList;
    }, [data]);


    // Create POST API calls
    async function gProfilerAPICall(proteinList) {
        console.log('running');
        console.log(proteinList);
        const response = await fetch('https://biit.cs.ut.ee/gprofiler/api/gost/profile/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'organism': 'hsapiens',
                'query': proteinList
            }),
        });
        const myData = response.json();
        console.log("received");

        return myData;

    }

    const [gData, setGData] = useState("Loading...");
    const [isGDataLoading, setGDataLoading] = useState(true);

    // useEffect will allow the back-end method "networkBuilder" to run after HTML loads
    useEffect(() => {
        // See above for networkBuilder
        // Builds proper datastructure to pass into react-force-graph
        // myData is a promise. It must compute before the HTML loads
        const myData = gProfilerAPICall(proteinList);


        // Set gData
        myData.then((gData) => {
            var checkDataReceived = gData['result'];
            if (checkDataReceived != null) {
                let myStringData = []
                for (let i = 0; i < gData['result'].length; i++) {
                    let currResult = gData.result[i]

                    // pull data
                    myStringData.push(currResult.description)
                    // var roundedNum = currResult.p_value.toPrecision(3);
                    var pvalue = currResult.p_value;
                    const roundedNum = pvalue.toExponential(3);
                    myStringData.push(roundedNum);
                }
                setGData(myStringData);
                setGDataLoading(false);

            }

        });
    }, [proteinList]); //rebuild HTML after the proteinList is generated and API call is ran

    //build table data
    const [gtableData, setgTableData] = useState([]);

    useEffect(() => {
        //build table data
        //clueData is a list, where clueData[0] = drugName and clueData[1] is the corresponding gene target
        //the list continues in an alternating fashion such that clueData[2] is the next drug name and clueData[3] is the next gene target
        if (gData != "Loading...") {
            for (var i = 0; i < gData.length; i++) {
                var currPathway = gData[i]
                var currPvalue = gData[i + 1]

                gtableData.push({ pathway: currPathway, pvalue: currPvalue });

                i++ //skip
            }
        }

    }, [gData])

    const generategTableRows = () => {
        return gtableData.map((row) => (
            <tr>
                <td>{row.pathway}</td>
                <td>{row.pvalue}</td>
            </tr>
        ));
    };

    useEffect(() => {
        generategTableRows();
    }, [gtableData])

    async function captureScreenshot() {
        const targetElement = document.getElementById('nodeDiagram'); // Change this to the ID of the element you want to capture

        if (targetElement) {
            try {
                const canvas = await html2canvas(targetElement);
                const screenshotUrl = canvas.toDataURL('image/png');
                console.log(screenshotUrl)
                // Open the screenshot URL in a new tab
                const newTab = window.open();
                newTab.document.write('<img src="' + screenshotUrl + '" alt="Screenshot"/>');
            } catch (error) {
                console.error('Error capturing screenshot:', error);
            }
        }
    }

    const [labelsVisible, setLabelsVisible] = useState(true); // State for label visibility



    // Final HTML return
    return (
        <div style={{ height: "100%", marginRight: "1%" }}>
            <div id="allTiles">
                <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: '3%' }}>
                    <Button onClick={() => handleAPIButtonClick("HPA")} variant='contained'>
                        <Typography class="buttonText">Human Protein Atlas</Typography>
                    </Button>
                    <Box sx={{ paddingRight: 3 }} />
                    <Button onClick={() => handleAPIButtonClick("HGNC")} variant='contained'>
                        <Typography class="buttonText">HGNC</Typography>
                    </Button>
                    <Box sx={{ paddingRight: 3 }} />
                    <Button onClick={() => handleAPIButtonClick("GPROFILER")} variant='contained'>
                        <Typography class="buttonText">GProfiler</Typography>
                    </Button>
                    <Box sx={{ paddingRight: 3 }} />
                    <Button onClick={() => handleAPIButtonClick("CLUE")} variant='contained'>
                        <Typography class="buttonText">CLUE</Typography>
                    </Button>
                    <Box sx={{ paddingRight: 3 }} />
                    <Button onClick={() => handleAPIButtonClick("CBIOPORTAL")} variant='contained'>
                        <Typography class="buttonText">CBioPortal</Typography>
                    </Button>
                </Box>

                {/* Ternary operator (like if statement) so only one info tile is rendered at a time */}
                {context.currAPI === "HPA" ?
                    <HPATile />
                    : context.currAPI === "HGNC" ?
                        <HGNCTile />

                        : context.currAPI === "GPROFILER" ?
                            <div style={{ border: '1px solid black' }}>
                                <p class='tileDescription'>
                                    All proteins are inputed into <b><a href = "https://biit.cs.ut.ee/gprofiler/" target = "_blank">gProfiler</a></b>. Output includes involved biological pathways and associated p-values.
                                </p>
                                <p style={{ fontSize: '2vh' }}>May take a few seconds to load</p>
                                <div id="gprofTableDiv">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Pathway</th>
                                                <th>p-value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {generategTableRows()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            : context.currAPI === "CLUE" ?
                                <div style={{ border: '1px solid black', maxHeight: (context.currAPI === "CLUE") ? '100%' : '10%' }}>
                                    <p style={{ fontSize: "2vh" }}>
                                        Proteins in network are inputed into <b><a href = "https://clue.io" target = "_blank">Clue.io</a></b>. Proteins with existing drugs are displayed and highlighted in red in the network diagram.
                                    </p>
                                    <div id="clueioTableDiv">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Drug Name</th>
                                                    <th>Gene Target</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {generateTableRows()}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                : context.currAPI === "CBIOPORTAL" ?

                                    <CBioPortalTile />
                                    :
                                    <div />

                }

            </div>
            <div style={{ width: "50%" }}>
                <div style={{ display: 'flex', flexDirection: 'column', width: "100%", float: "left" }}>
                    {/* <h1 style={{ marginTop: '5vh', marginBottom: '1vh', width: "100%", fontSize: '5.2vh', float: 'left' }}>{organName}: {location.state.subtype.displayName}</h1> */}

                    <h1 style={{ fontSize: '2vh', float: 'left', width: "100%", margin: "0%", paddingTop: "5%" }}>{location.state.subtype.dataset}</h1>
                    <h1 style={{ fontSize: '2vh', float: 'left', width: "100%", margin: "0%" }}>Subtype: {location.state.subtype.fullName}</h1>
                    <h1 style={{ fontSize: '2vh', float: 'left', width: "100%", margin: "0%", marginBottom: "1%", }}>Patient Count: {location.state.subtype.patients}</h1>
                    <h1 style={{ fontSize: '2vh', float: 'left', width: "100%" }}>Toggled Gene: {context.focusedNode}</h1>    
                </div>
                    <div style={{width: "100%"}}>

                        <div class="button-container">
                            <button onClick={() => handleDiagramDimensionClick("2D")} class = "force-button">
                                <Typography class="buttonText">2D</Typography>
                            </button>
                            <button onClick={() => handleDiagramDimensionClick("3D")} class='force-button'>
                                <Typography class="buttonText">3D</Typography>
                            </button>
                            <a href={pathStringGS} target = "blank">
                                <button class='force-button'>
                                    <Typography class="buttonText">Gene Set Data</Typography>
                                </button>
                            </a>
                            <a href={pathStringGI} target = "blank">
                                <button class='force-button'>
                                    <Typography class = "buttonText">Gene Interaction Data</Typography>
                                </button>
                            </a>
                            <button onClick={() => setLabelsVisible(!labelsVisible)} class='force-button'>
                                <Typography class="buttonText">Toggle Labels</Typography>
                            </button>

                            <button onClick={() => captureScreenshot()} class = "force-button">
                                <Typography class = "buttonText">Capture Screenshot</Typography>
                            </button>
                        </div>
                    </div>


                {context.currDimension === "3D" ?
                    <div id="nodeDiagram" style={{marginLeft: "2%"}}>
                    <ForceGraph3D
                        graphData={graphData}
                        width={graphWidth/2.3}
                        height={graphHeight/1.7}
                        linkWidth={link => link.value / 40}
                        linkColor={handleLinkColor} // sets the color of the links based on their value
                        
                        cooldownTicks={4}
                        d3VelocityDecay={0.7} // reduces the velocity decay
                        d3AlphaDecay={0.01} // reduces the alpha decay
                        onEngineInitialized={handleEngineInitialized}
                        minZoom={2} // sets minimum zoom level
                        maxZoom={10} // sets maximum zoom level
                        backgroundColor = "white"
                        nodeLabel = "id"
                        


                        nodeThreeObject={(node) => {
                            // Create a custom three.js object for each node
                            
                            // node size and scaling by number of connections
                            var size = 1;
                            if (nodeSizes) {
                                size = size + nodeSizes[node.id]
                            }

                            const nodeSize = size; // Adjust this value to change the node size
                        
                            // Create a sphere geometry with the desired size
                            const geometry = new THREE.SphereGeometry(nodeSize);
                        
                            // Create a material (e.g., using a predefined color)
                            const material = new THREE.MeshBasicMaterial({ color: node.color });
                        
                            // Create a mesh using the geometry and material
                            const mesh = new THREE.Mesh(geometry, material);

                            // Create an outer sphere with a black outline
                            // const outerGeometry = new THREE.SphereGeometry(nodeSize + 0.5); // Slightly larger size
                            // const outerMaterial = new THREE.MeshBasicMaterial({ color: 'black', side: THREE.BackSide }); // BackSide ensures the outline is visible
                            // const outerMesh = new THREE.Mesh(outerGeometry, outerMaterial);
                            // outerMesh.add(mesh);

                            const label = new SpriteText(node.id);
                            label.color = 'black';
                            label.scale.set(10, 10, 1);
                            label.position.y = nodeSize * 1.5;
                            label.visible = labelsVisible;
                            mesh.add(label);
                            // commented out because no outer sphere
                            // outerMesh.add(label);

                        
                            // Return the mesh as the three.js object for the node
                            //return outerMesh;
                            return mesh;
                        }}

                        // When the node is clicked
                        onNodeClick={handleNodeClick}
                        // onLinkClick={handleLinkClick}
                        nodeAutoColorBy='label'
                        enableNodeDrag={true}
                        onNodeDragEnd={(node, force) => {
                            console.log(node);
                        }}

                        />
                    </div>
                    : context.currDimension === "2D" ?
                        <div id="nodeDiagram" style={{marginLeft: "2%"}}>
                        <ForceGraph2D
                            graphData={graphData}
                            width={graphWidth/2.3}
                            height={graphHeight/1.7}
                            linkWidth={link => link.value / 40}
                            linkColor={handleLinkColor} // sets the color of the links based on their value
                            cooldownTicks={4} // prevent nodes from dragging back into center
                            d3VelocityDecay={0.7} // reduces the velocity decay
                            d3AlphaDecay={0.01} // reduces the alpha decay
                            onEngineInitialized={handleEngineInitialized}
                            minZoom={2} // sets minimum zoom level
                            maxZoom={5} // sets maximum zoom level

                            // nodeAutoColorBy="group"          
                            nodeCanvasObject={(node, ctx, globalScale) => {
                                var label = "";
                                if (labelsVisible) {
                                    label = node.id;
                                }
                                const fontSize = 8 / globalScale;
                                ctx.font = `${fontSize}px Sans-Serif`;

                                // node size and scaling by number of connections
                                var size = fontSize
                                if (nodeSizes) {
                                    size = size + nodeSizes[node.id]
                                }
                                
                                // draw circle around text label
                                ctx.beginPath();
                                ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
                                ctx.fillStyle = node.color;
                                ctx.fill();

                                // Node text styling
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = 'black';
                                ctx.fillText(label, node.x, node.y);

                            }}
                            // When the node is clicked
                            onNodeClick={handleNodeClick}
                            // onLinkClick={handleLinkClick}
                            nodeAutoColorBy='label'
                            enableNodeDrag={true}
                            onNodeDragEnd={(node, force) => {
                                console.log(node);
                            }}
                            />
                        </div>
                        :
                        <div />

                }

                <div>
                    <div style={{width:'50%', float: 'left'}}>
                        <h1 style={{fontSize: '2vh'}}>Info</h1>
                        <h1 style={{ fontSize: '2vh', textAlign: 'left', marginLeft: "2%"}}>
                            <span class="blueDot"></span>
                            Default color is blue. 
                            <br></br>
                            <span class="redDot"></span>
                            Proteins with existing drugs are red.
                            <br></br>
                            <div id="outer-circle">
                                <div id="inner-circle">
                                </div>
                            </div>
                            Larger size indicates more interactions.
                        </h1>
                    </div>

                    <div style={{width:"50%", float: 'left', textAlign: 'center'}}>
                        <h1 style={{fontSize: '2vh', }}>User tips</h1>
                        <h1 style={{ fontSize: '2vh'}}>
                            Scroll to zoom in and out.
                            <br></br>Toggle labels is only functional for 3D graph.
                            <br></br>Drag entire graph by click on an edge.
                        </h1>
                    </div>                   
                </div>
            </div>
        </div>

    )
}

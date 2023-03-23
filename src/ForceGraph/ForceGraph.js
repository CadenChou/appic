
import React, { useEffect, useState, useMemo } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { useNavigate, useLocation } from 'react-router-dom';
import './ForceGraph.css'
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from '@mui/material';



export default function ForceGraph() {

    const [organName, setOrganName] = useState('');
    const [subtype, setSubtype] = useState('');
    const [subtypeBackend, setSubtypeBackend] = useState('');

    // So we can use react router
    const navigate = useNavigate();

    // To be used when a node is clicked
    const handleNodeClick = (node) => {
        console.log('Node has been clicked');
        navigate('/protein-details', { state: { organName: organName } });
    };

    const location = useLocation();

    useEffect(() => {
        if (location) {
            console.log(location.state.organName);
            setOrganName(location.state.organName);
            setSubtype(location.state.subtype)


        }
    }, [location])




    /*
     * File Reader
     * This function is a text parser, importing cancer subtype genetic data 
     */
    async function appicFileReader(path) {
        var fileData = "initial";

        await fetch(path)
            .then(response => response.text())
            .then(data => {fileData = data})

        //console.log(fileData)
        return fileData
    }


    // Read data and build node networks
    async function networkBuilder(organName, subtype) {

        // Build path to files
        var pathStringGS = "masterData/" + organName + "/" + subtype + "/" + subtype + "_geneSet.txt";
        var pathStringGI = "masterData/" + organName + "/" + subtype + "/" + subtype + "_interactions.txt";
    
        console.log(pathStringGI)
        // Read in genetic interaction (GI) and geneset (GS) data
        var currGSFile = await appicFileReader(pathStringGS)
        var gsArray = currGSFile.split("\n")
        var currGIFile = await appicFileReader(pathStringGI)
        var giArray = currGIFile = currGIFile.split("\n") //split by line


        // Initiate datastructure to pass into react-force-graph
        const myMapData = new Map()

        // Parse content of text files. Build "links" for react-force-graph input
        let currLinks = [];
        for (let i = 1; i < giArray.length - 1; i++) {
            // split by source, target, STRING
            var miniGIArray = giArray[i].split("\t")

            // Build object
            let obj = { source: miniGIArray[0], target: miniGIArray[1], value: miniGIArray[2]/10}

            // Add object to array
            currLinks.push(obj)
        }
        // Add array to final map structure
        myMapData["links"] = currLinks;

        // Parse content of text files. Build "nodes" for react-force-graph input
        let currNodes = [];
        for (let i = 1; i < gsArray.length - 1; i++) {
            // split by geneName, imputed/group, value
            var miniGSArray = gsArray[i].split("\t")

            // Build object
            let obj = {id: miniGSArray[0], label: miniGSArray[0]}

            // Add object to array
            currNodes.push(obj)
        }
        // Add array to final map structure
        myMapData["nodes"] = currNodes
        

        return myMapData;
    }


    // Execute functions in the proper order
    // First define null variables such that the page can still load while back-end methods are running
    // Then call back-end methods, and hand off to front end for display


    // Define null variables
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // useEffect will allow the back-end method "networkBuilder" to run after HTML loads
    useEffect(() => {
        // See above for networkBuilder
        // Builds proper datastructure to pass into react-force-graph
        // myMapData is a promise. It must compute before the HTML loads
        const myMapData = networkBuilder(location.state.organName, location.state.subtype)
        
        // Set data
        myMapData.then((data) => {
            setData(data);
            setIsLoading(false);
        });
    }, []);
    

    const graphData = useMemo(() => {
        if (data) {
          return {
            nodes: data.nodes,
            links: data.links
          };
        }
    }, [data]);

    // Create GET API calls
    // const userActionGet = async () => {
    //     const response = await fetch('http://example.com/movies.json');
    //     const myJson = await response.json(); //extract JSON from the http response
    //     // do something with myJson
    // }

    

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
        const response = await fetch('https://biit.cs.ut.ee/gprofiler/api/gost/profile/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            'organism':'hsapiens',
            'query':proteinList
          }),
        });
        const myData = response.json();

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
            let myStringData = []
            for (let i = 0; i < 5; i++) {
                let currResult = gData.result[i]

                // pull data
                myStringData.push(currResult.description)
                myStringData.push(currResult.p_value)

            }
            setGData(myStringData);
            setGDataLoading(false);
        });
    }, [proteinList]); //rebuild HTML after the proteinList is generated and API call is ran

    const gProfData = useMemo(() => {
        if (gData) {
          return {
            gData
          };
        } 
    }, [gData]);


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

        let filter = {
            "where": {
                "gene_symbol": {
                    "ing": myList
                }
            }
        }

        const queryString = `filter=${encodeURIComponent(JSON.stringify(filter))}`;

        return queryString;
    }, [data]);

    // Create API call
    async function clueAPICall(geneList) {
        let searchURI = `https://api.clue.io/api/rep_drug_targets/?{queryString}%22%7D%7D&user_key=814d4d42c94e6545cd37185ff4bf0270`
            // Note, this is Benjamin Ahn's unique API key!
        const response = await fetch(searchURI, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const myData = response.json();
        console.log(response)

        return myData;

    }

    const [clueData, setClueData] = useState("Loading...");
    const [isClueDataLoading, setClueDataLoading] = useState(true);

    // useEffect will allow the back-end method "networkBuilder" to run after HTML loads
    useEffect(() => {
        // See above for networkBuilder
        // Builds proper datastructure to pass into react-force-graph
        // myData is a promise. It must compute before the HTML loads
        const myData = clueAPICall(geneList);
        
        // Set clueData
        myData.then((clueData) => {
            let myStringData = []
            for (let i = 0; i < clueData.length; i++) {
                let currResult = clueData[i]

                let tempGeneName = currResult.name
                if (geneList.includes(tempGeneName)) {
                    // pull data
                    myStringData.push(currResult.pert_iname) //drug name
                    myStringData.push(currResult.name) //gene target
                }                

            }
            setClueData(myStringData);
            setClueDataLoading(true);
        });
    }, [geneList]); //rebuild HTML after the proteinList is generated and API call is ran

    const clueFinalData = useMemo(() => {
        if (clueData) {
          return {
            clueData
          };
        } 
    }, [clueData]);



    //Final Step

    // If node data is not present, show a loading screen
    if (isLoading) {
        return <div>Loading...</div>;
    }


    
    // Final HTML return
    return (
        <div>
            <div className='button-div'>
                <Button
                    variant='contained'
                    onClick={() => {
                        navigate('/body-diagram')
                    }}>
                    Go back to body diagram
                </Button>
            </div>
            <div style={{display:'flex', justifyContent:"center"}}>
                <h1 style={{ marginTop: '5vh', marginBottom: '-10vh', width: "60%" }}>{organName} ({subtype}) Cancer PPI Network</h1>
            </div>
            <div class='container-fluid d-flex'>
                <div className='col-md-9'>
                    <ForceGraph2D
                        graphData={graphData}
                        linkWidth={link => link.value}
                        nodeSpacing={100}
                        damping={0.9}
                        //nodeAutoColorBy="group"
                        nodeCanvasObject={(node, ctx, globalScale) => {
                            const label = node.id;
                            const fontSize = 12 / globalScale;
                            ctx.font = `${fontSize}px Sans-Serif`;
                            const textWidth = ctx.measureText(label).width;
                            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

                            // draw circle around text label
                            ctx.beginPath();
                            ctx.arc(node.x, node.y, bckgDimensions[0] / 2, 0, 2 * Math.PI);
                            ctx.fillStyle = 'lightblue';
                            ctx.fill();

                            // Node text styling
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = 'black';
                            ctx.fillText(label, node.x, node.y);

                            node.__bckgDimensions = bckgDimensions;
                            // Not too sure about this stuff
                            node.pointerArea = {
                                left: node.x - bckgDimensions[0] / 2,
                                right: node.x + bckgDimensions[0] / 2,
                                top: node.y - bckgDimensions[1] / 2,
                                bottom: node.y + bckgDimensions[1] / 2,
                            };
                        }}
                        // When the node is clicked
                        onNodeClick={handleNodeClick}
                    />
                </div>
                <div className='col-md-3' style={{ border: '1px solid black' }}>
                    <h2>Cancer Subtype</h2>
                    <h4>Clue.io: drugs w relevant targets</h4>
                    <p>{clueFinalData.clueData.toString()}</p>
                    <h4>gProfiler: first 5 results</h4>
                    <p>{gProfData.gData.toString()}</p>
                </div>
            </div>
        </div>
    )
}

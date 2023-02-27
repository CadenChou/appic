
import React, { useEffect, useState, useMemo } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { useNavigate, useLocation } from 'react-router-dom';
import './ForceGraph.css'
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from '@mui/material';





export default function ForceGraph() {
    // sample data
    // "Attach (source) to (target)" for links
    // Not sure if label is needed
    var exampleData = {
        nodes: [
            { id: 'Protein 1', label: 'Protein' },
            { id: 'Protein 2', label: 'Protein 2' },
            { id: 'Protein 3', label: 'Protein 3' },
            { id: 'Protein 4', label: 'Protein 4' },
            { id: 'Protein 5', label: 'Protein 6' },
            { id: 'Protein 6', label: 'Protein 7' },
            { id: 'Protein 7', label: 'Protein 8' },
            { id: 'Protein 8', label: 'Protein 9' },
        ],
        links: [
            { source: 'Protein 1', target: 'Protein 2', value: 5 },
            { source: 'Protein 2', target: 'Protein 3', value: 3 },
            { source: 'Protein 4', target: 'Protein 3', value: 2 },
            { source: 'Protein 2', target: 'Protein 5', value: 3 },
            { source: 'Protein 8', target: 'Protein 5', value: 4 },
            { source: 'Protein 7', target: 'Protein 5', value: 2 },
            { source: 'Protein 6', target: 'Protein 8', value: 1 },
        ]
    }

    const [organName, setOrganName] = useState('');

    // So we can use react router
    const navigate = useNavigate();

    // To be used when a node is clicked
    const handleNodeClick = (node) => {
        console.log('Node has been clicked');
        navigate('/protein-details', {state: {organName: organName}});
    };

    const location = useLocation();

    useEffect(() => {
        if (location) {
            console.log(location.state.organName);
            setOrganName(location.state.organName);
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
            let obj = { source: miniGIArray[0], target: miniGIArray[1], value: miniGIArray[2]}

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


    const myMapData = networkBuilder("breast", "brca_MMRdeficient")
    // myMapData is a promise. It must compute before the HTML loads

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        myMapData.then((data) => {
            setData(data);
            setIsLoading(false);
        });
    }, [myMapData]);
    

    const graphData = useMemo(() => {
        if (data) {
          return {
            nodes: data.nodes,
            links: data.links
          };
        }
    }, [data]);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    

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
            <h1 style={{marginTop: '5vh', marginBottom: '-10vh'}}>{organName} Cancer PPI Network</h1>
            <div class='container-fluid d-flex'>
                <div className='col-md-9'>
                    <ForceGraph2D
                        graphData={graphData}
                        linkWidth={link => link.value}
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
                </div>
            </div>
        </div>
    )
}

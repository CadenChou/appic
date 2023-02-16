/*
 * This makes an API call to GProfiler, which is key for biolfunction
 * 
 * @author Benjamin Ahn
 * @version 1.0
 * 
 * General commandline runtime notes
 * 
* Runs in terminal as java GProfilerAPI.java
export JAVA_HOME=/usr/share/java
export PATH=$PATH:$JAVA_HOME/bin
export JSON_JAVA=/home/benjamin/Documents/CS/json
export CLASSPATH=$CLASSPATH:$JSON_JAVA/json-simple-1.1.1.jar:.
 *
 * 
 */

//package net.javaguides.network;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.DataOutputStream;
import org.json.simple.parser.JSONParser;
import java.util.ArrayList;
import org.json.simple.*;
import java.util.Iterator;
import java.util.Set;

public class GProfilerAPI {

    /*
     * This method sends a request to G:GOSt, and receives A gene-ontology result
     * @param list of gene objects
     */
    public ArrayList<String> getRequest(ArrayList<Gene> geneSet) throws Exception {
        // Build url search string
        String urly = "https://biit.cs.ut.ee/gprofiler/api/gost/profile/";
        URL obj = new URL(urly);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();

        System.out.println("***SENDING G:GOSt API CALL***");

        // Build gene search string
        String searchGenes = "";
        for (int i = 0; i < geneSet.size(); i++) {
            Gene currGene = geneSet.get(i);
            String currGeneName = currGene.getGeneName();

            if (i != geneSet.size() - 1) {
                searchGenes = searchGenes + "\"" + currGeneName + "\"" + ",";
            } else { // no comma if last gene
                searchGenes = searchGenes + "\"" + currGeneName + "\"";
            }
            
        }


        String searchString = "{ " + 
            "\"organism\": \"hsapiens\", " + 
            "\"query\": [" + searchGenes + "], " +
            "\"sources\": [\"GO\"]" +
            //"\"user_threshold\": 1e-4" +
            //"\"no_evidences\": True" +
            "}";

        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type","application/json");


        //Send request
        con.setDoOutput(true);
        DataOutputStream wr = new DataOutputStream(con.getOutputStream());
        wr.writeBytes(searchString);
        wr.flush();
        wr.close();

        int responseCode = con.getResponseCode();
        System.out.println("Response Code : " + responseCode);

        BufferedReader iny = new BufferedReader(
        new InputStreamReader(con.getInputStream()));
            String output;
            StringBuffer response = new StringBuffer();

            while ((output = iny.readLine()) != null) {
                response.append(output);
            }
            iny.close();

            //printing result from response
            String responseStr = response.toString();
            //System.out.println(responseStr);

            // Response to JSONArray
            JSONObject myObj = null;
            JSONParser parser = new JSONParser();
            Object json = parser.parse(responseStr);
            myObj = (JSONObject) json;

            // Parse and print out search results from JSON
            ArrayList<String> myDescriptors = parseJson(myObj);

            return myDescriptors;

    }


    /*
     * Parses the search results and prints
     * @return JSONArray of biological functions of the queried genes
     */
    public static ArrayList<String> parseJson(JSONObject jsonObject) throws Exception {

        // Final data structure from function
        ArrayList<String> biolFunctDescriptors = new ArrayList<String>();

        Set<Object> set = jsonObject.keySet();
        Iterator<Object> iterator = set.iterator();
        while (iterator.hasNext()) {
            // where obj is a key for JSONArray
            Object obj = iterator.next();

            // Pull descriptions!
            if (obj.equals("description")) {
                String currDescriptor = jsonObject.get(obj).toString();
                System.out.println(currDescriptor);

                // FIX THIS FUNCTION
                biolFunctDescriptors.add(currDescriptor);
            }
            
            // Continue parsing through other JSON keys
            if (jsonObject.get(obj) instanceof JSONArray) {
                // access value of JSON key if an array
                //System.out.println(obj.toString()); // Print key
                getArray(jsonObject.get(obj)); // Print array
            } else {
                if (jsonObject.get(obj) instanceof JSONObject) {
                    parseJson((JSONObject) jsonObject.get(obj));
                } else {
                    // Print out string output
                    //System.out.println(obj.toString() + "\t"
                    //        + jsonObject.get(obj));
                }
            }
        }

        return biolFunctDescriptors;
    }

    /*
     * a nested function, critical for the parseJson function
     */
    public static void getArray(Object object2) throws Exception {

        JSONArray jsonArr = (JSONArray) object2;
    
        for (int k = 0; k < jsonArr.size(); k++) {
    
            if (jsonArr.get(k) instanceof JSONObject) {
                parseJson((JSONObject) jsonArr.get(k));
            } else {
                //.out.println(jsonArr.get(k));
            }
    
        }
    }

    public static void main (String args[]) throws Exception {

        // Testing the API call
        System.out.println("Sending request");

        GProfilerAPI myGProfilerCaller = new GProfilerAPI();

        Gene g1 = new Gene("CASQ2", "origin1", 2);
        Gene g2 = new Gene("DMD", "origin2", 2);
        ArrayList<Gene> myGenes = new ArrayList<Gene>();
        myGenes.add(g1);
        myGenes.add(g2);
        //myGenes.add(g3)
        ArrayList<String> myDescriptors = myGProfilerCaller.getRequest(myGenes);

        System.out.println(myDescriptors);
    }
}

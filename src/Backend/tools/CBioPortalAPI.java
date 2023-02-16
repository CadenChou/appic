/*
 * This class will make API calls to the cBioPortal
 * Functionality includes searching a tissue type
 * Future functionality
 * - finding a study, pulling clinical data from it
 * 
 * @author Benjamin Ahn
 * @version 1.0
 * export JAVA_HOME=/usr/share/java
export PATH=$PATH:$JAVA_HOME/bin
export JSON_JAVA=/home/benjamin/Documents/CS/json
export CLASSPATH=$CLASSPATH:$JSON_JAVA/json-simple-1.1.1.jar:.
 *
 * 
 */

import java.net.http.HttpRequest;
import java.net.http.HttpClient;
import java.net.URI;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import org.json.simple.parser.JSONParser;
import java.util.ArrayList;


public class CBioPortalAPI {
    
    /*
     * make API call to cBioPortal
     */
    public Object getRequest(String tissueType) throws Exception {
        // Build url search string

        String searchURI = "https://www.cbioportal.org/api/cancer-types/" + tissueType;

        // Send api request
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
             .uri(URI.create(searchURI))
             .build();

        // Synchronous response as String
        System.out.println("***MAKING API CALL TO cBioPortal ***");
        HttpResponse<String> response = client.send(request, BodyHandlers.ofString());
        String responseStr = response.body();

        // Response to JSONArray
        JSONParser parser = new JSONParser();
        Object json = parser.parse(responseStr);

        return json;

    }


    public static void main(String[] args) throws Exception {

        System.out.println("Sending request");

        CBioPortalAPI myCBioPortalCaller = new CBioPortalAPI();

        Gene g1 = new Gene("CASQ2", "origin1", 2);
        Gene g2 = new Gene("DMD", "origin2", 2);
        ArrayList<Gene> myGenes = new ArrayList<Gene>();
        myGenes.add(g1);
        myGenes.add(g2);

        Object myresults = myCBioPortalCaller.getRequest("breast");

        System.out.println(myresults);
    }
}

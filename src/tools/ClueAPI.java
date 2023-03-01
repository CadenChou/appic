/*
 * This class will make API calls to the Clue
 * specifically for drug repurposing
 * Returns a list of compounds targeting the input gene
 * 
 * @author Benjamin Ahn
 * @version 1.0
 */

 import java.net.http.HttpRequest;
 import java.net.http.HttpClient;
 import java.net.URI;
 import java.net.http.HttpResponse;
 import java.net.http.HttpResponse.BodyHandlers;
 import org.json.simple.*;
 import org.json.simple.parser.JSONParser;
 import java.util.ArrayList;
 import java.net.http.HttpRequest.BodyPublishers;
 

public class ClueAPI {
    
    /*
     * make API call to cBioPortal
     * return list of compounds targeting gene
     */
    public Object getRequest(Gene aGene) throws Exception {
        // Build url search string
        String geneName = aGene.getGeneName();
        
        String searchURI = "https://api.clue.io/api/rep_drug_targets/?filter=%7B%22where%22:%7B%22name%22:%22"
            + geneName
            + "%22%7D%7D&user_key=490c703605bdb32e7e0244c403d9fc4f";
       
        // Send api request
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
             .uri(URI.create(searchURI))
             .build();

        // Synchronous response as String
        System.out.println("***MAKING API CALL TO Clue ***");
        HttpResponse<String> response = client.send(request, BodyHandlers.ofString());
        String responseStr = response.body();

        // Response to JSONArray
        JSONObject myObj;
        JSONParser parser = new JSONParser();
        Object json = parser.parse(responseStr);

        return json;

    }


    public static void main(String[] args) throws Exception {

        System.out.println("Sending request");

        Gene braf = new Gene("BRAF", "blank", 1.0);

        ClueAPI myClueCaller = new ClueAPI();
        Object myresults = myClueCaller.getRequest(braf);

        System.out.println(myresults);
    }

}

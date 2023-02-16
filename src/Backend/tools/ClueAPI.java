/*
 * This class will make API calls to the Clue
 * specifically for drug repurposing
 * Returns a list of compounds targeting the input gene
 * 
 * @author Benjamin Ahn
 * @version 1.0
 * Notes:
export JAVA_HOME=/usr/share/java
export PATH=$PATH:$JAVA_HOME/bin
export JSON_JAVA=/home/benjamin/Documents/CS/json
export CLASSPATH=$CLASSPATH:$JSON_JAVA/json-simple-1.1.1.jar:.
 *
 * cd to/folder/with/java/file
 *
 */

 import java.net.http.HttpRequest;
 import java.net.http.HttpClient;
 import java.net.URI;
 import java.net.http.HttpResponse;
 import java.net.http.HttpResponse.BodyHandlers;
 import org.json.simple.parser.JSONParser;

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
            + "%22%7D%7D&user_key=814d4d42c94e6545cd37185ff4bf0270";
            // Note, this is Benjamin Ahn's unique API key!
       
        System.out.println(searchURI);
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


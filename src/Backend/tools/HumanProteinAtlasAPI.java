import java.net.http.HttpRequest;
import java.net.http.HttpClient;
import java.net.URI;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import org.json.simple.parser.JSONParser;

/*
* This class will send a get request to the Human Protein Atlas API
*
* @author Benjamin Ahn
* @version 1.0
*
* Notes:
export JAVA_HOME=/usr/share/java
export PATH=$PATH:$JAVA_HOME/bin
export JSON_JAVA=/home/benjamin/Documents/CS/json
export CLASSPATH=$CLASSPATH:$JSON_JAVA/json-simple-1.1.1.jar:.
* cd to/folder/with/java/file
* compile with: javac HumanProteinAtlastAPI.java
* run with: java HumanProteinAtlasAPI.java
*/


public class HumanProteinAtlasAPI {

    // Build api request caller
    public String resultsFormat; //ie. json

    /* Constructor will build searchURI
    * @param resultsFormat use "json"
    */
    public HumanProteinAtlasAPI(String resultsFormat) {
        this.resultsFormat = resultsFormat;
    }

    /* Make a get request to Human Atlas Protein
    * @param geneName name of the gene to search
    * @param searchCharateristics characteristics of gene from the search. Look at
    * https://www.proteinatlas.org/about/help/dataaccess for parameters and search characteristics
    * @return array data from search results
    */
    public Object getRequest(String geneName, String searchCharateristics) throws Exception {
        // Build search URI
        String searchURI = "https://www.proteinatlas.org/api/search_download.php?search="
            + geneName + "&format="
            + this.resultsFormat + "&columns="
            + searchCharateristics + "&compress=no";

        // Send api request
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
             .uri(URI.create(searchURI))
             .build();

        // Synchronous response as String
        System.out.println("***MAKING API CALL TO HUMAN PROTEIN ATLAS ***");
        HttpResponse<String> response = client.send(request, BodyHandlers.ofString());
        String responseStr = response.body();

        // Response to JSONArray
        JSONParser parser = new JSONParser();
        Object json = parser.parse(responseStr);

        return json;
    }

    public static void main(String args[]) throws Exception {
        // test the API call

        // Initiate a Human Protein Atlas API caller object
        HumanProteinAtlasAPI myHPACaller = new HumanProteinAtlasAPI("json");

        // Make a request for a gene
        //JSONArray p53Array = myHPACaller.getRequest("p53", "g");
        Object gfapResults = myHPACaller.getRequest("GFAP", "g,pe");


        System.out.println(gfapResults);
    }
}

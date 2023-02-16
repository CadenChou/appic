import static spark.Spark.after;

import java.io.IOException;

import spark.Spark;

/**
 * Top-level class for this demo. Contains the main() method which starts Spark and runs the various handlers.
 */
public class Server {
    public static void main(String[] args) throws IOException {
        Spark.port(3232);

        after((request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Methods", "*");
        });

        Spark.get("geneName", new Gene("CSCI", "Nice", 100));
        Spark.init();
        Spark.awaitInitialization();
        System.out.println("Server started.");
    }
}
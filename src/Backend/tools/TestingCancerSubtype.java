import java.util.ArrayList;

/*
export JAVA_HOME=/usr/share/java
export PATH=$PATH:$JAVA_HOME/bin
export JSON_JAVA=/home/benjamin/Documents/CS/json
export CLASSPATH=$CLASSPATH:$JSON_JAVA/json-simple-1.1.1.jar:.
* cd /to/file
* compile and run
*
*/

public class TestingCancerSubtype {
    public static void main(String args[]) throws Exception {

        // Construct a cancer subtype
        CancerSubtype breastMMR = new CancerSubtype("breast", "brca_MMRdeficient");

        ArrayList<Gene> myGeneSet = breastMMR.geneSet;
        ArrayList<SingleGeneInteraction> myGeneInteractions = breastMMR.geneInteractions;

        for (int i = 0; i < 5; i++) {
            System.out.println("printing first 5 interactions");
            SingleGeneInteraction currGI = myGeneInteractions.get(i);
            System.out.println(currGI.source + " -> " + currGI.target + "; STRING=" + currGI.weight);
        }

        Gene firstGene = myGeneSet.get(0);
        String firstGeneName = firstGene.getGeneName();
        System.out.println(firstGeneName);

        // initialize HPA api caller object
        HumanProteinAtlasAPI myHPACaller = new HumanProteinAtlasAPI("json");
        Object geneInfoAboutASingleGene = myHPACaller.getRequest(firstGeneName, "g");
        System.out.println(geneInfoAboutASingleGene);


        GProfilerAPI myGProfilerCaller = new GProfilerAPI();
        ArrayList<String> descriptors = myGProfilerCaller.getRequest(myGeneSet);
        System.out.println(descriptors);
    }
}

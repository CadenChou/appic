/*
* This class represents a cancer subtype.
*
* @author Benjamin Ahn
* @version 1.0
*/

import java.util.ArrayList;
import java.io.FileNotFoundException;
import java.io.File;
import java.util.Scanner;

public class CancerSubtype {

    public String tissueType;
    public String subType;
    public ArrayList<Gene> geneSet = new ArrayList<Gene>();
    public ArrayList<SingleGeneInteraction> geneInteractions = new ArrayList<SingleGeneInteraction>();

    /* Constructor
    * @param tissueType ie. breast, colon, etc
    * @param subType ie. brca_MMRdeficient
    */
    public CancerSubtype(String tissueType, String subType) throws FileNotFoundException {
        this.tissueType = tissueType;
        this.subType = subType;

        // Build gene set
        this.buildGeneSet();

        // Build gene interaction data
        this.buildGeneInteractions();
    }

    /*
    * Read the text file and create the geneset
    * Executed upon construction
    */
    public void buildGeneSet() throws FileNotFoundException {
        //Build path to text file
        String pathToGeneSetTextFile = "./masterData/"
            + tissueType + "/"
            + subType + "/"
            + subType + "_geneSet.txt";
        File geneSetTextFile = new File(pathToGeneSetTextFile);
        Scanner sc = new Scanner(geneSetTextFile);

        // Iterate through text file and add to subtypeGeneSet
        int lineCount = 0;
        while (sc.hasNextLine()){
            // Skip header line
            if (lineCount == 0) {
                sc.nextLine();
            }

            // geneInformationSplit holds the following [geneName, origin, count] of Gene class
            String geneInformation = sc.nextLine();
            String[] geneInformationSplit = geneInformation.split("\t", 0);

            // build gene
            String name = geneInformationSplit[0];
            String origin = geneInformationSplit[1];
            double count = Double.valueOf(geneInformationSplit[2]);
            Gene currGene = new Gene(name, origin, count);

            // add gene to geneSet
            this.geneSet.add(currGene);

            lineCount++;
        }

        sc.close();
    }

    /*
    * Read the text file and create the gene interactions set
    * Executed upon construction
    */
    public void buildGeneInteractions() throws FileNotFoundException {
        //Build path to text file
        String pathToGeneInteractTextFile = "./masterData/"
            + tissueType + "/"
            + subType + "/"
            + subType + "_interactions.txt";

        File geneInteractTextFile = new File(pathToGeneInteractTextFile);
        Scanner sc = new Scanner(geneInteractTextFile);

        // Iterate through text file and add to subtypeGeneSet
        int lineCount = 0;
        while (sc.hasNextLine()){
            // Skip header line
            if (lineCount == 0) {
                sc.nextLine();
            }

            // interactionInfoSplit holds the following [geneName, origin, count] of Gene class
            String interactionInfo = sc.nextLine();
            String[] interactionInfoSplit = interactionInfo.split("\t", 0);

            // build gene
            String source = interactionInfoSplit[0];
            String target = interactionInfoSplit[1];
            int weight = Integer.valueOf(interactionInfoSplit[2]);
            SingleGeneInteraction currGeneInteraction = new SingleGeneInteraction(source, target, weight);

            // add interaction to arraylist of gene interactions
            geneInteractions.add(currGeneInteraction);

            lineCount++;
        }

        sc.close();
    }

    /*
    * Testing from Benjamin
    */
    public static void main(String args[]) throws FileNotFoundException {
        CancerSubtype breastMMR = new CancerSubtype("breast", "brca_MMRdeficient");
        System.out.println(breastMMR.geneInteractions);
    }


}

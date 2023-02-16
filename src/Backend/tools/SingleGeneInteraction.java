/*
* This represents a gene interaction involved with a cancer subtype
* @author Benjamin Ahn
* @version 1.0
*/

public class SingleGeneInteraction {

    /*
    * Initialize
    */
    String source; // gene name
    String target; // gene name
    int weight; // STRING score

    /*
    * Constructor of gene interaction
    */
    public SingleGeneInteraction(String source, String target, int weight) {
        this.source = source;
        this.target = target;
        this.weight = weight;
    }

    /*
    * getters and setters
    */
    public void setSource(String source) {
        this.source = source;
    }
    public void setTarget(String target) {
        this.target = target;
    }
    public void setWeight(int weight) {
        this.weight = weight;
    }
    public String getSource() {
        return source;
    }
    public String getTarget() {
        return target;
    }
    public int getWeight() {
        return weight;
    }

}

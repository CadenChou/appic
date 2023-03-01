/*
* Represents a gene under a Gene Set for a cancer subtype
* @author Benjamin Ahn
* @version 1.0
*/
public class Gene {

    private String geneName;
    private String origin;
    private double count;

    /*
    * Gene constructor
    */
    public Gene(String geneName, String origin, double count) {
        this.geneName = geneName;
        this.origin = origin;
        this.count = count;
    }

    /*
    * Getters and Setters
    */
    public void setGeneName(String geneName) {
        this.geneName = geneName;
    }
    public void setOrigin(String origin) {
        this.origin = origin;
    }
    public void setCount(double count) {
        this.count = count;
    }
    public String getGeneName() {
        return geneName;
    }
    public String getOrigin() {
        return origin;
    }
    public double getCount() {
        return count;
    }


}

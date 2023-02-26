package com.myservlet;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "HelloServlet", urlPatterns = {"HelloServlet"})
public class HelloServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Output to frontend
        PrintWriter out = response.getWriter();

        /*Not functional yet
        CancerSubtype breastMMR = new CancerSubtype("breast", "brca_MMRdeficient");
        ArrayList<SingleGeneInteraction> breastMMRGI = breastMMR.geneInteractions;

        for (int i = 0; i < 10; i++) {
            SingleGeneInteraction currSGI = breastMMRGI.get(i);
            String currOutput = "source: " + currSGI.getSource() + " -> target: " + currSGI.getTarget();
            out.append("<p>" + currOutput + "</p>");
        }
        out.close();
        */

        // SingleGeneInteraction sgi1 = new SingleGeneInteraction("g1", "g2", 1);
        // SingleGeneInteraction sgi2 = new SingleGeneInteraction("g3", "g4", 1);
        // String currOutput = "source: " + sgi1.getSource() + " -> target: " + sgi1.getTarget();
        // out.append("<p>" + currOutput + "</p>");
        // String currOutput2 = "source: " + sgi2.getSource() + " -> target: " + sgi2.getTarget();
        // out.append("<p>" + currOutput2 + "</p>");

        out.println("Hello World");
        out.close();

    }
}


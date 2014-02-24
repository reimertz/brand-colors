import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.io.BufferedReader;
import java.io.IOException;

public class ReadLines {
    public static void main(String[] args) throws Exception {
      System.out.println("Hello World!");
      BufferedReader br = new BufferedReader(new FileReader("brandcolors.less"));
	    try {
	        StringBuilder sb = new StringBuilder();
	        String line = br.readLine();

	        while (line != null) {
	            sb.append(line);
	            sb.append(System.lineSeparator());

	            line = br.readLine();

	            
	            System.out.println(line);
	            String[] strArray = line.split(":");


	            PrintWriter out = new PrintWriter( (strArray[0] + ".less").substring(4) );
	            out.println(line);
	            out.close();
	        }
	        String everything = sb.toString();
	    }
     	finally {
	        br.close();
	    }
    }
}
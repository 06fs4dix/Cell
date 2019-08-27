package cell;

import org.python.util.PythonInterpreter;
public class JythonTest 
{
	private static PythonInterpreter interpreter;

	static public void Test()
	{
		interpreter = new PythonInterpreter();
		interpreter.exec("import tensorflow as tf");
		
		interpreter.exec("print(\"test\")");
		
		
//		interpreter.exec("from java.lang import System");
//		interpreter.exec("s = 'Hello World'");
//		interpreter.exec("System.out.println(s)");
//		interpreter.exec("print(s)");
//		interpreter.exec("print(s[1:-1])");
	}
}

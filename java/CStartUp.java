package cell;
import javax.servlet.*;
import javax.servlet.http.HttpServlet;

@SuppressWarnings("serial")
public class CStartUp extends HttpServlet
{
	public void init() throws ServletException
	{
		System.out.println("----------");
		System.out.println("---------- CrunchifyServletExample Initialized successfully ----------");
		System.out.println("----------");
		
		int type[]= {2,3};
		CDbBackup.Init(type);
	}
}
/*

<!--web.xml에 넣으면 된다-->

<servlet>
    <servlet-name>CStartUp</servlet-name>
    <servlet-class>cell.CStartUp</servlet-class>
    <load-on-startup>1</load-on-startup>
</servlet>

*/
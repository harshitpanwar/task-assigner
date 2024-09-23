import Task from "@/models/Task";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {

  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");
    // access the session object
    const session = await getServerSession(authOptions);
    
    // check if the user is authenticated
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    await connectToDatabase();
    
    const tasks = await Task.find({_id: taskId}).populate("annotator");
   
    return new Response(JSON.stringify({ tasks }), { status: 200 });
  } catch (error:any) {
    return new Response(error.message, { status: 500 });
  }
}
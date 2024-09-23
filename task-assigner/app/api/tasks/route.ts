import Task from "@/models/Task";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {

  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    // access the session object
    const session = await getServerSession(authOptions);
  
    // check if the user is authenticated
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const userRole = session.user.role;
    await connectToDatabase();
    let tasks;
    if(userRole === "annotator") {
      tasks = await Task.find({ annotator: session.user.id }).populate("annotator");
    }
    else {
      tasks = await Task.find({ project: projectId }).populate("annotator");
    }
    return new Response(JSON.stringify({ tasks }), { status: 200 });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}

export async function POST(req: Request) {
    const { name, type, question, media_uri, project, annotator, answer_type } = await req.json();
  
    try {
      await connectToDatabase();
      const task = new Task({
        name,
        type,
        question,
        media_uri,
        project,
        annotator,
        answer_type,
      });
      await task.save();
      task.populate("annotator project");
      return new Response(JSON.stringify({ task }), { status: 201 });
    } catch (error: any) {
      return new Response(error.message, { status: 500 });
    }
}

export async function PUT(req: Request) {

  try {
    
    const { taskId, name, type, question, media_uri, project, answer_type, answer, annotator } = await req.json();

    if(!taskId) {
      return new Response("Project ID is required", { status: 400 });
    }
    const updateObject = {
      name,
      type,
      question,
      media_uri,
      project,
      answer_type,
      answer,
      annotator,
    };

    await connectToDatabase();
    const task = await Task.findByIdAndUpdate(taskId, updateObject, { new: true });
    task.populate("annotator project");
    return new Response(JSON.stringify({ task }), { status: 200 });

  } catch (error) {
    return new Response("Failed to update task", { status: 500 });
    
  }
}
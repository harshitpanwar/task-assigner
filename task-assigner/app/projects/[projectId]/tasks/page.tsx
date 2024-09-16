"use client";

import { useState, useEffect } from "react";
import TaskForm from "@/components/TaskForm";
import { usePathname } from "next/navigation";


type User = {
    _id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}
type Task = {
    _id: string;
    name: string;
    type: string;
    question: {
        text: string;
        options: string[];
    };
    media_uri: string;
    project: {
        _id: string;
        name: string;
        [key: string]: any;
    };
    annotator: User;
    answer_type: string;
    status: string;
  };

  const TaskPage = () => {

    const pathName = usePathname();
    const projectId = pathName.split("/")[2];
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [annotators, setAnnotators] = useState<User[]>([]);
  
    const fetchTasks = async () => {
      try {
        const res = await fetch(`/api/tasks?projectId=${projectId}`);
        const data = await res.json();
        setTasks(data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchAnnotators = async () => {
        try {
          const res = await fetch(`/api/user?role=annotator`);
          const data = await res.json();
          setAnnotators(data.users);
        } catch (error) {
          console.error("Error fetching annotators:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchAnnotators();
    }, []);
  
    const handleCreateTask = async (newTask: Task) => {
      try {
        const res = await fetch(`/api/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTask),
        });
        const data = await res.json();
        setTasks([...tasks, data.task]);
        setShowForm(false);
      } catch (error) {
        console.error("Error creating task:", error);
      }
    };
  
  return (
    <div className="p-6">
      <p className="text-2xl font-bold">Tasks for Project {tasks?.[0]?.project?.name}</p>
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Create Task
      </button>

      {tasks.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {tasks.map((task) => (
            <div key={task._id} className="border p-4 rounded shadow-md">
              <h3 className="text-lg font-semibold">{task.name}</h3>
              <p>Type: {task.type}</p>
            
            {task.type === "image" && (
                <img src={task.media_uri} alt={task.name} className="h-[150px] w-full object-cover" />
            )}
            {task.type === "video" && (
                <video src={task.media_uri} controls className="h-[150px] w-full"></video> 
            )}
            {task.type === "audio" && (
                <audio src={task.media_uri} controls className="w-full"></audio>
            )}

              <p>Question: {task.question.text}</p>
              <div className="bg-slate-400 w-full rounded-md p-5">
            <p>Answer Type: {task.answer_type === "text_field"?"Text Field":(task.answer_type === "checkbox_single"? "Single Checkbox":"Multiple Checkbox")}</p>
            {(task.answer_type === "checkbox_single" || task.answer_type === "checkbox_multiple") && (
                <div>
                { task.question.options && task.question.options.length>0 && task.question.options.map((option, index) => (
                <div key={index}>
                <input type="radio" disabled />
                <label>{option}</label>
                </div>
                ))}
                </div>
                )}
                {
                task.answer_type === "text_field" && (
                    <input type="text" disabled className="bg-transparent" />
                )
                }
            </div>
            <p>Status: {task.status}</p>
            <p>Assigned to: {task.annotator.email}</p>

            </div>
          ))}
        </div>
      ) : (
        <p>No tasks available</p>
      )}

      {showForm && (
        <TaskForm
          annotators={annotators}
          projectId={projectId}
          onClose={() => setShowForm(false)}
          onCreate={handleCreateTask}
        />
      )}
    </div>
  );
};

export default TaskPage;

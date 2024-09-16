"use client";

import Loader from "@/components/Loader/Loader";
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';

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

    const [tasks, setTasks] = useState<Task[]>([]);
    const [answer, setAnswer] = useState<{ taskId: string; options: string[] }>({ taskId: "", options: [] });
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/tasks`);
        const data = await res.json();
        setTasks(data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
        fetchTasks();
    }, []);
    
    const updateAnswer = async (taskId: string) => {
        try {

            if(answer.taskId !== taskId) {
                alert("Please select an answer for the task");
                return;
            }
            const res = await fetch(`/api/tasks`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ answer: answer.options, taskId }),
            });
            const data = await res.json();
            if (data.success) {
                fetchTasks();
            }
        } catch (error) {
            console.error("Error updating answer:", error);
        }
    };

  if (loading || !session) {
    return <Loader />;
  }
  
  return (
    <div className="">
      <header className="bg-blue-600 text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-2xl font-bold mb-2 md:mb-0">Dashboard</h1>
          <p className="text-lg mb-2 md:mb-0">Logged in as: {session?.user?.email}</p>
          <a
            href="/api/auth/signout"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </a>
        </div>
      </header>
        <div className="container mx-auto p-6">
      <p className="text-2xl font-bold">Tasks Assigned to you</p>
      {tasks.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {tasks.map((task) => (
            <div className="flex flex-col justify-between border p-4 rounded shadow-md">
                <div key={task._id} className="flex flex-col justify-between">
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
                <p>Answer Type: {task.answer_type === "text_field"?"Text Field":(task.answer_type === "checkbox_single"? "Single Checkbox":"Multiple Checkbox")}</p>

                <div className="bg-slate-200 w-full rounded-md p-5">
                {(task.answer_type === "checkbox_single" || task.answer_type === "checkbox_multiple") && (
                    <div>
                    {task.question.options && task.question.options.length > 0 && task.question.options.map((option, index) => (
                        <div key={index}>
                            <input
                                type={task.answer_type === "checkbox_single" ? "radio" : "checkbox"}
                                name={task.answer_type === "checkbox_single" ? `single_${task._id}` : `multiple_${task._id}_${index}`}
                                checked={answer.options.includes(option)}
                                onChange={(e) => {
                                    if (task.answer_type === "checkbox_single") {
                                        setAnswer({ taskId: task._id, options: [option] });
                                    } else {
                                        if (e.target.checked) {
                                            setAnswer({ taskId: task._id, options: [...answer.options, option] });
                                        } else {
                                            setAnswer({ taskId: task._id, options: answer.options.filter((ans) => ans !== option) });
                                        }
                                    }
                                }}
                            />
                            <label className="ml-1">{option}</label>
                        </div>
                    ))}
                    </div>
                )}
                {
                task.answer_type === "text_field" && (
                    <input 
                        type="text" 
                        className="p-1 rounded-lg w-inherit" 
                        placeholder="Write your answer here..." 
                        onChange={(e) => setAnswer({ taskId: task._id, options: [e.target.value] })}
                    />
                )
                }
                </div>
                <p>Status: {task.status}</p>
                </div>
            <div className="flex flex-row justify-center mt-2">
                <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={()=> {updateAnswer(task._id)}}>Update</button>
            </div>
        </div>
          ))}
        </div>
      ) : (
        <p>No tasks available</p>
      )}
    </div>
    </div>
  );
};

export default TaskPage;

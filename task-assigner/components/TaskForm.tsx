"use client";

import { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";

// Define TaskForm props type
type TaskFormProps = {
  annotators: any[];
  projectId: string | null;
  onClose: () => void;
  onCreate: (newTask: any) => void;
};

// Define Question type
type Question = {
  text: string;
  options: string[];
};

// Define Task type
type Task = {
  name: string;
  type: string;
  question: Question;
  media_uri: string;
  project: string | null;
  answer_type: string;
  annotator: string;
};

const TaskForm = ({ projectId, onClose, onCreate, annotators }: TaskFormProps) => {
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("text");
  const [question, setQuestion] = useState<Question>({ text: "", options: [] });
  const [answerType, setAnswerType] = useState<string>("text_field");
  const [mediaUris, setMediaUris] = useState<string>("");
  const [annotator, setAnnotator] = useState<string>(annotators[0]._id);
  const [imageUri, setImageUri] = useState<string>("");
  const [videoUri, setVideoUri] = useState<string>("");
  const [audioUri, setAudioUri] = useState<string>("");

  // Handle adding an empty option
  const handleAddOption = () => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      options: [...prevQuestion.options, ""],
    }));
  };

  // Handle changing an option's value
  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...question.options];
    updatedOptions[index] = value;
    setQuestion({ ...question, options: updatedOptions });
  };

  // Handle task creation
  const handleCreate = () => {
    const newTask: Task = {
      name,
      type,
      question,
      media_uri: mediaUris,
      project: projectId,
      answer_type: answerType,
      annotator
    };
    onCreate(newTask);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2>Create Task</h2>
        <input
          type="text"
          placeholder="Task Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mb-4 w-full"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 mb-4 w-full"
        >
          <option value="text">Text</option>
          <option value="audio">Audio</option>
          <option value="video">Video</option>
          <option value="image">Image</option>
        </select>

        { type === "image" && (
          <div>
            {imageUri && <img src={imageUri} alt="Image" width={200} height={200} />}
            <UploadButton endpoint="imageUploader" onClientUploadComplete = {
              (res) => {
                setImageUri(res?.[0]?.url);
                setMediaUris(res?.[0]?.url);
              }
            }/>

          </div>
        )}

        { type === "video" && (
            <div>
              {videoUri && <video src={videoUri} controls width={200} height={200} />}
              <UploadButton endpoint="videoUploader" onClientUploadComplete = {
                (res) => {
                  setVideoUri(res?.[0]?.url);
                  setMediaUris(res?.[0]?.url);
                }
              }/>
            </div>
        )}

        { type === "audio" && (
          <div>
            {audioUri && <audio src={audioUri} controls />}
            <UploadButton endpoint="audioUploader" onClientUploadComplete = {
              (res) => {
                setAudioUri(res?.[0]?.url);
                setMediaUris(res?.[0]?.url);
              }
            }/>
          </div>
        )}

        <textarea
          placeholder="Enter the question"
          value={question.text}
          onChange={(e) => setQuestion({ ...question, text: e.target.value })}
          className="border p-2 mb-4 w-full"
        />

        <select
          value={answerType}
          onChange={(e) => setAnswerType(e.target.value)}
          className="border p-2 mb-4 w-full"
        >
          <option value="text_field">Text Field</option>
          <option value="checkbox_single">Single Checkbox</option>
          <option value="checkbox_multiple">Multiple Checkbox</option>
        </select>

        {answerType !== "text_field" && (
          <div className="mb-4">
            {question.options.map((option, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="border p-2 mb-2 w-full"
              />
            ))}
            <button
              onClick={handleAddOption}
              className="bg-green-500 text-white px-2 py-1 rounded"
            >
              Add Option
            </button>
          </div>
        )}

        <select
          value={annotator}
          onChange={(e) => setAnnotator(e.target.value)}
          className="border p-2 mb-4 w-full"
        >
          {annotators.map((annotator) => (
            <option key={annotator._id} value={annotator._id}>
              {annotator.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Create Task
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TaskForm;

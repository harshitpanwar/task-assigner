"use client";

import { Trash } from "lucide-react";
import { useState } from "react";
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'


type Props = {
  element: EditorElement;
};
type Question = {
  text: string;
  options: string[];
};

const RadioButton = (props: Props) => {

  const { dispatch } = useEditor();
  const [question, setQuestion] = useState<Question>({ text: "", options: [] });
  const [answerType, setAnswerType] = useState<string>("text_field");

  // Add new option
  const handleAddOption = () => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      options: [...prevQuestion.options, ""],
    }));
  };

  // Update the value of an option
  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...question.options];
    updatedOptions[index] = value;
    setQuestion({ ...question, options: updatedOptions });
  };

  // Remove an option
  const handleRemoveOption = (index: number) => {
    const updatedOptions = question.options.filter((_, i) => i !== index);
    setQuestion({ ...question, options: updatedOptions });
  };
  const handleDeleteElement = () => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: { elementDetails: props.element },
    })
  }

  return (
    <div className="p-[2px] w-full m-[5px] relative text-[16px] transition-all">
      <select
        value={answerType}
        onChange={(e) => setAnswerType(e.target.value)}
        className="border p-2 mb-4 w-full"
      >
        <option value="checkbox_single">Single Checkbox</option>
        <option value="checkbox_multiple">Multiple Checkbox</option>
      </select>

      <div className="mb-4">
        {question.options.map((option, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="border p-2 w-full"
            />
            <button
              onClick={() => handleRemoveOption(index)}
              className="bg-red-500 text-white ml-2 px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}

        <button
          onClick={handleAddOption}
          className="bg-green-500 text-white px-2 py-1 rounded"
        >
          Add Option
        </button>
      </div>
      <div className="absolute bg-black px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
        <Trash
          className="cursor-pointer"
          size={16}
          onClick={handleDeleteElement}
        />
      </div>
    </div>
  );
};

export default RadioButton;

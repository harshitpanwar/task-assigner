'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Project {
  _id: string;
  name: string;
}

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetch('/api/projects')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProjects(data.projects);
          }
        })
        .catch((error) => console.error('Error fetching projects:', error));
    }
  }, [session]);

  const createProject = () => {
    fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newProjectName }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProjects([...projects, data.project]);
          setShowModal(false);
          setNewProjectName('');
        }
      })
      .catch((error) => console.error('Error creating project:', error));
  };

  return (
    <div>
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

    { session?.user?.role === 'project manager'? (
      <div className="container mx-auto p-4">

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          onClick={() => setShowModal(true)}
        >
          Create Project
        </button>

        <div className="grid grid-cols-1 gap-4">
          {projects.length === 0 ? (
            <p>No projects found.</p>
          ) : (
            projects.map((project) => (
              <div key={project._id} className="border p-4 rounded shadow">
                <h2 className="text-xl">{project.name}</h2>
              </div>
            ))
          )}
        </div>
      </div>
    ) : (
      <div className="container mx-auto p-4">
        <p>Annotator Dashboard</ p>
      </div>
    )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">Create New Project</h2>
            <input
              type="text"
              className="border p-2 mb-4 w-full"
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={createProject}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

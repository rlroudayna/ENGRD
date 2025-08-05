// src/pages/Jobs.jsx
import React from "react";
import JobList from "../components/JobList";

export default function Jobs() {
  return (
    <main>
      <header className="bg-blue-50 py-6 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Nos Offres d'emploi</h1>
          <p className="text-gray-600">Choisissez le poste qui vous correspond.</p>
        </div>
      </header>
      <JobList />
    </main>
  );
}

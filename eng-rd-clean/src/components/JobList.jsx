// src/components/JobList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "./JobCard";
import "./JobList.css";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({ keyword: "", location: "", type: [] });

  useEffect(() => {
    axios.get("http://localhost:5000/api/jobs")
      .then(response => {
        setJobs(response.data);
        setFilteredJobs(response.data);
      })
      .catch(error => console.error("Erreur lors du chargement des offres:", error));
  }, []);

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === "checkbox") {
      const updatedTypes = checked
        ? [...filters.type, value]
        : filters.type.filter(t => t !== value);
      setFilters(prev => ({ ...prev, type: updatedTypes }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    const results = jobs.filter(job => {
      const keywordMatch = job.title.toLowerCase().includes(filters.keyword.toLowerCase());
      const locationMatch = job.location.toLowerCase().includes(filters.location.toLowerCase());
      const typeMatch = filters.type.length ? filters.type.includes(job.type) : true;
      return keywordMatch && locationMatch && typeMatch;
    });
    setFilteredJobs(results);
  }, [filters, jobs]);

  return (
    <div className="joblist-container">
      <div className="filters">
        <input
          type="text"
          name="keyword"
          placeholder="Mots-clés"
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Localisation"
          onChange={handleFilterChange}
        />
        <div className="checkboxes">
          <label><input type="checkbox" value="CDI" onChange={handleFilterChange} /> CDI</label>
          {/* Ajout de la case à cocher pour le CDD */}
          <label><input type="checkbox" value="CDD" onChange={handleFilterChange} /> CDD</label>
          <label><input type="checkbox" value="Freelance" onChange={handleFilterChange} /> Freelance</label>
          <label><input type="checkbox" value="Stage" onChange={handleFilterChange} /> Stage</label>
        </div>
      </div>

      <div className="job-cards">
        {filteredJobs.map(job => (
          <JobCard key={job._id} job={job} />
        ))}
        {filteredJobs.length === 0 && <p className="no-results">Aucune offre ne correspond à votre recherche.</p>}
      </div>
    </div>
  );
}

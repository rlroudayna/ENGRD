import React from 'react';
import { useLocation } from 'react-router-dom';
import './JobDetails.css';

const JobDetails = () => {
  const { state } = useLocation();
  const job = state?.job;

  if (!job) return <p>Offre introuvable.</p>;

  return (
    <div className="job-details">
      <h2>{job.title}</h2>
      <p><strong>Type :</strong> {job.type}</p>
      <p><strong>Localisation :</strong> {job.location}</p>
      <div className="job-description">
        <h3>Description du poste :</h3>
        <p>{job.description}</p>
      </div>
    </div>
  );
};

export default JobDetails;

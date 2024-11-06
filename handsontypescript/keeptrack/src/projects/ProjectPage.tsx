import React, { useEffect, useState } from 'react';
import ProjectDetail from './ProjectDetail';
import { Project } from './Project';
import { useParams } from 'react-router-dom';
import { projectAPI } from './ProjectApi';

function ProjectPage(props: any) {
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const id = Number(params.id);

  useEffect(() => {
    setLoading(true);
    projectAPI
      .find(id)
      .then((data) => {
        // Jika data adalah array, ambil elemen pertama
        // Jika bukan array, gunakan data langsung
        setProject(Array.isArray(data) ? data[0] : data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message); // Gunakan e.message untuk mendapatkan pesan error string
        setLoading(false);
      });
  }, [id]);
  return (
    <div>
      <>
        <h1>Project Detail</h1>

        {loading && (
          <div className="center-page">
            <span className="spinner primary"></span>
            <p>Loading...</p>
          </div>
        )}

        {error && (
          <div className="row">
            <div className="card large error">
              <section>
                <p>
                  <span className="icon-alert inverse "></span> {error}
                </p>
              </section>
            </div>
          </div>
        )}

        {project && <ProjectDetail project={project} />}
      </>
    </div>
  );
}

export default ProjectPage;
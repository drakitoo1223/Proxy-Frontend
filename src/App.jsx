import { useEffect, useState } from 'react';

const roles = ['guest', 'member', 'admin'];

function App() {
  const [selectedRole, setSelectedRole] = useState('member');
  const [resources, setResources] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources(selectedRole);
  }, [selectedRole]);

  const loadResources = async (role) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/resources', {
        headers: {
          'x-user-role': role
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Unable to load resources.');
      }

      setResources(result.resources);
    } catch (loadError) {
      setError(loadError.message);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Design Pattern Demo</p>
          <h1>Proxy Pattern</h1>
          <p className="subtitle">
            A protected layer controls access to the real service and caches results before delivering them.
          </p>
        </div>

        <div className="role-selector" aria-label="Select user role">
          {roles.map((role) => (
            <button
              key={role}
              type="button"
              className={selectedRole === role ? 'role-button active' : 'role-button'}
              onClick={() => setSelectedRole(role)}
            >
              {role}
            </button>
          ))}
        </div>
      </section>

      <section className="info-grid">
        <article className="info-card">
          <h2>What is the Proxy?</h2>
          <p>
            The Proxy acts as a middle layer. It controls access, validates permissions, and optionally returns cached data before the real service is touched.
          </p>
        </article>

        <article className="info-card">
          <h2>Why use it?</h2>
          <p>
            It is useful for security, performance, logging, and controlled access to sensitive resources.
          </p>
        </article>
      </section>

      <section className="resource-panel">
        <div className="resource-header">
          <h2>Available resources</h2>
          <button type="button" className="refresh-button" onClick={() => loadResources(selectedRole)}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="status">Loading resources...</p>
        ) : error ? (
          <p className="status error">{error}</p>
        ) : (
          <div className="resource-grid">
            {resources.map((resource) => (
              <article key={resource.id} className="resource-card">
                <span className="resource-badge">{resource.category}</span>
                <h3>{resource.name}</h3>
                <p>Visibility: {resource.visibility}</p>
                <p>Access level: {resource.access}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;

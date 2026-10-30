import { useEffect, useState } from 'react';

const PLANS = ['FREE', 'PRO', 'ENTERPRISE'];

function App() {
  const [userId, setUserId] = useState('demo-user');
  const [plan, setPlan] = useState('FREE');
  const [prompt, setPrompt] = useState('Write a short professional summary for a software engineer.');
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchQuotaStatus = async (currentUser = userId, currentPlan = plan) => {
    try {
      const response = await fetch(`/api/quota/status?userId=${encodeURIComponent(currentUser)}&plan=${encodeURIComponent(currentPlan)}`);
      if (!response.ok) {
        throw new Error('Cannot load quota information.');
      }

      const payload = await response.json();
      setStatus(payload);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const fetchHistory = async (currentUser = userId) => {
    try {
      const response = await fetch(`/api/quota/history?userId=${encodeURIComponent(currentUser)}`);
      if (!response.ok) {
        throw new Error('Cannot load history.');
      }

      const payload = await response.json();
      setHistory(payload);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  useEffect(() => {
    fetchQuotaStatus();
    fetchHistory();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, prompt, plan })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'The request failed.');
      }

      setResult(payload);
      await fetchQuotaStatus();
      await fetchHistory();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = async (nextPlan) => {
    setPlan(nextPlan);
    await fetch(`/api/quota/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, plan: nextPlan })
    });
    fetchQuotaStatus(userId, nextPlan);
  };

  return (
    <main className="page-shell">
      <section className="panel hero">
        <div>
          <p className="eyebrow">TALLER</p>
          <h1>AI Proxy Platform</h1>
          <p className="subtitle">
            A controlled access layer that validates rate limits, quotas, and usage before the AI service processes each request.
          </p>
        </div>

        <div className="plan-switcher">
          {PLANS.map((item) => (
            <button
              key={item}
              type="button"
              className={plan === item ? 'plan active' : 'plan'}
              onClick={() => handlePlanChange(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="panel form-panel">
        <label>
          User ID
          <input value={userId} onChange={(event) => setUserId(event.target.value)} />
        </label>

        <label>
          Prompt
          <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={5} />
        </label>

        <button className="primary-button" type="button" onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate answer'}
        </button>

        {error && <p className="error-box">{error}</p>}
      </section>

      <section className="stats-grid">
        <div className="panel metric">
          <h3>Quota status</h3>
          {status ? (
            <>
              <p><strong>Plan:</strong> {status.plan}</p>
              <p><strong>Used:</strong> {status.tokensUsed} tokens</p>
              <p><strong>Remaining:</strong> {status.tokensRemaining} tokens</p>
              <p><strong>Reset:</strong> {new Date(status.resetDate).toLocaleDateString()}</p>
            </>
          ) : (
            <p>Loading quota...</p>
          )}
        </div>

        <div className="panel metric">
          <h3>Usage history</h3>
          {history.length > 0 ? (
            <ul>
              {history.map((item) => (
                <li key={item.date}>
                  {item.date}: {item.usedTokens} tokens
                </li>
              ))}
            </ul>
          ) : (
            <p>No history yet.</p>
          )}
        </div>
      </section>

      {result && (
        <section className="panel result-panel">
          <h3>Generated response</h3>
          <p><strong>User:</strong> {result.userId}</p>
          <p><strong>Plan:</strong> {result.plan}</p>
          <p><strong>Tokens used:</strong> {result.tokensUsed}</p>
          <blockquote>{result.generatedText}</blockquote>
        </section>
      )}
    </main>
  );
}

export default App;

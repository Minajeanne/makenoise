
import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';  // Create this file!

export default function Home() {
  const [federalLawmakers, setFederalLawmakers] = useState([]);
  const [stateLawmakers, setStateLawmakers] = useState([]);
  const [loadingFederal, setLoadingFederal] = useState(true);
  const [loadingState, setLoadingState] = useState(true);
  const [errorFederal, setErrorFederal] = useState(null);
  const [errorState, setErrorState] = useState(null);

  // Replace with your actual API keys or backend endpoints!  **IMPORTANT!**
  const federalApiKey = process.env.local.CONGRESS_API_KEY; // Securely store API keys!
  //const stateApiKey = process.env.NEXT_PUBLIC_STATE_API_KEY; // Securely store API keys!

  // Federal Lawmakers (Example: Using ProPublica Congress API)
  useEffect(() => {
    const fetchFederalLawmakers = async () => {
      setLoadingFederal(true);
      try {
        const response = await fetch(
          `https://api.propublica.org/congress/v1/117/senate/members.json`, // Example: Senate for the 117th Congress.  Change as needed!
          {
            headers: {
              'X-API-Key': federalApiKey,  // **NEVER HARDCODE IN PRODUCTION** Use environment variables!
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setFederalLawmakers(data.results[0].members); // Adjust based on API response structure
      } catch (error) {
        setErrorFederal(error);
        console.error("Error fetching federal lawmakers:", error);
      } finally {
        setLoadingFederal(false);
      }
    };

    if (federalApiKey) { // Ensure API key exists
      fetchFederalLawmakers();
    } else {
      setErrorFederal("Federal API key not found.  Set NEXT_PUBLIC_FEDERAL_API_KEY in your .env file.");
      setLoadingFederal(false);
    }

  }, [federalApiKey]);


  // State Lawmakers (Example: This is a placeholder!  You need to find a state legislature API or use a different approach)
  useEffect(() => {
    const fetchStateLawmakers = async () => {
      setLoadingState(true);
      try {
        // **THIS IS A PLACEHOLDER!**  Replace with your actual state legislature API call!
        // State APIs vary wildly.  You might need to research and find one for your specific state(s).
        // Many states don't have public APIs and scraping might be your only option.
        // Consider using a third-party service that aggregates this data.

        // Example using a hypothetical state API (replace with actual URL and API Key)
        const response = await fetch(
          `https://example.state.gov/api/legislators?key=${stateApiKey}`, // Replace with your actual state API URL
        );


        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setStateLawmakers(data.legislators); // Adjust based on API response structure

      } catch (error) {
        setErrorState(error);
        console.error("Error fetching state lawmakers:", error);
      } finally {
        setLoadingState(false);
      }
    };

    if(stateApiKey){
       fetchStateLawmakers();
    } else {
      setErrorState("State API key not found.  Set NEXT_PUBLIC_STATE_API_KEY in your .env file.");
      setLoadingState(false);
    }


  }, [stateApiKey]);


  return (
    <div className={styles.container}>
      <Head>
        <title>Lawmaker Contact Information</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Lawmaker Contact Information</h1>

        <section>
          <h2>Federal Lawmakers</h2>
          {loadingFederal ? (
            <p>Loading federal lawmakers...</p>
          ) : errorFederal ? (
            <p className={styles.error}>Error: {errorFederal.message || errorFederal}</p>
          ) : (
            <ul className={styles.lawmakerList}>
              {federalLawmakers.map((lawmaker) => (
                <li key={lawmaker.id}>
                  <strong>{lawmaker.first_name} {lawmaker.last_name}</strong> ({lawmaker.party} - {lawmaker.state})<br />
                  <a href={lawmaker.url} target="_blank" rel="noopener noreferrer">Website</a><br />
                  Phone: {lawmaker.phone}<br />
                  {/* Add more fields from the API response as needed */}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2>State Lawmakers</h2>
          {loadingState ? (
            <p>Loading state lawmakers...</p>
          ) : errorState ? (
            <p className={styles.error}>Error: {errorState.message || errorState}</p>
          ) : (
            <ul className={styles.lawmakerList}>
              {stateLawmakers.map((lawmaker) => (
                <li key={lawmaker.id}>
                  <strong>{lawmaker.first_name} {lawmaker.last_name}</strong> ({lawmaker.party} - {lawmaker.district})<br />
                  {lawmaker.email && <a href={`mailto:${lawmaker.email}`}>Email</a>}<br />
                  {lawmaker.phone && `Phone: ${lawmaker.phone}`}<br />
                  {/* Add more fields from the API response as needed */}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className={styles.footer}>
        Powered by Next.js and data from Congress.gov and [Replace with Your State Data Source]
      </footer>
    </div>
  );
}
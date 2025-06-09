import AnalyticsForm from "../components/auth/AnalyticsForm"; // Import the AnalyticsForm component
import { useState } from "react"; // Import React and useState hook

const AnalyticsPage = () => {
  const [result, setResult] = useState<string | null>(null); // State to hold the result of analytics
  const handleAnalytics = async (message: string) => {
    const res = await fetch("http://localhost:3001/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    setResult(data.result);
  }

  return (
    <div>
      <AnalyticsForm onAnalytic={handleAnalytics} />
      <p>{result}</p>
    </div>
  )
};

export default AnalyticsPage;
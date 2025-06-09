import AnalyticsForm from "../components/auth/AnalyticsForm"; // Import the AnalyticsForm component

const AnalyticsPage= () => {

  const handleAnalytics = async (data: string) => {
    // This function can be used to handle any analytics-related logic 
    console.log("Analytics function called");
  }
  return <AnalyticsForm onAnalytic={handleAnalytics} />; // Render the AnalyticsForm component and pass the handleAnalytics function
};

export default AnalyticsPage;
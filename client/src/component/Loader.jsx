import { useEffect, useState } from "react";

export const Loader = () => {
  const [loadingTime, setLoadingTime] = useState(20);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p>Loading Sanskrit model... {loadingTime} seconds remaining</p>
    </div>
  );
};

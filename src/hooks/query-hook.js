import { useEffect, useState } from '@forge/ui';

export const useQuery = ({ queryKey = [], queryFn }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(async () => {
    try {
      setLoading(true);
      const res = await queryFn();
      setData(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, queryKey);

  return {
    data,
    loading,
    error,
    setData,
  };
};

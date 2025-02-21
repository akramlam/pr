import _ from 'underscore';

const api = {
  get: _.memoize(async (url: string) => {
    const response = await fetch(url);
    return response.json();
  }),

  post: _.throttle(async (url: string, data: any) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }, 1000)
};

export default api; 
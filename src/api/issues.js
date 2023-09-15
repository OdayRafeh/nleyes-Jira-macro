import api, { route } from '@forge/api';

const getData = async (query) => {
  const response = await api.asUser().requestJira(query);

  if (response.status !== 200) {
    throw new Error('error');
  }
  const data = await response.json();
  return data;
};

export const getIssues = async (search, config, page = 1) => {
  const startAt = (page - 1) * config.maxResults;

  let query = route`/rest/api/3/search?jql=project=${config.projectKey}&startAt=${startAt}&maxResults=${config.maxResults}`;

  if (search) {
    query = route`/rest/api/3/search?jql=issue=${search}&fields=key,summary,status,assignee,priority,created,updated`;
  }

  const data = await getData(query);

  return data;
};

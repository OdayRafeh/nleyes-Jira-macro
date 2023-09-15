import ForgeUI, {
  Button,
  ButtonSet,
  Form,
  Fragment,
  Macro,
  MacroConfig,
  StatusLozenge,
  Text,
  TextField,
  render,
  useConfig,
  useState,
} from '@forge/ui';
import { useQuery } from './hooks/query-hook';
import { getIssues } from './api/issues';
import IssuesTable from './components/IssuesTable';
import Pagniation from './components/Pagniation';

const defaultConfig = {
  projectKey: 'TT',
  maxResults: 50,
};

const Config = () => {
  return (
    <MacroConfig>
      <TextField
        name='projectKey'
        label='Project Key'
        defaultValue={defaultConfig.projectKey}
      />
      <TextField
        name='maxResults'
        label='Max Results'
        defaultValue={defaultConfig.maxResults}
      />
    </MacroConfig>
  );
};

const App = () => {
  const config = useConfig() ?? defaultConfig;
  const [search, setSearch] = useState('');
  const [refreshNumber, setRefreshNumber] = useState(0);
  const [page, setPage] = useState(1);

  const issuesQuery = useQuery({
    queryKey: [search, refreshNumber, config, page],
    queryFn: () => getIssues(search, config, page),
  });

  const handleSubmit = async (formData) => {
    const issueId = formData.issueId;
    setSearch(issueId);
  };

  const refreshIssues = () => setRefreshNumber(refreshNumber + 1);

  return (
    <Fragment>
      <Form onSubmit={handleSubmit} submitButtonText='Search'>
        <TextField
          name='issueId'
          type='text'
          placeholder='Enter your Ticket Key to Search'
        />
      </Form>

      <IssuesTable
        issues={issuesQuery.data.issues ?? []}
        total={issuesQuery.data.total ?? defaultConfig.maxResults}
      />

      <Text>
        <StatusLozenge
          appearance='primary'
          text={`Total Issues: ${issuesQuery.data.total}`}
        />
        <StatusLozenge appearance='primary' text={`Current Page: ${page}`} />
      </Text>

      <Pagniation
        setPage={setPage}
        currentPage={page}
        totalCount={issuesQuery.data.total ?? 50}
        itemsPerPage={config.maxResults}
      />

      <ButtonSet>
        <Button text='Refresh' appearance='link' onClick={refreshIssues} />
        <Button
          text='Get all issues'
          appearance='link'
          onClick={() => setSearch('')}
        />
      </ButtonSet>
    </Fragment>
  );
};

export const run = render(<Macro app={<App />} />);
export const config = render(<Config />);

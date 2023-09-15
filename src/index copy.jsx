import api, { route } from '@forge/api';
import ForgeUI, {
  Fragment,
  Macro,
  Text,
  render,
  TextField,
  useState,
  Form,
  Table,
  Head,
  Cell,
  Row,
  Link,
  Button,
  useProductContext,
  Badge,
  ButtonSet,
  Heading,
  StatusLozenge,
  Flex,
  MacroConfig,
  useConfig
} from '@forge/ui';
import { useQuery } from './hooks/query-hook';

const getStatusBadgeAppearance = (statusName) => {
  switch (statusName.toLowerCase()) {
    case 'to do':
      return 'new';
    case 'in progress':
      return 'inprogress';
    case 'done':
      return 'success';
    case 'blocked':
      return 'removed';
    default:
      return 'default';
  }
};

const defaultConfig = {
  projectKey: "TD",
  maxResults: 50,
};

const Config = () => {
  return (
    <MacroConfig>
      <TextField name="projectKey" label="Project Key" defaultValue={defaultConfig.projectKey} />
      <TextField name="maxResults" label="Max Results" defaultValue={defaultConfig.maxResults} />
    </MacroConfig>
  );
};

const getIssues = async (search, config) => {
  let query = route`/rest/api/3/search?jql=project=${config.projectKey}&startAt=0&maxResults=${config.maxResults}`;

  if (search) {
    query = route`/rest/api/3/search?jql=issue=${search}&fields=key,summary,status,assignee,priority,created,updated`;
  }

  const response = await api.asUser().requestJira(query);

  if (response.status !== 200) {
    throw new Error('error');
  }
  const data = await response.json();

  return data.issues ?? [];
};

const App = () => {
  const { config = defaultConfig } = useConfig() || {};
  const [search, setSearch] = useState('');
  const [refreshNumber, setRefreshNumber] = useState(0);

  const issuesQuery = useQuery({
    queryKey: [search, refreshNumber],
    queryFn: () => getIssues(search, config),
  });

  const issues = issuesQuery.data;

  const handleSubmit = async (formData) => {
    const issueId = formData.issueId;
    setSearch(issueId);
  };

  const refreshIssues = () => setRefreshNumber(refreshNumber + 1);

  return (
    <Fragment>
        <Form onSubmit={handleSubmit} style={{ display: 'inline-block', marginRight: '10px' }} submitButtonText='Search'>
          <TextField name='issueId' type='text' style={{ width: '200px' }} placeholder='Enter your Ticket Key to Search' />
        </Form>

      <Table>
        <Head>
          <Cell>
            <Heading size="medium">Issue key</Heading>
          </Cell>
          <Cell>
            <Heading size="medium">Summary</Heading>
          </Cell>
          <Cell>
            <Heading size="medium">Status</Heading>
          </Cell>
          <Cell>
            <Heading size="medium">Assignee</Heading>
          </Cell>
          <Cell>
            <Heading size="medium">Priority</Heading>
          </Cell>
          <Cell>
            <Heading size="medium">Created</Heading>
          </Cell>
          <Cell>
            <Heading size="medium">Updated</Heading>
          </Cell>
        </Head>

        {issues?.map((issue, index) => {
          const badgeAppearance = getStatusBadgeAppearance(issue.fields.status.name);

          return (
            <Row key={issue?.id}>
              <Cell>
                <Text>
                  <Link href={`https://nleyes.atlassian.net/browse/${issue.key}`}>
                    {issue.key}
                  </Link>
                </Text>
              </Cell>
              <Cell>
                <Text>
                  <Link href={`https://nleyes.atlassian.net/browse/${issue.key}`}>
                    {issue.fields.summary}
                  </Link>
                </Text>
              </Cell>
              <Cell>
                <Text>
                  <StatusLozenge
                    text={issue.fields.status.name}
                    appearance={badgeAppearance}
                  />
                </Text>
              </Cell>
              <Cell>
                <Text>
                  <StatusLozenge text={issue.fields.assignee
                    ? issue.fields.assignee.displayName
                    : 'Unassigned'}
                    appearance="default"
                  /></Text>
              </Cell>
              <Cell>
                <Text>{issue.fields.priority.name}</Text>
              </Cell>
              <Cell>
                <Text>{new Date(issue.fields.created).toLocaleDateString()}</Text>
              </Cell>
              <Cell>
                <Text>{new Date(issue.fields.updated).toLocaleDateString()}</Text>
              </Cell>
            </Row>
          );
        })}
      </Table>
      <Text><StatusLozenge appearance="primary" text={`Total Issues: ${issues.length}`} /></Text>
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

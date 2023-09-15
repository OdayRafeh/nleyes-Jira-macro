import ForgeUI, {
  Cell,
  Head,
  Heading,
  Link,
  Row,
  StatusLozenge,
  Table,
  Text,
} from '@forge/ui';

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

const IssuesTable = ({ issues, total }) => {
  return (
    <Table rowsPerPage={total}>
      <Head>
        <Cell>
          <Heading size='medium'>Issue key</Heading>
        </Cell>
        <Cell>
          <Heading size='medium'>Summary</Heading>
        </Cell>
        <Cell>
          <Heading size='medium'>Status</Heading>
        </Cell>
        <Cell>
          <Heading size='medium'>Assignee</Heading>
        </Cell>
        <Cell>
          <Heading size='medium'>Priority</Heading>
        </Cell>
        <Cell>
          <Heading size='medium'>Created</Heading>
        </Cell>
        <Cell>
          <Heading size='medium'>Updated</Heading>
        </Cell>
      </Head>

      {issues.map((issue, index) => {
        const badgeAppearance = getStatusBadgeAppearance(
          issue.fields.status.name
        );

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
                <StatusLozenge
                  text={
                    issue.fields.assignee
                      ? issue.fields.assignee.displayName
                      : 'Unassigned'
                  }
                  appearance='default'
                />
              </Text>
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
  );
};

export default IssuesTable;

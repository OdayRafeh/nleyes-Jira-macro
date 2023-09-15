import ForgeUI, { render, Macro, Fragment, Text, useState, Table, Head, Row, Cell, Button, Link } from '@forge/ui';
import api, { route } from "@forge/api";

const handleSearch = async () => {
    const response = await api.asUser().requestJira(route`/rest/api/3/search?jql=issue=TD-21`);
    const data = await response.json();
    return data.issues || [];
};

const JiraMacro = () => {
    const [issues, setIssues] = useState(async () => await handleSearch());

    const refreshIssues = async () => {
        const updatedIssues = await handleSearch();
        setIssues(updatedIssues);
    };

    if (!issues.length) {
        return <Text>No issues found.</Text>;
    }

    return (
        <Fragment>
            <Table>
                <Head>
                    <Cell><Text>Issue Key</Text></Cell>
                    <Cell><Text>Summary</Text></Cell>
                    <Cell><Text>Status</Text></Cell>
                    <Cell><Text>Assignee</Text></Cell>
                    <Cell><Text>Priority</Text></Cell>
                    <Cell><Text>Created</Text></Cell>
                    <Cell><Text>Updated</Text></Cell>
                </Head>
                {issues.map(issue => (
                    <Row>
                        <Cell>
                            <Text>
                                <Link href={`https://nleyes.atlassian.net/browse/${issue.key}`}>{issue.key}</Link>
                            </Text>
                        </Cell>
                        <Cell>
                            <Text>
                                <Link href={`https://nleyes.atlassian.net/browse/${issue.key}`}>{issue.fields.summary}</Link>
                            </Text>
                        </Cell>
                        <Cell><Text>{issue.fields.status.name}</Text></Cell>
                        <Cell><Text>{issue.fields.assignee ? issue.fields.assignee.displayName : "Unassigned"}</Text></Cell>
                        <Cell><Text>{issue.fields.priority.name}</Text></Cell>
                        <Cell><Text>{new Date(issue.fields.created).toLocaleDateString()}</Text></Cell>
                        <Cell><Text>{new Date(issue.fields.updated).toLocaleDateString()}</Text></Cell>
                    </Row>
                ))}
            </Table>
            <Text>Total Issues: {issues.length}</Text>
            <Button text="Refresh" onClick={refreshIssues} />
        </Fragment>
    );
};

export const run = render(<Macro app={<JiraMacro />} />);

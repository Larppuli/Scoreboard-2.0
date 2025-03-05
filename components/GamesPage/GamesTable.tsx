import { Table, Stack } from '@mantine/core';
import { useAppContext } from '@/app/lib/AppContext';

export default function GamesTable() {
    const { games } = useAppContext();

    const formatDate = ({ dateString }: { dateString: string }) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const formatParticipants = (participants: string[]) => {
        return participants.join(', ');
    }

    const rows = (games ?? []).map((element) => (
        <Table.Tr key={element._id}>
            <Table.Td>{formatDate({ dateString: element.date })}</Table.Td>
            <Table.Td>{formatParticipants(element.participants)}</Table.Td>
            <Table.Td>{element.sport}</Table.Td>
            <Table.Td>{element.winner}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Stack 
            h="80vh" 
            style={{ overflowY: 'auto', borderRadius: '12px'}}
        >
            <Table 
                stickyHeader 
                bg="#141414"
                style={{ borderRadius: '12px' }}
            >
                <Table.Thead bg="#141414" c="#949494">
                    <Table.Tr>
                        <Table.Th>Date</Table.Th>
                        <Table.Th>Players</Table.Th>
                        <Table.Th>Sport</Table.Th>
                        <Table.Th>Winner</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody c="#949494">{rows}</Table.Tbody>
            </Table>
        </Stack>
    );
}

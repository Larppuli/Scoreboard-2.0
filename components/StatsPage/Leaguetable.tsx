import { Stack, Table } from '@mantine/core';
import Form from './Form';
import { LeaguatableProps } from '@/app/lib/definitions';

export default function Leaguetable({ users, games }: LeaguatableProps) {
  const userStats = users?.map((user) => {
    let cumulativePoints = 0;
    const selectedUserPoints: number[] = [];

    const userGames = games?.filter((game) => game.participants.includes(user._id));

    userGames?.slice().reverse().forEach((game: any) => {
      if (game.participants.includes(user._id)) {
        if (game.winner === user._id) {
          cumulativePoints += game.participants.length * 2;
        } else {
          cumulativePoints -= 5 - game.participants.length;
          cumulativePoints = Math.max(0, cumulativePoints);
        }
        selectedUserPoints.push(cumulativePoints);
      }
    });

    return {
      ...user,
      points: selectedUserPoints[selectedUserPoints.length - 1] || 0,
      matchesPlayed: userGames?.length,
      wins: userGames?.filter((game) => game.winner === user._id).length,
      losses: userGames?.filter((game) => game.winner !== user._id).length,
    };
  });

  const sortedUserStats = userStats?.sort((a, b) => b.points - a.points);

  const rows = (sortedUserStats ?? []).map((user, index) => (
    <tr key={user._id}>
      <Table.Td style={{ borderTop: '1px solid rgb(68, 68, 68)' }} fw={600}>
        {user.firstName}
      </Table.Td>
      <Table.Td px={0} style={{ borderTop: '1px solid rgb(68, 68, 68)' }} align="center" fw={600}>
        {user.matchesPlayed}
      </Table.Td>
      <Table.Td px={0} style={{ borderTop: '1px solid rgb(68, 68, 68)' }} align="center" fw={600}>
        {user.wins}
      </Table.Td>
      <Table.Td px={0} style={{ borderTop: '1px solid rgb(68, 68, 68)' }} align="center" fw={600}>
        {user.losses}
      </Table.Td>
      <Table.Td px={0} style={{ borderTop: '1px solid rgb(68, 68, 68)' }} align="center" fw={600}>
        {user.points}
      </Table.Td>
      <Table.Td px={0} style={{ borderTop: '1px solid rgb(68, 68, 68)', align: 'center' }}>
        <Form id={user._id} games={games} />
      </Table.Td>
    </tr>
  ));

  return (
    <Stack
      mt={10}
      style={{ overflowY: 'auto', 
        borderRadius: '12px', 
        background: 'rgba(20, 20, 20, 0.9)', 
        border: '1px solid #333',
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.5)'
      }}
    >
      <Table bg="#141414" style={{ borderRadius: '5px' }}>
        <Table.Thead bg="#141414" c="#e2e2e2">
          <Table.Tr>
          <Table.Th>PLAYER</Table.Th>
            <Table.Th ta="center" style={{ padding: 0 }}>MP</Table.Th>
            <Table.Th ta="center" style={{ padding: 0 }}>W</Table.Th>
            <Table.Th ta="center" style={{ padding: 0 }}>L</Table.Th>
            <Table.Th ta="center" style={{ padding: 0 }}>PTS</Table.Th>
            <Table.Th ta="center" style={{ padding: 0 }}>FORM</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody c="#e2e2e2">{rows}</Table.Tbody>
      </Table>
    </Stack>
  );
}
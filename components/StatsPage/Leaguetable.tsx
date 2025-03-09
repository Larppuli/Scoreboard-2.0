import { Stack, Table } from '@mantine/core';
import { useAppContext } from '@/app/lib/AppContext';
import Form from './Form';
import { motion } from 'framer-motion';

export default function Leaguetable() {
  const { users, games } = useAppContext();

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

  // Sort users by points in descending order
  const sortedUserStats = userStats?.sort((a, b) => b.points - a.points);

  const rows = (sortedUserStats ?? []).map((user, index) => (
    <motion.tr
      key={user._id}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Table.Td  style={{ borderTop: '1px solid rgb(68, 68, 68)' }} fw={600}>{user.firstName}</Table.Td>
      <Table.Td px={0} style={{ borderTop: '1px solid rgb(68, 68, 68)' }} align='center' fw={600}>{user.matchesPlayed}</Table.Td>
      <Table.Td px={0} style={{ borderTop: '1px solid rgb(68, 68, 68)' }} align='center' fw={600}>{user.wins}</Table.Td>
      <Table.Td px={0} style={{ borderTop: '1px solid rgb(68, 68, 68)' }} align='center' fw={600}>{user.losses}</Table.Td>
      <Table.Td px={0} style={{ borderTop: '1px solid rgb(68, 68, 68)' }} align='center' fw={600}>{user.points}</Table.Td>
      <Table.Td px={0} style={{ borderTop: '1px solid rgb(68, 68, 68)',  align: 'center' }}>
        <Form id={user._id} />
      </Table.Td>
    </motion.tr>
  ));

  return (
    <Stack h="70vh" style={{ overflowY: 'auto', borderRadius: '5px' }}>
      <Table bg="#141414" style={{ borderRadius: '5px' }}>
        <Table.Thead bg="#141414" c="#e2e2e2">
          <Table.Tr>
            <Table.Th>PLAYER</Table.Th>
            <Table.Th ta="center">MP</Table.Th>
            <Table.Th ta="center">W</Table.Th>
            <Table.Th ta="center">L</Table.Th>
            <Table.Th ta="center">PTS</Table.Th>
            <Table.Th ta="center">FORM</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody c="#e2e2e2">{rows}</Table.Tbody>
      </Table>
    </Stack>
  );
}

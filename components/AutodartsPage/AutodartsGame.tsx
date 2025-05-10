import { Card, Image, Text, Button, Group, Badge } from '@mantine/core';
import React from 'react';
import { AutodartsGameProps, AutodartsPlayer } from '@/app/lib/definitions';
import { useAppContext } from '@/app/lib/AppContext';
import { DateTime } from 'luxon';

export default function AutodartsGame({ gameId, gameDate, players, winner, variant }: AutodartsGameProps) {
    const { userObjects, addGame } = useAppContext();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const convertUsernameToFullName = (userName: string) => {
        const normalizedInput = userName.toLowerCase().replace(/\s+/g, '');
      
        const user = userObjects.find((user) => {
          const normalizedUserName = user.userName.toLowerCase().replace(/\s+/g, '');
          const normalizedFullName = user.fullName.toLowerCase().replace(/\s+/g, '');
      
          const isUserNameMatch = normalizedUserName === normalizedInput;
          const isFullNameMatch = normalizedFullName === normalizedInput;
      
          return isUserNameMatch || isFullNameMatch;
        });
      
        return user ? user.fullName : userName;
      };
      
    const formParticipantIdList = (participants: AutodartsPlayer[]): string[] => {
        return participants
        .map((participant) => {
            const match = userObjects.find(
            (user) =>
                user.fullName === convertUsernameToFullName(participant.name)
            );
            return match?._id ?? null;
        })
        .filter((id): id is string => Boolean(id));
    };

    const handleMatchImport = async () => {
        const participantIds = formParticipantIdList(players);
        const winnerId = formParticipantIdList([players[Number(winner)]])[0];
      
        const luxonDate = DateTime.fromISO(gameDate)
          .setZone('Europe/Helsinki')
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
          .toISO() ?? '';
      
        const gameObject = {
          date: luxonDate,
          participants: participantIds,
          winner: winnerId,
          autodartsId: gameId,
          sport: 'Darts',
        };
      
        try {
          const response = await fetch('/api/games', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameObject),
          });
      
          if (!response.ok) throw new Error('Failed to import game');
      
          const responseData = await response.json();
          addGame({
            autodartsId: gameId,
            _id: responseData.insertedId,
            date: luxonDate,
            participants: gameObject.participants,
            winner: gameObject.winner,
            sport: 'Darts',
          });
      
        } catch (error) {
          console.error('Error importing game:', error);
        }
      };      

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder w={310} bg={'#2f2f2f'} style={{ border: '1px solid #525252' }}>
            <Card.Section>
                <Image
                    src="/AutodartsLogo.jpg"
                    height={80}
                    alt="Autodarts logo"
                />
            </Card.Section>
            <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{formatDate(gameDate.slice(0, 10))}</Text>
                <Badge color="green">{variant}</Badge>
            </Group>
            <Text size="sm" c="dimmed">
                <b>Participants:</b> {players.map((player, index) => (
                <span key={player.id}>
                    {convertUsernameToFullName(player.name)}
                    {index < players.length - 1 ? ', ' : ''}
                    </span>
                ))}
            </Text>
            <Text size="sm" c="dimmed">
                <b>Winner: </b> {convertUsernameToFullName(players[Number(winner)]?.name)}
            </Text>
            <Button onClick={handleMatchImport} color="blue" fullWidth mt="md" radius="md">
                Import match
            </Button>
        </Card>
    );
}

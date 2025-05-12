'use client';

import { useEffect, useState } from 'react';
import { Stack, Title, LoadingOverlay, Text } from '@mantine/core';
import AutodartsGame from '@/components/AutodartsPage/AutodartsGame';
import { useAppContext } from '@/app/lib/AppContext';

export default function App() {
  const [autodartsGames, setAutodartsGames] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { userObjects, games } = useAppContext();

  useEffect(() => {
    fetch('/api/autodarts')
      .then(res => res.json())
      .then(setAutodartsGames)
      .catch(err => setAutodartsGames({ error: err.message }))
      .finally(() => setLoading(false));
  }, []);

  const playerExists = (name: string) => {
    const normalizedInput = name.toLowerCase().replace(/\s+/g, '');
    return userObjects.some((user) => {
      const normalizedUserName = user.userName.toLowerCase().replace(/\s+/g, '');
      const normalizedFullName = user.fullName.toLowerCase().replace(/\s+/g, '');
      return normalizedUserName === normalizedInput || normalizedFullName === normalizedInput;
    });
  };

  const gameAlreadyImported = (gameId: string) =>
    games.some((game) => game.autodartsId === gameId);

  const validGames = autodartsGames?.items?.filter((game: any) =>
    game.players.every((player: any) => playerExists(player.name)) &&
    !gameAlreadyImported(game.id)
  );

  return (
    <Stack align="center" justify="center" mt={20}>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ bg: 'rgba(0, 0, 0, 0.5)' }}
        loaderProps={{ color: 'red' }}
      />

      {autodartsGames?.error ? (
        <Text c="red" size="lg" fw={500}>
          Renew Autodarts token
        </Text>
      ) : validGames?.length === 0 ? (
        <Title size={16} c="gray">
          No games to export
        </Title>
      ) : (
        validGames?.map((game: any) => (
          <AutodartsGame
            key={game.id}
            gameId={game.id}
            gameDate={game.createdAt}
            players={game.players}
            winner={game.winner}
            variant={game.variant}
          />
        ))
      )}
    </Stack>
  );
}

import { Group, Box, Text } from '@mantine/core';
import { useAppContext } from '@/app/lib/AppContext';

export default function Form({ id }: { id: string }) {
  const { games } = useAppContext();

  const userGames = games?.filter((game) => game.participants.includes(id));

  const recentGames = userGames?.slice(0, 5);
  const remainingGames = 5 - (recentGames?.length || 0);

  return (
    <Group gap={4} justify='center'>
      {recentGames?.map((game, index) => {
        const isWinner = game.winner === id;
        const gameResultColor = isWinner ? '#02a03d' : '#d90000';

        return (
          <Box 
            key={index}
            w={'18px'} 
            h={'18px'}
            style={{
                borderRadius: '4px',
                backgroundColor: gameResultColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
            <Text 
                size={'12px'} 
                c="white"
                mr={isWinner ? '0.2px' : '0.6px'}
                mb={2}
                >{`${isWinner ? 'W' : 'L'}`}</Text>
          </Box>
        );
      })}
      
      {remainingGames > 0 && Array.from({ length: remainingGames }).map((_, index) => (
        <Box 
          key={`empty-${index}`} 
          w={'18px'} 
          h={'18px'} 
          style={{
              borderRadius: '4px',
              backgroundColor: 'grey',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
        >
          <Text size={'12px'} c="white">?</Text>
        </Box>
      ))}
    </Group>
  );
}

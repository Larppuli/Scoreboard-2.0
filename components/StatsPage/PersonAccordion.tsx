import { Group, Avatar, Text, Accordion } from '@mantine/core';
import { PersonAccordionProps, AccordionLabelProps } from '@/app/lib/definitions';
import ExpectedWinPercent from '../ProfilePage/ExpectedWinPercent';
import { useMemo } from 'react';

function AccordionLabel({ label, image, description }: AccordionLabelProps) {
  return (
    <Group wrap="nowrap">
      <Avatar src={image} radius="xl" size="lg" />
      <div>
        <Text c={'white'}>{label}</Text>
        <Text size="sm" c="#868686" fw={400}>
          {description}
        </Text>
      </div>
    </Group>
  );
}

export default function PersonAccordion({ userObjects, games }: PersonAccordionProps) {

  const meanGameSize = (id: string) => {
    if (!id || !Array.isArray(games)) return null;

    const userGames = games.filter((game) => game.participants.includes(id));
    if (userGames.length === 0) return null;

    let totalParticipants = userGames.reduce((sum, game) => sum + game.participants.length, 0);
    
    return totalParticipants / userGames.length;
  };

  const items = userObjects.map((userObject) => {
    const gameCount = useMemo(() => {
      if (!userObject._id || !Array.isArray(games)) return 0;
      return games.filter((game) => game.participants.includes(userObject._id)).length || 0;
    }, [games, userObject]);

    const winCount = useMemo(() => {
      if (!userObject._id || !Array.isArray(games)) return 0;
      return games.filter((game) => game.winner.includes(userObject._id)).length || 0;
    }, [games, userObject]);

    const winPercent = gameCount > 0 ? (winCount / gameCount) * 100 : 0;

    return (
      <Accordion.Item
        bg={'#141414'}
        mb={'4px'}
        style={{ borderRadius: '5px', border: 'none' }}
        value={userObject._id}
        key={userObject._id}
      >
        <Accordion.Control>
          <AccordionLabel
            label={userObject.userName}
            image={userObject.image}
            description={userObject.fullName}
          />
        </Accordion.Control>
        <Accordion.Panel>
          <ExpectedWinPercent meanGameSize={meanGameSize(userObject._id) ?? 0} winPercent={winPercent} />
        </Accordion.Panel>
      </Accordion.Item>
    );
  });

  return (
    <Accordion   
      styles={{
        chevron: { color: '#b9b9b9' },
        control: { 
          backgroundColor: '#141414',
        },
      }} 
      mt="10px" 
      chevronPosition="right" 
    >
      {items}
    </Accordion>
  );
}

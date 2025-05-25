'use client';

import { useEffect, useState } from 'react';
import { IconCheck } from '@tabler/icons-react';
import { Button, Notification, Stack, Transition } from '@mantine/core';
import { useAppContext } from '@/app/lib/AppContext';
import DateSelection from '@/components/NewGamePage/DateSelection';
import ParticipantsSelection from '@/components/NewGamePage/ParticipantsSelection';
import SportSelection from '@/components/NewGamePage/SportSelection';
import WinnerSelection from '@/components/NewGamePage/WinnerSelection';
import { DateTime } from 'luxon';
import { useRouter } from 'next/navigation';

export default function Page() {
  const { users, sports, userObjects, addGame } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<DateTime | null>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [selectedWinner, setSelectedWinner] = useState<string>('');
  const [selectedSport, setSelectedSport] = useState<string | null>('');
  const [disabled, setDisabled] = useState<boolean>(true);
  const [showTransition, setShowTransition] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const checkIcon = <IconCheck size={20} />;

  const router = useRouter();

  const userArray = users?.map((user) => user.userName) || [];
  const sportsArray = sports ? sports.map((sport) => ({ value: sport, label: sport })) : [];

  useEffect(() => {
    if (selectedDate && selectedParticipants.length > 1 && selectedWinner && selectedSport) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [selectedDate, selectedParticipants, selectedWinner, selectedSport]);

  const handleClick = () => {
    router.push('/autodarts');
  };

  const handleDateChange = (date: DateTime | null) => {
    setSelectedDate(date);
  };

  const handleParticipantsChange = (participants: string[]) => {
    setSelectedParticipants(participants);

    if (participants.length === 0) {
      setSelectedWinner('');
    } else if (!participants.includes(selectedWinner)) {
      setSelectedWinner('');
    }
  };

  const handleWinnerChange = (winner: string) => {
    setSelectedWinner(winner);
  };

  const handleSportChange = (sport: string | null) => {
    setSelectedSport(sport);
  };

  const handleSaveGame = async () => {
    if (!selectedDate || !selectedParticipants.length || !selectedWinner || !selectedSport) {
      return;
    }

    const gameObject = {
      date: selectedDate.toString(),
      participants: selectedParticipants,
      winner: selectedWinner,
      sport: selectedSport,
    };

    try {
      setButtonLoading(true);

      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameObject),
      });

      if (!response.ok) {
        throw new Error('Failed to save game');
      }

      setShowTransition(true);
      const responseData = await response.json();
      addGame({
        _id: responseData.insertedId,
        date: gameObject.date,
        participants: gameObject.participants,
        winner: gameObject.winner,
        sport: gameObject.sport,
      });

      setSelectedDate(null);
      setSelectedParticipants([]);
      setSelectedWinner('');
      setSelectedSport('');
    } catch (error) {
      console.error('Error saving game:', error);
    } finally {
      setButtonLoading(false);
      setTimeout(() => {
        setShowTransition(false);
      }, 3000);
    }
  };

  return (
    <Stack align="center">
      <Stack
        align="center"
        p={'18px'}
        bg={'#141414'}
        w={'100%'}
        mt={'4vh'}
        style={{ borderRadius: '5px' }}
      >
        <DateSelection selectedDate={selectedDate} handleDateChange={handleDateChange} />
        <ParticipantsSelection
          participants={userArray}
          selectedParticipants={selectedParticipants}
          userObjects={userObjects}
          handleParticipantsChange={handleParticipantsChange}
        />
        <WinnerSelection
          participants={selectedParticipants}
          userObjects={userObjects}
          handleWinnerChange={handleWinnerChange}
        />
        <SportSelection
          selectedSport={selectedSport}
          sports={sportsArray}
          handleSportChange={handleSportChange}
        />
        <Button
          disabled={disabled}
          variant="light"
          w={'100%'}
          mt={'15px'}
          h={'50px'}
          onClick={handleSaveGame}
          loading={buttonLoading}
          styles={{
            root: {
              backgroundColor: disabled ? '#2c2c2c' : undefined,
              color: disabled ? '#5f5f5f' : undefined,
              '&:disabled': {
                backgroundColor: '#4a4a4',
              },
            },
          }}
        >
          Save game
        </Button>
      </Stack>
      <Button onClick={handleClick} variant='subtle'>Import from Autodarts</Button>
      <Transition mounted={showTransition} transition="fade" duration={400} timingFunction="ease">
        {(styles) => (
          <Notification
            bg={'#2e2d2d'}
            w={'70vw'}
            style={styles}
            icon={checkIcon}
            color="teal"
            title="All good!"
            withCloseButton={false}
            styles={{
              root: {
                backgroundColor: '#2e2d2d',
              },
              title: {
                color: '#ffffff',
              },
              description: {
                color: '#ffffff',
              },
            }}
          >
            Game saved successfully!
          </Notification>
        )}
      </Transition>
    </Stack>
  );
}

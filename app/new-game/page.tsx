"use client";

import { useEffect, useState } from "react";
import DateSelection from "@/components/NewGamePage/DateSelection";
import { Stack, Button, Transition } from "@mantine/core";
import { useAppContext } from "@/app/lib/AppContext";
import ParticipantsSelection from "@/components/NewGamePage/ParticipantsSelection";
import WinnerSelection from "@/components/NewGamePage/WinnerSelection";
import SportSelection from "@/components/NewGamePage/SportSelection";
import { IconCheck } from '@tabler/icons-react';
import { Notification } from '@mantine/core';

export default function Page() {
  const { users, sports, addGame } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [selectedWinner, setSelectedWinner] = useState<string>('');
  const [selectedSport, setSelectedSport] = useState<string | null>('');
  const [disabled, setDisabled] = useState<boolean>(true);
  const [showTransition, setShowTransition] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const checkIcon = <IconCheck size={20} />;

  const userArray = users?.map((user) => user.userName) || [];
  const sportsArray = sports ? sports.map(sport => ({ value: sport, label: sport })) : [];

  useEffect
  (() => {
    if (selectedDate && selectedParticipants.length > 1 && selectedWinner && selectedSport) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [selectedDate, selectedParticipants, selectedWinner, selectedSport]);

  const handleDateChange = (date: Date | null) => {
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
      date: selectedDate.toISOString(),
      participants: selectedParticipants,
      winner: selectedWinner,
      sport: selectedSport,
    };

    try {
      setButtonLoading(true); 

      const response = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameObject),
      });

      if (!response.ok) {
        throw new Error("Failed to save game");
      }

      setShowTransition(true);
      const responseData = await response.json();
      addGame
      ({ 
        _id: responseData.insertedId,
        date: gameObject.date,
        participants: gameObject.participants,
        winner: gameObject.winner,
        sport: gameObject.sport,
      });

      setSelectedDate(null);
      setSelectedParticipants([]);
      setSelectedWinner("");
      setSelectedSport("");
    } catch (error) {
      console.error("Error saving game:", error);
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
        p={"18px"}
        bg={"#141414"}
        w={"70vw"}
        mt={"4vh"}
        style={{ borderRadius: "12px" }}
      >
        <DateSelection selectedDate={selectedDate} handleDateChange={handleDateChange} />
        <ParticipantsSelection
          participants={userArray} 
          selectedParticipants={selectedParticipants} 
          handleParticipantsChange={handleParticipantsChange} 
        />

        <WinnerSelection participants={selectedParticipants} handleWinnerChange={handleWinnerChange} />
        <SportSelection selectedSport={selectedSport} sports={sportsArray} handleSportChange={handleSportChange} />
        
        <Button
          disabled={disabled}
          variant="light"
          w={"100%"}
          mt={'15px'}
          h={'50px'}
          onClick={handleSaveGame}
          loading={buttonLoading}
        >
          Save game
        </Button>
        </Stack>
        <Transition
          mounted={showTransition}
          transition="fade"
          duration={400}
          timingFunction="ease"
        >
          {(styles) => 
            <Notification 
              w={"70vw"} 
              style={styles} 
              icon={checkIcon} 
              color="teal" 
              title="All good!" 
              withCloseButton={false}
            >
              Game saved successfully!
          </Notification>
            }
        </Transition>
      </Stack>
    );
  }

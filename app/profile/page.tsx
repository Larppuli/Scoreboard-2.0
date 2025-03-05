'use client'

import { useMemo } from 'react';
import { LoadingOverlay, Stack, Text, Image, AspectRatio } from '@mantine/core';
import { useAppContext } from '@/app/lib/AppContext';
import ImageUpload from '@/components/ProfilePage/ImageUpload';
import ProfileCard from '@/components/ProfilePage/ProfileCard';
import PointsCard from '@/components/ProfilePage/PointsCard';

export default function Page() {
  const { user, loading, userObjects, games, fetchUserObjects } = useAppContext();
  const userAvatar = user?._id ? userObjects[user.userName]?.image : null;
  // Count games and wins
  const gameCount = useMemo(() => 
    games?.filter(game => user?.userName && game.participants.includes(user.userName)).length || 0,
    [games, user]
  );
  const winCount = useMemo(() => 
    games?.filter(game => user?.userName && game.winner.includes(user.userName)).length || 0,
    [games, user]
  );

  // Calculate days since last game
  const daysSinceLastGame = useMemo(() => {
    if (!games || !user?.userName) return null;

    const userGames = games
      .filter(game => game.participants.includes(user.userName))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (userGames.length === 0) return null;

    const lastGameDate = new Date(userGames[0].date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastGameDate.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }, [games, user]);

  const handleImageUpload = () => {
    fetchUserObjects();
  };

  

  const pointsArray: number[] = [];
  let cumulativePoints = 0;
  
  games?.slice().reverse().forEach((game) => {
      if (user?.userName && game.participants.includes(user.userName)) {
          if (game.winner === user.userName) {
              cumulativePoints += game.participants.length * 2;
          } else {
              cumulativePoints -= (5 - game.participants.length);
              cumulativePoints = Math.max(0, cumulativePoints);
          }
          pointsArray.push(cumulativePoints);
      }
  });

  return (
    <Stack>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ color: 'black', radius: 'sm', blur: 4 }}
        loaderProps={{ color: 'red', type: 'bars' }}
      />
      <Stack align="center">
        <AspectRatio pt={'35px'}>
          <Image
            src={userAvatar}
            alt="Profile Picture"
            h={150}
            w={150}
            radius="50%"
            style={{ objectFit: "cover" }}
          />
        </AspectRatio>
        <ImageUpload setSelectedImage={handleImageUpload} />
        <Text mt={'-10px'} size="35px" fw={'bold'} c={'white'}>
          {user?.userName}
        </Text>
        <ProfileCard 
          gameCount={gameCount} 
          winCount={winCount} 
          lossCount={gameCount - winCount} 
          daysSinceLastGame={daysSinceLastGame}
        />
        <PointsCard pointsArray={pointsArray} userObjects={userObjects} />
      </Stack>
    </Stack>
  );
}

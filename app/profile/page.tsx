'use client';

import { useMemo } from 'react';
import { AspectRatio, Image, LoadingOverlay, Stack, Text } from '@mantine/core';
import { useAppContext } from '@/app/lib/AppContext';
import ImageUpload from '@/components/ProfilePage/ImageUpload';
import PointsCard from '@/components/ProfilePage/PointsCard';
import ProfileCard from '@/components/ProfilePage/ProfileCard';

export default function Page() {
  const { user, loading, userObjects, games, fetchUserObjects } = useAppContext();

  const userAvatar = user?._id 
  ? userObjects.find((u) => u._id === user._id)?.image || null
  : null;


  const gameCount = useMemo(() => {
    if (!user?._id || !Array.isArray(games)) return 0;
    return games.filter((game) => game.participants.includes(user._id)).length || 0;
  }, [games, user]);

  const winCount = useMemo(() => {
    if (!user?._id || !Array.isArray(games)) return 0;
    return games.filter((game) => game.winner.includes(user._id)).length || 0;
  }, [games, user]);

  const daysSinceLastGame = useMemo(() => {
    if (!user?._id || !Array.isArray(games)) return null;
  
    const userGames = games
      .filter((game) => game.participants.includes(user._id)) // ✅ Match by _id
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

  if (user?._id && Array.isArray(games)) {
    games
      .slice()
      .reverse()
      .forEach((game) => {
        if (game.participants.includes(user._id)) {
          if (
            Array.isArray(game.winner)
              ? game.winner.includes(user._id)
              : game.winner === user._id
          ) {
            cumulativePoints += game.participants.length * 2;
          } else {
            cumulativePoints -= 5 - game.participants.length;
            cumulativePoints = Math.max(0, cumulativePoints);
          }
          pointsArray.push(cumulativePoints);
        }
      });
  }

  if (loading || !user || !games) {
    return <LoadingOverlay  
      visible={true}         
      overlayProps={{ radius: 'sm', blur: 2, color: 'rgba(14, 14, 14, 0.6)' }}
      loaderProps={{ color: 'red', type: 'bars' }}  
    />;
  }

  return (
    <Stack>
      <Stack align="center">
        <AspectRatio pt={'35px'}>
          <Image
            src={userAvatar}
            alt="Profile Picture"
            h={150}
            w={150}
            radius="50%"
            style={{ objectFit: 'cover' }}
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
          daysSinceLastGame={daysSinceLastGame || 0}
        />
        <PointsCard
          pointsArray={pointsArray.length ? pointsArray : [0]}
          userObjects={userObjects || []}
        />
      </Stack>
    </Stack>
  );
}

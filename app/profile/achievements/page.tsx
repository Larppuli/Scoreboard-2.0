'use client';

import { Stack, Text, Group } from '@mantine/core';
import { useAppContext } from '@/app/lib/AppContext';
import AchievementCard from '@/components/AchievementsPage/AchievementCard';
import { IconStarFilled, IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';

export default function Page() {
    const { games, user, userObjects } = useAppContext();

    const userGames = games?.filter((game) => user?._id && game.participants.includes(user._id));
    const gamesWon = games?.filter((game) => game.winner === user?._id);
    const gamesLost = games?.filter((game) => game.winner !== user?._id && game.participants.includes(user?._id || ''));
    const userObject = userObjects.find((userObject) => userObject._id === user?._id);
    const petanquesWon = games?.filter((game) => game.winner === user?._id && game.sport === 'Petanque');
    const snookersWon = games?.filter((game) => game.winner === user?._id && game.sport === 'Snooker');
    const footballsWon = games?.filter((game) => game.winner === user?._id && game.sport === 'Football');
    const differentSports = games?.map((game) => game.sport).filter((value, index, self) => self.indexOf(value) === index);

    const achievements = [
        {
            title: 'Casual Player',
            tierData: [
                { description: 'Play 20 games', nextTier: 20 },
                { description: 'Play 40 games', nextTier: 40 },
                { description: 'Play 70 games', nextTier: 70 },
                { description: 'Play 100 games', nextTier: 1000 }
            ],
            tier: userGames?.length >= 100 ? 4 : userGames?.length >= 70 ? 3 : userGames?.length >= 40 ? 2 : userGames?.length >= 20 ? 1 : 0,
            currentProgress: userGames?.length
        },
        {
            title: 'Win Conqueror',
            tierData: [
                { description: 'Win 10 games', nextTier: 10 },
                { description: 'Win 20 games', nextTier: 20 },
                { description: 'Win 40 games', nextTier: 40 },
                { description: 'Win 80 games', nextTier: 80 }
            ],
            tier: gamesWon?.length >= 80 ? 4 : gamesWon?.length >= 40 ? 3 : gamesWon?.length >= 20 ? 2 : gamesWon?.length >= 10 ? 1 : 0,
            currentProgress: gamesWon?.length
        },
        {
            title: 'Total Loser',
            tierData: [
                { description: 'Lose 30 games', nextTier: 30 },
                { description: 'Lose 60 games', nextTier: 60 },
                { description: 'Lose 90 games', nextTier: 90 },
                { description: 'Lose 120 games', nextTier: 120 }
            ],
            tier: gamesLost?.length >= 120 ? 4 : gamesLost?.length >= 90 ? 3 : gamesLost?.length >= 60 ? 2 : gamesLost?.length >= 30 ? 1 : 0,
            currentProgress: gamesLost?.length
        },
        {
            title: 'Influencer',
            tierData: [
                { description: 'Update your profile picture', nextTier: 1 }
            ],
            tier: userObject?.image.includes('DefaultPFP') ? 0 : 1,
            currentProgress: userObject?.image.includes('DefaultPFP') ? 0 : 1,
        },
        {
            title: 'Petanque Mastery',
            tierData: [
                { description: 'Win 5 petanque games', nextTier: 5 },
                { description: 'Win 10 petanque games', nextTier: 10 },
                { description: 'Win 20 petanque games', nextTier: 20 },
                { description: 'Win 40 petanque games', nextTier: 40 }
            ],
            tier: petanquesWon?.length >= 40 ? 4 : petanquesWon?.length >= 20 ? 3 : petanquesWon?.length >= 10 ? 2 : petanquesWon?.length >= 5 ? 1 : 0,
            currentProgress: petanquesWon?.length
        },
        {
            title: 'Snooker Maestro',
            tierData: [
                { description: 'Win 5 snooker games', nextTier: 5 },
                { description: 'Win 10 snooker games', nextTier: 10 },
                { description: 'Win 20 snooker games', nextTier: 20 },
                { description: 'Win 40 snooker games', nextTier: 40 }
            ],
            tier: snookersWon?.length >= 40 ? 4 : snookersWon?.length >= 20 ? 3 : snookersWon?.length >= 10 ? 2 : snookersWon?.length >= 5 ? 1 : 0,
            currentProgress: snookersWon?.length
        },
        {
            title: 'Dr. Lingardinho',
            tierData: [
                { description: 'Win 5 football games', nextTier: 5 },
                { description: 'Win 10 football games', nextTier: 10 },
                { description: 'Win 20 football games', nextTier: 20 },
                { description: 'Win 40 football games', nextTier: 40 }
            ],
            tier: footballsWon?.length >= 40 ? 4 : footballsWon?.length >= 20 ? 3 : footballsWon?.length >= 10 ? 2 : footballsWon?.length >= 5 ? 1 : 0,
            currentProgress: footballsWon?.length
        },
        {
            title: 'Multitalent',
            tierData: [
                { description: 'Play 1 different sport', nextTier: 1 },
                { description: 'Play 3 different sports', nextTier: 3 },
                { description: 'Play 5 different sports', nextTier: 5 },
                { description: 'Play 7 different sports', nextTier: 7 }
            ],
            tier: differentSports?.length >= 7 ? 4 : differentSports?.length >= 5 ? 3 : differentSports?.length >= 3 ? 2 : differentSports?.length >= 1 ? 1 : 0,
            currentProgress: differentSports?.length
        },
    ];

    const totalTiers = achievements.reduce((sum, achievement) => sum + achievement.tierData.length, 0);
    const totalTiersAchieved = achievements.reduce((sum, achievement) => sum + achievement.tier, 0);

    return (
        <Stack align='center'>
            <Group justify='space-between' w='90%' mt={20} pos="relative">
                <Link href={'/profile'}>
                    <IconArrowLeft size={30} color={'#7b7b7b'} />
                </Link>
                <Group 
                    gap={5} 
                    pos="absolute" 
                    left="50%" 
                    style={{ transform: 'translateX(-50%)' }}
                >
                    <Text c={'white'} fw={700} size="20px">
                        {totalTiersAchieved}/{totalTiers}
                    </Text>
                    <IconStarFilled size={20} color={'#ffcc00'} />
                </Group>
            </Group>

            {achievements.map((achievement) => (
                <AchievementCard 
                    key={achievement.title}
                    title={achievement.title} 
                    tierData={achievement.tierData} 
                    tier={achievement.tier}
                    currentProgress={achievement.currentProgress}
                />
            ))}
        </Stack>
    );
}

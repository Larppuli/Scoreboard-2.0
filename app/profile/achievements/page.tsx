'use client';

import { Stack, Text, Group } from '@mantine/core';
import { useAppContext } from '@/app/lib/AppContext';
import AchievementCard from '@/components/AchievementsPage/AchievementCard';
import { 
    IconStarFilled, 
    IconArrowLeft, 
    IconTrophy, 
    IconPlayFootball, 
    IconMoodLookDown, 
    IconBrandInstagram, 
    IconCircles, 
    IconSportBillard, 
    IconBallFootball, 
    IconStars,
    IconCalendarWeek,
    IconUsersGroup,
    IconSparkles
 } from '@tabler/icons-react';
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
    const differentSportsWonSet = new Set(gamesWon?.map((game) => game.sport))
    const differentSportsWonArray = Array.from(differentSportsWonSet);
    const gameMonths = new Set(games?.map((game) => new Date(game.date).getMonth()));
    const totalParticipants = userGames?.reduce((sum, game) => sum + game.participants.length, 0);

    const achievements = [
        {
            title: 'Casual Player',
            tierData: [
                { description: 'Play 20 games', nextTier: 20 },
                { description: 'Play 40 games', nextTier: 40 },
                { description: 'Play 70 games', nextTier: 70 },
                { description: 'Play 100 games', nextTier: 1000 }
            ],
            tier: userGames?.length >= 100 ? 4 
                : userGames?.length >= 70 ? 3 
                : userGames?.length >= 40 ? 2 
                : userGames?.length >= 20 ? 1 
                : 0,
            currentProgress: userGames?.length,
            icon: <IconPlayFootball size={40} />,
            showProgress: true,
            isLegend: false
        },
        {
            title: 'Win Conqueror',
            tierData: [
                { description: 'Win 10 games', nextTier: 10 },
                { description: 'Win 20 games', nextTier: 20 },
                { description: 'Win 40 games', nextTier: 40 },
                { description: 'Win 80 games', nextTier: 80 }
            ],
            tier: gamesWon?.length >= 80 ? 4 
                : gamesWon?.length >= 40 ? 3 
                : gamesWon?.length >= 20 ? 2 
                : gamesWon?.length >= 10 ? 1 
                : 0,
            currentProgress: gamesWon?.length,
            icon: <IconTrophy size={40} />,
            showProgress: true,
            isLegend: false
        },
        {
            title: 'Total Loser',
            tierData: [
                { description: 'Lose 30 games', nextTier: 30 },
                { description: 'Lose 60 games', nextTier: 60 },
                { description: 'Lose 90 games', nextTier: 90 },
                { description: 'Lose 120 games', nextTier: 120 }
            ],
            tier: gamesLost?.length >= 120 ? 4 
                : gamesLost?.length >= 90 ? 3 
                : gamesLost?.length >= 60 ? 2 
                : gamesLost?.length >= 30 ? 1 
                : 0,
            currentProgress: gamesLost?.length,
            icon: <IconMoodLookDown size={40} />,
            showProgress: true,
            isLegend: false
        },
        {
            title: 'Influencer',
            tierData: [
                { description: 'Update your profile picture', nextTier: 1 }
            ],
            tier: userObject?.image.includes('DefaultPFP') ? 0 : 1,
            currentProgress: userObject?.image.includes('DefaultPFP') ? 0 : 1,
            icon: <IconBrandInstagram size={40} />,
            showProgress: false,
            isLegend: false
        },
        {
            title: 'Petanque Mastery',
            tierData: [
                { description: 'Win 5 petanque games', nextTier: 5 },
                { description: 'Win 10 petanque games', nextTier: 10 },
                { description: 'Win 20 petanque games', nextTier: 20 },
                { description: 'Win 40 petanque games', nextTier: 40 }
            ],
            tier: petanquesWon?.length >= 40 ? 4 
                : petanquesWon?.length >= 20 ? 3 
                : petanquesWon?.length >= 10 ? 2 
                : petanquesWon?.length >= 5 ? 1 
                : 0,
            currentProgress: petanquesWon?.length,
            icon: <IconCircles size={40} color={'#909090'} />,
            showProgress: true,
            isLegend: false
        },
        {
            title: 'Snooker Maestro',
            tierData: [
                { description: 'Win 5 snooker games', nextTier: 5 },
                { description: 'Win 10 snooker games', nextTier: 10 },
                { description: 'Win 20 snooker games', nextTier: 20 },
                { description: 'Win 40 snooker games', nextTier: 40 }
            ],
            tier: snookersWon?.length >= 40 ? 4 
                : snookersWon?.length >= 20 ? 3 
                : snookersWon?.length >= 10 ? 2 
                : snookersWon?.length >= 5 ? 1 
                : 0,
            currentProgress: snookersWon?.length,
            icon: <IconSportBillard size={40} color={'#909090'} />,
            showProgress: true,
            isLegend: false
        },
        {
            title: 'Dr. Lingardinho',
            tierData: [
                { description: 'Win 5 football games', nextTier: 5 },
                { description: 'Win 10 football games', nextTier: 10 },
                { description: 'Win 20 football games', nextTier: 20 },
                { description: 'Win 40 football games', nextTier: 40 }
            ],
            tier: footballsWon?.length >= 40 ? 4 
                : footballsWon?.length >= 20 ? 3 
                : footballsWon?.length >= 10 ? 2 
                : footballsWon?.length >= 5 ? 1 
                : 0,
            currentProgress: footballsWon?.length,
            icon: <IconBallFootball size={40} color={'#909090'} />,
            showProgress: true,
            isLegend: false
        },
        {
            title: 'Multitalent',
            tierData: [
                { description: 'Win in 1 different sport', nextTier: 1 },
                { description: 'Win in 3 different sports', nextTier: 3 },
                { description: 'Win in 5 different sports', nextTier: 5 },
                { description: 'Win in 7 different sports', nextTier: 7 }
            ],
            tier: differentSportsWonArray?.length >= 7 ? 4 
                : differentSportsWonArray?.length >= 5 ? 3 
                : differentSportsWonArray?.length >= 3 ? 2 
                : differentSportsWonArray?.length >= 1 ? 1 
                : 0,
            currentProgress: differentSportsWonArray?.length,
            icon: <IconStars size={40} color={'#909090'} />,
            showProgress: true,
            isLegend: false
        },
        {
            title: 'Seasoned Player',
            tierData: [
                { description: 'Play on 3 different months', nextTier: 3 },
                { description: 'Play on 6 different months', nextTier: 6 },
                { description: 'Play on 9 different months', nextTier: 9 },
                { description: 'Play on 12 different months', nextTier: 12 }
            ],
            tier: gameMonths?.size >= 12 ? 4 
                : gameMonths?.size >= 9 ? 3 
                : gameMonths?.size >= 6 ? 2 
                : gameMonths?.size >= 3 ? 1 
                : 0,
            currentProgress: gameMonths?.size,
            icon: <IconCalendarWeek size={40} color={'#909090'} />,
            showProgress: true,
            isLegend: false
        },
        {
            title: 'Crowd Magnet',
            tierData: [
                { description: 'Play with 100 total participants', nextTier: 100 },
                { description: 'Play with 200 total participants', nextTier: 200 },
                { description: 'Play with 400 total participants', nextTier: 400 },
                { description: 'Play with 1000 total participants', nextTier: 1000 }
            ],
            tier: totalParticipants >= 1000 ? 4 
                 : totalParticipants >= 400 ? 3 
                 : totalParticipants >= 200 ? 2 
                 : totalParticipants >= 100 ? 1 
                 : 0,
            currentProgress: totalParticipants,
            icon: <IconUsersGroup size={40} color={'#909090'} />,
            showProgress: true,
            isLegend: false
        },
        {
            title: 'Absolute Legend',
            tierData: [
                { description: 'Get accepted to the Hall of Fame', nextTier: 1 },
            ],
            // Waiting for implementation of Hall of Fame nomination
            tier: 0,
            currentProgress: 0,
            icon: <IconSparkles size={40} color={'#909090'} />,
            showProgress: false,
            isLegend: true
        }
    ];

    const totalTiers = achievements.reduce((sum, achievement) => sum + achievement.tierData.length, 0);
    const totalTiersAchieved = achievements.reduce((sum, achievement) => sum + achievement.tier, 0);

    return (
        <Stack mt={-10} align='center'>
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
                    icon={achievement.icon}
                    showProgress={achievement.showProgress}
                    isLegend={achievement.isLegend}
                />
            ))}
        </Stack>
    );
}

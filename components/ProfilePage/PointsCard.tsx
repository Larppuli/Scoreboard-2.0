import { useState, useEffect } from 'react';
import { Sparkline } from '@mantine/charts';
import { Stack, Text, Badge, Group } from '@mantine/core';
import { IconScale, IconCircleFilled } from '@tabler/icons-react';
import { PointsCardProps } from '@/app/lib/definitions';
import { CompareModal } from './CompareModal';
import { User } from '@/app/lib/definitions';
import { useAppContext } from '@/app/lib/AppContext';
import { SparklineLengthModal } from './SparklineLengthModal';

export default function PointsCard({ pointsArray }: PointsCardProps) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [compareOpened, setCompareOpened] = useState(false);
    const [lengthModalOpened, setLengthModalOpened] = useState(false);
    const [userPointsArray , setUserPointsArray] = useState<number[]>([]);
    const [selectedUserPointsArray, setSelectedUserPointsArray] = useState<number[]>([]);
    const [sparklineGameNum, setSparklineGameNum] = useState(0);
    const [maxSparklineGameNum, setMaxSparklineGameNum] = useState(0);
    const [ selectedUserSparkinglinePoints, setSelectedUserSparkinglinePoints ] = useState<number[]>([]);
    const [displayMax, setDisplayMax] = useState(false);
    const [sparklineData, setSparklineData] = useState<any[]>([]);
    const { games } = useAppContext();

    const icon = selectedUser ? <IconCircleFilled size={10} style={{ marginRight: '-10px' }} color={"#ffd100"}/> : <IconScale size={15} />;
    const referenceIndex = Math.max(0, pointsArray.length - sparklineGameNum);
    const compareBadgeText = selectedUser ? selectedUser.userName : 'Compare';
    const sparklineGameNumBadgeText = displayMax ? 'Max' :  `${sparklineGameNum} Games`;

    const development = {
        amount: pointsArray[pointsArray.length - 1] - pointsArray[referenceIndex],
        percent: pointsArray[referenceIndex] !== 0 
            ? ((pointsArray[pointsArray.length - 1] - pointsArray[referenceIndex]) / pointsArray[referenceIndex]) * 100
            : 0,
        color: pointsArray[pointsArray.length - 1] - pointsArray[referenceIndex] >= 0 ? 'green' : 'red'
    };

    const formattedPercent = development.percent > 0 
        ? `+${development.percent.toFixed(2)}%` 
        : `${development.percent.toFixed(2)}%`;

    const formattedAmount = development.amount > 0 
        ? `+${development.amount}` 
        : `${development.amount}`;

    const handleUserSelect = (user: User) => {
        const selectedUserPoints: number[] = [];
        let cumulativePoints = 0;
        
        games?.slice().reverse().forEach((game: any) => {
            if (game.participants.includes(user.userName)) {
                if (game.winner === user.userName) {
                    cumulativePoints += game.participants.length * 2;
                } else {
                    cumulativePoints -= (5 - game.participants.length);
                    cumulativePoints = Math.max(0, cumulativePoints);
                }
                selectedUserPoints.push(cumulativePoints);
            }
        });
        setSelectedUserSparkinglinePoints(selectedUserPoints);
        setSelectedUserPointsArray(selectedUserPoints);
        setSelectedUser(user);
        setCompareOpened(false);
        if (sparklineGameNum > selectedUserPoints.length) {
            const trimmedLength = findClosestSparklineLength(selectedUserPoints.length);
            setUserPointsArray(pointsArray.slice(-trimmedLength));
            setSelectedUserPointsArray([...selectedUserPoints.slice(-trimmedLength)]);
            setSparklineGameNum(trimmedLength);
        }
    };

    const handleSparklineLengthSelect = (length: number) => {
        setSparklineGameNum(length);
        setLengthModalOpened(false);
        setSelectedUserPointsArray(selectedUserSparkinglinePoints.slice(selectedUserSparkinglinePoints.length - length));
        setUserPointsArray(pointsArray.slice(pointsArray.length - length));
    };

    const findClosestSparklineLength = (pointsArrayLength: number): number => {
        const lengths = [5, 10, 15, 20, 25, 30];
        return lengths.filter(length => length <= pointsArrayLength).pop() || 5;
    };

    const handleDisplayMaxChange = (display: boolean): void => {
        setDisplayMax(display);
    };

    function mergeArraysToObjects(array1: number[], array2: number[]): any[] {
        return array1.map((value, index) => ({
            array1: value,
            array2: array2[index]
        }));
    }

    useEffect(() => {
        const trimmedLength = selectedUser ? Math.min(findClosestSparklineLength(pointsArray.length), findClosestSparklineLength(selectedUserPointsArray.length)) : findClosestSparklineLength(pointsArray.length);
        setSparklineGameNum(trimmedLength);
        setUserPointsArray(pointsArray.slice(-trimmedLength));
        setMaxSparklineGameNum(selectedUser ? Math.min(pointsArray.length, selectedUserPointsArray.length) : pointsArray.length)
        setSparklineData(mergeArraysToObjects(userPointsArray, selectedUserPointsArray));
    }, [selectedUser, games, pointsArray]);

    const areaProps = {
        isAnimationActive: true,
        animationDuration: 500,
    };

    return (
        <Stack 
            mt="10px" 
            w="80vw" 
            bg={'#141414'} 
            style={{ borderRadius: "8px" }}
        >
            <Stack gap={0}>
                <Stack gap={0}>
                    <Text size="14px" mt={'10px'} c={'#a9a9a9'} fw={500} ml="10px">
                        Current points
                    </Text>
                    <Text size="xl" pt={'-10px'} c={'white'} fw={700} ml="10px">
                        {pointsArray[pointsArray.length - 1]}
                    </Text>
                    <Text size="14px" c={development.color} fw={500} ml="10px">
                        {formattedPercent} ({formattedAmount})
                    </Text>
                </Stack>
                <div style={{ position: 'relative', width: '100%', height: '60px' }}>
                    <Sparkline
                        w={'100%'}
                        h={60}
                        data={userPointsArray}
                        color="#00fff9"
                        fillOpacity={0.04}
                        strokeWidth={1.5}
                        areaProps={areaProps}
                    />
                    {selectedUserPointsArray.length > 0 && (
                        <Sparkline
                            w={'100%'}
                            h={60}
                            data={selectedUserPointsArray}
                            color="#ffd100"
                            fillOpacity={0}
                            strokeWidth={1.5}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                zIndex: 2,
                            }}
                        />
                    )}
                </div>
            </Stack>
            <Group justify="space-between">
                <Badge
                    onClick={() => setCompareOpened(true)}
                    ml={'9px'}
                    mb={'9px'}
                    h={'25px'}
                    w={'90px'}
                    leftSection={icon}
                    fw={700}
                    p={'4px'}
                    bg={'#303030'}
                    style={{ textTransform: 'none' }}
                >
                    {compareBadgeText}
                </Badge>
                <Badge
                    onClick={() => setLengthModalOpened(true)}
                    mr={'9px'}
                    mb={'9px'}
                    h={'25px'}
                    w={'90px'}
                    fw={700}
                    p={'4px'}
                    bg={'#303030'}
                    style={{ textTransform: 'none' }}
                >
                    {sparklineGameNumBadgeText}
                </Badge>
            </Group>
            <CompareModal opened={compareOpened} setOpened={setCompareOpened} onUserSelect={handleUserSelect} />
            <SparklineLengthModal opened={lengthModalOpened} setOpened={setLengthModalOpened} onLengthSelect={handleSparklineLengthSelect} maxLength={maxSparklineGameNum} setDisplayMax={handleDisplayMaxChange} />
        </Stack>
    );
}

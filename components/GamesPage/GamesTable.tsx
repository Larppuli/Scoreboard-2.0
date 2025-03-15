import { useState } from 'react';
import { Stack, Table } from '@mantine/core';
import { useAppContext } from '@/app/lib/AppContext';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, themeQuartz, colorSchemeDark } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function GamesTable() {
  const { games, users } = useAppContext();
  const [colDefs, setColDefs] = useState<ColDef[]>([
    { 
      headerName: 'Date', 
      resizable: false,
      field: 'date', 
      width: 80, 
      cellStyle: { 
        padding: '0px', 
        textAlign: "center", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
      } 
    },
    { 
      headerName: 'Participants', 
      resizable: false,
      field: 'participants', 
      width: 110, 
      autoHeight: true, 
      cellStyle: { 
        whiteSpace: "normal", 
        wordBreak: "break-word", 
        padding: '5px',
        textAlign: "center",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" ,
         lineHeight: "1.5"
      } 
    },
    { 
      headerName: 'Sport', 
      resizable: false,
      field: 'sport', 
      width: 80, 
      cellStyle: { 
        padding: '0px', 
        textAlign: "center", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      } 
    },
    { 
      headerName: 'Winner', 
      resizable: false,
      field: 'winner', 
      width: 80, 
      cellStyle: { 
        padding: '0px',
        textAlign: "center", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      } 
    },
  ]);

  const formatDate = ({ dateString }: { dateString: string }) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatParticipants = (participants: string[]) => {
    return participants
      .map((id) => users?.find((user) => user._id === id)?.firstName || 'Unknown')
      .join(', ');
  };
  
  const formatWinner = (winnerId: string) => {
    return users?.find((user) => user._id === winnerId)?.firstName || 'Unknown';
  };
  const rowData = (Array.isArray(games) ? games : []).map((game) => ({
    date: formatDate({ dateString: game.date }),
    participants: formatParticipants(game.participants),
    sport: game.sport,
    winner: formatWinner(game.winner)
  }));
  

  return (
    <Stack h="79vh" w={'100%'} style={{ overflowY: 'auto', borderRadius: '5px' }}>
      <AgGridReact
            theme={themeQuartz.withPart(colorSchemeDark)}
            rowData={rowData}
            columnDefs={colDefs}
            rowHeight={60}
        />
    </Stack>
  );
}

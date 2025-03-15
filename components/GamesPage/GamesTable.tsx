import { useState } from 'react';
import { Stack } from '@mantine/core';
import { useAppContext } from '@/app/lib/AppContext';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, themeQuartz, colorSchemeDark } from 'ag-grid-community';
import classes from './GamesTable.module.css';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function GamesTable() {
  const { games, users } = useAppContext();
  const [colDefs, setColDefs] = useState<ColDef[]>([
    { 
      headerName: 'Date', 
      resizable: false,
      headerClass: classes.headerStyle,
      cellClass: classes.tableRowCell,
      field: 'date', 
      flex: 1,
    },
    { 
      headerName: 'Participants', 
      resizable: false,
      headerClass: classes.headerStyle,
      field: 'participants', 
      flex: 1, 
      cellClass: classes.tableRowCell,
      autoHeight: true,
      cellStyle: { 
        whiteSpace: "normal", 
        wordBreak: "break-word", 
        textAlign: "center",
        display: "flex",
        flexWrap: "wrap",
        lineHeight: "1.3",
        padding: "0"
      }

    },
    { 
      headerName: 'Sport', 
      resizable: false,
      headerClass: classes.headerStyle,
      cellClass: classes.tableRowCell,
      field: 'sport', 
      flex: 1,

    },
    { 
      headerName: 'Winner', 
      resizable: false,
      headerClass: classes.headerStyle,
      cellClass: classes.tableRowCell,
      field: 'winner', 
      flex: 0.9,

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
      .join(',\n');
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
    <Stack h="79vh" w="100%">
      <AgGridReact
        theme={themeQuartz.withPart(colorSchemeDark)}
        rowData={rowData}
        columnDefs={colDefs}
        rowHeight={40}
      />
    </Stack>
  );
}

'use client'

import { Container } from "@mantine/core";
import GamesTable from "@/components/GamesPage/GamesTable";

export default function Page() {
  return (
    <Container w={'100%'} bg={'#202020'} style={{ borderRadius: '10px' }}> 
        <GamesTable />
    </Container>
  );
}

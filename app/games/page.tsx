'use client'

import { Container } from "@mantine/core";
import GamesTable from "@/components/GamesPage/GamesTable";

export default function Page() {
  return (
    <Container p={0} w={'90vw'}> 
        <GamesTable />
    </Container>
  );
}

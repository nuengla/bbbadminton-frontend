import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import type { PlayerType } from "../home";

type PlayingPageProps = {
  // Add your props here
};

const PlayingPage: React.FC<PlayingPageProps> = ({}) => {
  const [playerList, setPlayerList] = useState<PlayerType[]>([]);

  const [teamA, setTeamA] = useState<PlayerType[]>([]);
  const [teamB, setTeamB] = useState<PlayerType[]>([]);

  useEffect(() => {
    setPlayerList(JSON.parse(localStorage.getItem("playerList") || "[]"));
  }, []);

  function matchPlayers(players: PlayerType[]) {
    if (!confirm()) return false;
    // 1. sort จากคนน้อยไปมาก
    const sorted = [...players].sort((a, b) => a.playingCount - b.playingCount);

    // 2. shuffle นิดหน่อย (เฉพาะ top คนที่เล่นน้อย)
    const candidates = sorted.slice(0, 6).sort(() => Math.random() - 0.5);

    // 3. เลือก 4 คน
    const selected = candidates.slice(0, 4);

    // 4. shuffle อีกทีเพื่อคละทีม
    const shuffled = selected.sort(() => Math.random() - 0.5);

    const teamA = [shuffled[0], shuffled[1]];
    const teamB = [shuffled[2], shuffled[3]];

    // 5. update playingCount
    const updatedPlayers = players.map((p) => {
      const found = selected.find((s) => s.id === p.id);
      if (found) {
        return {
          ...p,
          playingCount: p.playingCount + 1,
        };
      }
      return p;
    });

    return {
      teamA,
      teamB,
      updatedPlayers,
    };
  }

  return (
    <>
      <div className="p-6 min-h-[calc(100dvh-68.5px)]">
        <div className="flex justify-between mb-4">
          <Button
            onClick={() => {
              window.location.href = "/";
            }}
          >
            กลับ
          </Button>
          <Button
            color="error"
            onClick={() => {
              localStorage.removeItem("playerList");
              window.location.href = "/";
            }}
          >
            ล้างค่า
          </Button>
        </div>

        {teamA.length > 0 && teamB.length > 0 && (
          <div className="text-xl text-center mb-4">
            {teamA[0]?.name},{teamA[1]?.name} VS {teamB[0]?.name},
            {teamB[1]?.name}
          </div>
        )}

        <div>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 30, textAlign: "center" }}>
                    No.
                  </TableCell>
                  <TableCell>ชื่อ</TableCell>
                  <TableCell sx={{ textAlign: "end" }}>
                    จำนวนครั้งที่เล่น
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {playerList.map((player: any, i: number) => (
                  <TableRow
                    key={player.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {i + 1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {player.name}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ textAlign: "end" }}
                    >
                      {player.playingCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <div className="sticky bottom-0 p-4 bg-white">
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            const data: any = matchPlayers(playerList);
            if (data) {
              setTeamA(data.teamA);
              setTeamB(data.teamB);
              localStorage.setItem(
                "playerList",
                JSON.stringify(data.updatedPlayers),
              );
              setPlayerList(
                JSON.parse(localStorage.getItem("playerList") || "[]"),
              );
            }
          }}
        >
          จับคู่
        </Button>
      </div>
    </>
  );
};

export default PlayingPage;

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

  let currentRound = Number(localStorage.getItem("round") || 1);

  function matchPlayers(players: PlayerType[]) {
    if (!confirm("จับคู่ใหม่ ?")) return false;

    const MIN_REST = 1; // ต้องพักอย่างน้อย 1 เกม

    const getPairScore = (a: PlayerType, b: PlayerType) => {
      return (a.playedWith?.[b.id] || 0) + (b.playedWith?.[a.id] || 0);
    };

    // 1. sort โดย:
    // - คนที่พักนาน (priority สูง)
    // - แล้วค่อยดู playingCount
    const sorted = [...players].sort((a, b) => {
      const restA = currentRound - (a.lastPlayedRound || 0);
      const restB = currentRound - (b.lastPlayedRound || 0);

      if (restA !== restB) return restB - restA; // พักนานก่อน
      return a.playingCount - b.playingCount; // เล่นน้อยก่อน
    });

    // 2. filter คนที่ยังพักไม่พอ
    let candidates = sorted.filter((p) => {
      const rest = currentRound - (p.lastPlayedRound || 0);
      return rest > MIN_REST;
    });

    // ถ้าคนไม่พอ → ยอมเอาคนที่เพิ่งเล่นมา
    if (candidates.length < 4) {
      candidates = sorted;
    }

    // 3. เอา top 6 + shuffle
    candidates = candidates.slice(0, 6).sort(() => Math.random() - 0.5);

    const selected = candidates.slice(0, 4);

    // 4. หา team ที่ซ้ำต่ำสุด
    const combos = [
      [
        [0, 1],
        [2, 3],
      ],
      [
        [0, 2],
        [1, 3],
      ],
      [
        [0, 3],
        [1, 2],
      ],
    ];

    let best: any = null;
    let minScore = Infinity;

    for (const combo of combos) {
      const [teamAIdx, teamBIdx] = combo;

      const teamA = teamAIdx.map((i) => selected[i]);
      const teamB = teamBIdx.map((i) => selected[i]);

      const score =
        getPairScore(teamA[0], teamA[1]) + getPairScore(teamB[0], teamB[1]);

      if (score < minScore) {
        minScore = score;
        best = { teamA, teamB };
      }
    }

    // 5. update
    const updatedPlayers = players.map((p) => {
      const isInMatch =
        best.teamA.some((t: any) => t.id === p.id) ||
        best.teamB.some((t: any) => t.id === p.id);

      if (!isInMatch) return p;

      const newPlayedWith = { ...(p.playedWith || {}) };

      const team = best.teamA.some((t: any) => t.id === p.id)
        ? best.teamA
        : best.teamB;

      team.forEach((t: any) => {
        if (t.id !== p.id) {
          newPlayedWith[t.id] = (newPlayedWith[t.id] || 0) + 1;
        }
      });

      return {
        ...p,
        playingCount: p.playingCount + 1,
        playedWith: newPlayedWith,
        lastPlayedRound: currentRound,
      };
    });

    // 6. เพิ่มรอบ
    currentRound++;
    localStorage.setItem("round", String(currentRound));

    return {
      teamA: best.teamA,
      teamB: best.teamB,
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
            color="success"
            onClick={() => {
              if (confirm("เล่นเสร็จแล้ว ?")) {
                window.location.href = "/summary";
              }
            }}
          >
            เล่นเสร็จ
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

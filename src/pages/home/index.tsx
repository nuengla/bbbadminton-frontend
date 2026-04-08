import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";

type HomePageProps = {
  // Add your props here
};

export type PlayerType = {
  name: string;
  playingCount: number;
};

const HomePage: React.FC<HomePageProps> = ({}) => {
  const [name, setName] = useState("");

  const [playerList, setPlayerList] = useState<PlayerType[]>([]);

  const onConfirm = () => {
    localStorage.setItem("playerList", JSON.stringify(playerList));
    window.location.href = "/playing";
  };

  useEffect(() => {
    setPlayerList(JSON.parse(localStorage.getItem("playerList") || "[]"));
  }, []);

  return (
    <>
      <div className="p-6 min-h-dvh">
        <h1 className="text-4xl mb-4">ผู้เล่น</h1>
        <div className="flex gap-4 items-center mb-4">
          <TextField
            fullWidth
            type="text"
            placeholder="ชื่อ"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => {
              if (!name) return;
              setPlayerList((e) => [...e, { name: name, playingCount: 0 }]);
              setName("");
            }}
          >
            เพิ่ม
          </Button>
        </div>

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
                <TableCell sx={{ width: 30, textAlign: "center" }}>
                  ลบ
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
                  <TableCell component="th" scope="row">
                    <IconButton
                      color="error"
                      onClick={() => {
                        setPlayerList((e) =>
                          e.filter((_: any, index: number) => index !== i),
                        );
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="sticky bottom-0 p-4">
        <Button
          disabled={playerList.length < 4}
          fullWidth
          variant="contained"
          onClick={onConfirm}
        >
          ยืนยัน
        </Button>
      </div>
    </>
  );
};

export default HomePage;

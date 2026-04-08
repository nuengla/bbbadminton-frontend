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
import NumberField from "../../components/input-number";

type SummaryPageProps = {
  // Add your props here
};

const SummaryPage: React.FC<SummaryPageProps> = ({}) => {
  const [playerList, setPlayerList] = useState<PlayerType[]>([]);
  const [courtPrice, setCourtPrice] = useState<number>(0);
  const [shuttlecockPrice, setShuttlecockPrice] = useState<number>(0);
  const [shuttlecockAmount, setShuttlecockAmount] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setPlayerList(JSON.parse(localStorage.getItem("playerList") || "[]"));
    setIsMounted(true);
  }, []);

  function calculatePayment(players: PlayerType[], totalPrice: number) {
    const totalPlayingCount = players.reduce(
      (sum, p) => sum + p.playingCount,
      0,
    );

    if (totalPlayingCount === 0) return [];

    const pricePerPlay = totalPrice / totalPlayingCount;

    return players.map((p) => {
      const amount = p.playingCount * pricePerPlay;

      return {
        id: p.id,
        name: p.name,
        playingCount: p.playingCount,
        amount: Number(amount.toFixed(2)),
      };
    });
  }

  useEffect(() => {
    if (isMounted) {
      setPlayerList(
        calculatePayment(
          playerList,
          (shuttlecockPrice || 0) * (shuttlecockAmount || 0) +
            (courtPrice || 0),
        ),
      );
    }
  }, [isMounted, courtPrice, shuttlecockPrice, shuttlecockAmount]);

  return (
    <>
      <div className="p-6 min-h-[calc(100dvh-68.5px)]">
        <div className="text-xl mb-4">สรุปการเล่น</div>

        <div className="w-full mb-4">
          <NumberField
            className="w-full"
            label="ค่าคอร์ท"
            value={courtPrice}
            onValueChange={(e) => setCourtPrice(Number(e))}
          />
        </div>
        <div className="flex gap-4 mb-4">
          <NumberField
            className="w-full"
            label="จำนวนลูกแบดที่ใช้"
            value={shuttlecockAmount}
            onValueChange={(e) => setShuttlecockAmount(Number(e))}
          />
          <NumberField
            className="w-full"
            label="ราคาลูกแบดรายลูก"
            value={shuttlecockPrice}
            onValueChange={(e) => setShuttlecockPrice(Number(e))}
          />
        </div>

        <div className="flex justify-between mb-4">
          <div>ราคาคอร์ท</div>
          <div className="flex">
            <div>{courtPrice?.toLocaleString() || 0}</div>
            <div className="w-10 ms-2">บาท</div>
          </div>
        </div>

        <div className="flex justify-between mb-4">
          <div>จำนวนลูกแบดที่ใช้ {shuttlecockAmount || 0} ลูก</div>
          <div className="flex">
            <div>
              {(
                (shuttlecockPrice || 0) * (shuttlecockAmount || 0)
              )?.toLocaleString() || 0}
            </div>
            <div className="w-10 ms-2">บาท</div>
          </div>
        </div>

        <div className="flex justify-between mb-4">
          <div>รวม</div>
          <div className="flex">
            <div>
              {(
                (shuttlecockPrice || 0) * (shuttlecockAmount || 0) +
                (courtPrice || 0)
              )?.toLocaleString() || 0}
            </div>
            <div className="w-10 ms-2">บาท</div>
          </div>
        </div>

        <div className="flex justify-between mb-4">
          <div>จำนวนผู้เล่น</div>
          <div className="flex">
            <div>{playerList.length}</div>
            <div className="w-10 ms-2">คน</div>
          </div>
        </div>

        <div className="flex justify-between mb-4">
          <div>จ่ายคนละ (หารเท่ากัน)</div>
          <div className="flex">
            <div>
              {Number(
                (
                  ((shuttlecockPrice || 0) * (shuttlecockAmount || 0) +
                    (courtPrice || 0)) /
                  (playerList.length || 1)
                ).toFixed(2),
              ).toLocaleString()}
            </div>
            <div className="w-10 ms-2">บาท</div>
          </div>
        </div>

        <div className="mb-2">จ่ายตามจำนวนที่เล่น</div>

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
                <TableCell sx={{ textAlign: "end" }}>จ่าย</TableCell>
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
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ textAlign: "end" }}
                  >
                    {player.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="sticky bottom-0 p-4 bg-white">
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            if (confirm("ยืนยันล้างค่า ?")) {
              localStorage.removeItem("playerList");
              localStorage.removeItem("round");
              window.location.href = "/";
            }
          }}
        >
          เสร็จสิ้น
        </Button>
      </div>
    </>
  );
};

export default SummaryPage;

import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import type { PlayerType } from "../home";
import NumberField from "../../components/input-number";

type SummaryPageProps = {
  // Add your props here
};

const SummaryPage: React.FC<SummaryPageProps> = ({}) => {
  const [playerList, setPlayerList] = useState<PlayerType[]>([]);
  const [courtPrice, setCourtPrice] = useState<number | null>(null);
  const [shuttlecockPrice, setShuttlecockPrice] = useState<number | null>(null);
  const [shuttlecockAmount, setShuttlecockAmount] = useState<number | null>(
    null,
  );

  useEffect(() => {
    setPlayerList(JSON.parse(localStorage.getItem("playerList") || "[]"));
  }, []);

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
          <div>จ่ายคนละ</div>
          <div className="flex">
            <div>
              {(
                ((shuttlecockPrice || 0) * (shuttlecockAmount || 0) +
                  (courtPrice || 0)) /
                playerList.length
              )?.toLocaleString() || 0}
            </div>
            <div className="w-10 ms-2">บาท</div>
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 p-4 bg-white">
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            if (confirm()) {
              localStorage.removeItem("playerList");
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

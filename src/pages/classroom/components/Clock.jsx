import React, { useEffect, useState } from "react";

const Clock = () => {
  const [clock, setClock] = useState({ h: "00", m: "00", s: "00" });

  useEffect(() => {
    function startTime() {
      const today = new Date();
      let h = today.getHours();
      let m = today.getMinutes();
      let s = today.getSeconds();
      m = checkTime(m);
      s = checkTime(s);
      setClock({ h, m, s });
      setTimeout(startTime, 1000);
    }

    startTime();

    function checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    }
  }, []);
  return (
    <p className="text-white text-lg font-bold mb-2">{`${clock.h}: ${clock.m}: ${clock.s}`}</p>
  );
};

export default Clock;

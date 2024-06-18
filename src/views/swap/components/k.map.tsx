import { ReactElement, useEffect, useState } from "react";
import * as echarts from "echarts";
import { HackathonKmap } from "../../../request/api";
import { Token } from "..";
import { countTrailingZeros, toNormalNumber } from "../../memes";
import { DateConvertMin } from "../../../utils";
import { Spin } from "antd";

function calculateMA(dayCount: number, data: number[][]) {
  let result = [];
  for (let i = 0, len = data.length; i < len; i++) {
    if (i < dayCount) {
      result.push("-");
      continue;
    }
    let sum = 0;
    for (let j = 0; j < dayCount; j++) {
      sum += +data[i - j][1];
    }
    result.push((sum / dayCount).toFixed(2));
  }
  return result;
}

interface Tab {
  value: string;
  label: string;
}

const tabList: Tab[] = [
  {
    value: "1hour",
    label: "1H",
  },
  {
    value: "4hour",
    label: "4H",
  },
  {
    value: "1day",
    label: "D",
  },
];

const KMapCard = (props: { item: Token }): ReactElement => {
  const [data, setData] = useState<number[][]>([[]]);
  const [date, setDate] = useState<string[]>([]);
  const [type, setType] = useState<string>("1hour");
  const [loading, setLoading] = useState<boolean>(true);
  const zoom = JSON.parse(
    sessionStorage.getItem("dataZoom") || '{"start":0,"end":100}'
  );
  const getData = async () => {
    setLoading(true);
    const result = await HackathonKmap({
      chain_id: props.item.chain_id,
      contract_address: props.item.currency_address,
      type: type,
    });
    const { data } = result;
    setLoading(false);
    if (!data.data) return;
    setData(data.data);
    setDate(
      data.time.map((item: number) => {
        return DateConvertMin(item);
      })
    );
  };
  useEffect(() => {
    getData();
  }, [props.item.currency_address, type]);
  const option: any = {
    height: 370,
    legend: {
      show: false,
    },
    grid: [
      {
        left: 24,
        top: 30,
        //props.price > 10000 && 62 || props.price < 0.1 && 72 || 40
        right: 75,
        bottom: 30,
      },
      {
        left: 24,
        bottom: 40,
        right: 72,
        height: 60,
      },
    ],
    xAxis: [
      {
        type: "category",
        data: date,
        boundaryGap: false,
        axisLine: {
          onZero: false,
          lineStyle: {
            color: "rgba(255,255,255,.6)",
          },
        },
        splitLine: { show: false },
        min: "dataMin",
        max: "dataMax",
        axisLabel: {
          color: "white",
          padding: [10, 0, 0, 0],
        },
      },
      {
        type: "category",
        gridIndex: 1,
        data: date,
        boundaryGap: false,
        axisLine: {
          onZero: false,
          lineStyle: {
            color: "rgba(255,255,255,.6)",
          },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        min: "dataMin",
        max: "dataMax",
      },
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#3070ff",
          fontWeight: "500",
        },
      },
      formatter: function (param: any) {
        param = param[0];
        return [
          `<div style='display:flex;justify-content:space-between;'><p style='width:60px;text-align:left;'>Time:</p>` +
            `<p>${param.name}</p></div>`,
          `<div style='display:flex;justify-content:space-between;'><p style='width:60px;text-align:left;'>Open:</p>` +
            `<p>${countTrailingZeros(toNormalNumber(param.data[4]), false)} ${
              props.item.dex_pair_token_name
            }</p></div>`,
          `<div style='display:flex;justify-content:space-between;'><p style='width:60px;text-align:left;'>High:</p>` +
            `<p>${countTrailingZeros(toNormalNumber(param.data[2]), false)} ${
              props.item.dex_pair_token_name
            }</p></div>`,
          `<div style='display:flex;justify-content:space-between;'><p style='width:60px;text-align:left;'>Recive:</p>` +
            `<p>${countTrailingZeros(toNormalNumber(param.data[1]), false)} ${
              props.item.dex_pair_token_name
            }</p></div>`,
          `<div style='display:flex;justify-content:space-between;'><p style='width:60px;text-align:left;'>Low:</p>` +
            `<p>${countTrailingZeros(toNormalNumber(param.data[3]), false)} ${
              props.item.dex_pair_token_name
            }</p></div>`,
        ].join("");
      },
    },
    yAxis: [
      {
        type: "value",
        position: "right",
        scale: true,
        splitNumber: 5,
        splitLine: {
          show: false,
          lineStyle: {
            color: "",
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(255,255,255,.6)",
          },
        },
        axisTick: {
          show: true,
        },
        axisLabel: {
          show: true,
          showMinLabel: false,
          showMaxLabel: false,
          color: "white",
          formatter: (value: number, index: number): number | string => {
            return countTrailingZeros(toNormalNumber(value), false) as string;
          },
        },
      },
      {
        gridIndex: 1,
        position: "right",
        scale: true,
        splitNumber: 3,
        boundaryGap: false,
        axisLine: {
          show: false,
          onZero: true,
          lineStyle: {
            color: "#637e9d",
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        splitLine: { show: false },
      },
    ],
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: [0, 1],
        start: zoom.start,
        end: zoom.end,
        top: 30,
        height: 20,
      },
    ],
    visualMap: {
      show: false,
      seriesIndex: 5,
      dimension: 2,
      pieces: [
        {
          value: 1,
          color: "#00c087",
        },
        {
          value: -1,
          color: "rgb(226,5,4)",
        },
      ],
      tooltip: { show: false },
    },

    series: [
      {
        name: "K",
        type: "candlestick",
        barMaxWidth: "10px",
        data: data,
        itemStyle: {
          color: "#00c087",
          color0: "rgb(226,5,4)",
          borderColor: "#00c087",
          borderColor0: "rgb(226,5,4)",
        },
        label: {
          show: true,
          position: "top",
        },
      },

      {
        name: "MA5",
        type: "line",
        data: calculateMA(5, data),
        smooth: true,
        lineStyle: {
          opacity: 1,
          width: 0.8,
        },
        animationDuration: 0,
        itemStyle: {
          opacity: 0,
        },
      },
      {
        name: "MA10",
        type: "line",
        data: calculateMA(10, data),
        smooth: true,
        lineStyle: {
          opacity: 1,
          width: 0.8,
        },
        animationDuration: 0,
        itemStyle: {
          opacity: 0,
        },
      },
      {
        name: "MA20",
        type: "line",
        data: calculateMA(20, data),
        smooth: true,
        lineStyle: {
          opacity: 1,
          width: 0.8,
        },
        animationDuration: 0,
        itemStyle: {
          opacity: 0,
        },
      },
      {
        name: "MA30",
        type: "line",
        data: calculateMA(30, data),
        smooth: true,
        lineStyle: {
          opacity: 1,
          width: 0.8,
        },
        animationDuration: 0,
        itemStyle: {
          opacity: 0,
        },
      },
      {
        name: "Volume",
        type: "bar",
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: data!.map((item: any, i: number) => {
          return [i, item[4], item[0] > item[1] ? -1 : 1];
        }),
      },
    ],
  };
  useEffect(() => {
    if (data.length < 1) return;
    let echartsBox = echarts.getInstanceByDom(
      document.getElementById("echarts-box") as HTMLElement
    );
    if (!echartsBox) {
      echartsBox = echarts.init(
        document.getElementById("echarts-box") as HTMLElement
      );
    }
    echartsBox.setOption(option);
    echartsBox.off("dataZoom");
    echartsBox.on("dataZoom", (params: any) => {
      const data = {
        start: Math.ceil(params.batch[0].start),
        end: Math.ceil(params.batch[0].end),
      };
      sessionStorage.setItem("dataZoom", JSON.stringify(data));
    });
    const resize = () => {
      echartsBox?.resize();
    };
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [data]);
  return (
    <div className="k-map-card">
      <div className="token-tabs">
        <div className="token-info">
          {props.item.logo_url && <img src={props.item.logo_url} alt="" />}
          <div className="msg">
            <p>{props.item.currency_name}</p>
            <p
              onClick={() => {
                window.open(
                  `https://piscan.plian.org/address/${props.item.currency_address}?chain=1`
                );
              }}
            >
              {props.item.currency_name}<span>/{props.item.dex_pair_token_name}</span>
            </p>
          </div>
        </div>
        <div className="tabs">
          <ul>
            {tabList.map((item: Tab, index: number) => {
              return (
                <li
                  key={index}
                  onClick={() => {
                    setType(item.value);
                  }}
                  className={`${type === item.value ? "active-t" : ""}`}
                >
                  <p>{item.label}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="echarts-box" id="echarts-box"></div>
      {loading && (
        <div className="loading">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default KMapCard;

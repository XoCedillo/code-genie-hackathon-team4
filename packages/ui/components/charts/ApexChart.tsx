'use client' // if you use app dir, don't forget this line
import React from 'react'
import dynamic from 'next/dynamic'
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

export function ExampleChart() {
  const option = {
    chart: {
      id: 'apexchart-example',
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      },
    },
    axisBorder: {
      show: false,
    },
    grid: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    colors: ['#F0F2F5'],
    crosshairs: {
      fill: {
        type: 'gradient',
        gradient: {
          colorFrom: '#F0F2F5',
          colorTo: '#637587',
          stops: [0, 100],
          opacityFrom: 0.4,
          opacityTo: 0.5,
        },
      },
    },
    dataLabels: {
      enabled: false,
      formatter: function (val) {
        return val + '%'
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        // colors: ['#304758'],
      },
    },

    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995],
    },
  }

  const series = [
    {
      name: 'series-1',
      data: [70, 40, 35, 50, 49],
    },
  ]

  return (
    <>
      <ApexChart
        type='bar'
        options={option}
        series={series}
        height={400}
        // width={100}
      />
    </>
  )
}

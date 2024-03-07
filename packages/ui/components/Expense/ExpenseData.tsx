import React from "react";
import { Col, Row } from "antd";
import dayjs from "dayjs";
import numberFormatter from "@/ui/lib/numberFormatter";
import { arrow } from "@/ui/assets";
import Image from "next/image";

export default function ExpenseData({ expense, minColSpan = 12 }) {
  const colSpans = {
    xs: Math.max(minColSpan, 24),
    sm: Math.max(minColSpan, 12),
    xl: Math.max(minColSpan, 8),
  };

  return (
    <Row gutter={[48, 24]}>
      <Col {...colSpans}>
        <ExpenseDataTitle {...expense} />
      </Col>
      <Col {...colSpans}>
        <ExpenseDataAmount amount={expense.ammount} />
      </Col>
    </Row>
  );
}

const ExpenseDataTitle = ({ title, created }) => {
  return (
    <div className="container">
      <div className="container__item">
        <Image src={arrow} alt="arrow-top" width={30} height={30} />
      </div>
      <div>
        <span>{title}</span>
        <br />
        <span>{created ? dayjs(created).format("D MMM 'YY") : ""}</span>
      </div>

      <style jsx>
        {`
          .container {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .container__item {
            background: #f0f2f5;
            width: 48px;
            height: 48px;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}
      </style>
    </div>
  );
};

const ExpenseDataAmount = ({ amount }) => {
  return (
    <div className="container">
      <div>${numberFormatter.format(amount)}</div>

      <style jsx>
        {`
          .container {
            display: flex;
            align-items: center;
            justify-content: end;
            height: 100%;
          }
        `}
      </style>
    </div>
  );
};

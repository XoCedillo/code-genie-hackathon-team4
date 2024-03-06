import React from "react";
import { Card, Typography } from "antd";

const ExpenseCard = () => {
  const { Title, Text } = Typography;

  return (
    <Card
      hoverable
      style={{
        width: 300,
        borderRadius: 8,
        textAlign: "center",
        border: "1px solid DBE0E5",
      }}
    >
      {/* <Meta title="Europe Street beat" description="www.instagram.com" /> */}
      <Title level={3}>$7,098.00</Title>
      <Text type="secondary">Total balance</Text>
    </Card>
  );
};

export default ExpenseCard;

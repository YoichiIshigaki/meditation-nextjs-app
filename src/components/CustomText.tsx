import React from "react";

type CustomTextProps = {
  text: React.ReactNode;
  className?: string;
};

export const CustomText = ({ text, className }: CustomTextProps) => {
  return <p className={className}>{text}</p>;
};

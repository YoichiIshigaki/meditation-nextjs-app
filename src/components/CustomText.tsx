
import React from "react";

type CustomTextProps = {
  text: string;
  className?: string;
};

export const CustomText = ({ text, className }: CustomTextProps) => {
  return <p className={className}>{text}</p>;
};

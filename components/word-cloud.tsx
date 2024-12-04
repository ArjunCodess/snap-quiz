"use client";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React from "react";
import D3WordCloud from "react-d3-cloud";

type Props = {
  formattedTopics: { text: string; value: number }[];
};

const fontSizeMapper = (word: { value: number }) =>
  Math.log2(word.value) * 5 + 16;

const WordCloud = ({ formattedTopics }: Props) => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <D3WordCloud
      data={formattedTopics}
      height={400}
      font="Times"
      fontSize={fontSizeMapper}
      rotate={0}
      padding={10}
      fill={theme.theme === "dark" ? "white" : "black"}
      onWordClick={(event, d) => {
        event.preventDefault();
        router.push(`/quiz?topic=${encodeURIComponent(d.text)}`);
      }}
    />
  );
};

export default WordCloud;

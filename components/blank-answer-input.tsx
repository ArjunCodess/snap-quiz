import React, { Dispatch, Fragment, SetStateAction, useMemo } from "react";
import keyword_extractor from "keyword-extractor";
import { OPEN_ENDED_ANSWER_PLACEHOLDER } from "@/lib/utils";

type Props = {
  answer: string;
  setBlankAnswer: Dispatch<SetStateAction<string>>;
};

const BlankAnswerInput = ({ answer, setBlankAnswer }: Props) => {
  const keywords = useMemo(() => {
    const words = keyword_extractor.extract(answer, {
      language: "english",
      remove_digits: true,
      return_changed_case: false,
      remove_duplicates: false,
    });
    const shuffled = words.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  }, [answer]);

  const answerWithBlanks = useMemo(() => {
    const answerWithBlanks = keywords.reduce((acc, curr) => {
      return acc.replaceAll(curr, OPEN_ENDED_ANSWER_PLACEHOLDER);
    }, answer);
    setBlankAnswer(answerWithBlanks);
    return answerWithBlanks;
  }, [answer, keywords, setBlankAnswer]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <h1 className="text-xl font-medium text-foreground/90 leading-relaxed">
        {answerWithBlanks
          .split(OPEN_ENDED_ANSWER_PLACEHOLDER)
          .map((part, index) => {
            return (
              <Fragment key={index}>
                {part}
                {index ===
                answerWithBlanks.split(OPEN_ENDED_ANSWER_PLACEHOLDER).length -
                  1 ? (
                  ""
                ) : (
                  <input
                    id="user-blank-input"
                    className="mx-1 px-2 py-1 w-32 text-center bg-transparent border-b-2 border-primary/30 focus:border-primary focus:outline-none transition-all duration-200 text-primary"
                    type="text"
                  />
                )}
              </Fragment>
            );
          })}
      </h1>
    </div>
  );
};

export default BlankAnswerInput;

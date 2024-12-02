import React, { Dispatch, Fragment, SetStateAction, useMemo } from "react";
import keyword_extractor from "keyword-extractor";

type Props = {
  answer: string;
  setBlankAnswer: Dispatch<SetStateAction<string>>;
};

const blank = "_______";

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
      return acc.replaceAll(curr, blank);
    }, answer);
    setBlankAnswer(answerWithBlanks);
    return answerWithBlanks;
  }, [answer, keywords, setBlankAnswer]);

  return (
    <div className="flex justify-start w-full mt-4">
      <h1 className="text-xl font-semibold">
        {answerWithBlanks.split(blank).map((part, index) => {
          return (
            <Fragment key={index}>
              {part}
              {index === answerWithBlanks.split(blank).length - 1 ? (
                ""
              ) : (
                <input
                  id="user-blank-input"
                  className="text-center border-b-2 border-black dark:border-white w-28 focus:border-2 focus:border-b-4 focus:outline-none"
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
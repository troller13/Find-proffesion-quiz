import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import { type } from "@testing-library/user-event/dist/type";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import { questions as questionsData } from "../questions";
const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
  jobScores: {
    programmer: 0,
    engineer: 0,
    doctor: 0,
    teacher: 0,
    psychologist: 0,
    artist: 0,
    lawyer: 0,
    economist: 0,
    chef: 0,
    journalist: 0,
    entrepreneur: 0,
    police_officer: 0,
    architect: 0,
    biologist: 0,
    actor: 0,
    mechanic: 0,
    marketing_specialist: 0,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * 30,
      };
    case "newAnswer": {
      const question = state.questions.at(state.index);
      const selectedOptionIndex = action.payload;
      const selectedOptionPoints = question.points[selectedOptionIndex];
      const newJobScores = { ...state.jobScores };

      for (let job in selectedOptionPoints) {
        newJobScores[job] += selectedOptionPoints[job];
      }

      return {
        ...state,
        answer: selectedOptionIndex,
        jobScores: newJobScores,
      };
    }

    case "nextQuestion": {
      return { ...state, index: state.index + 1, answer: null };
    }
    case "finish": {
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    }
    case "restart": {
      return { ...initialState, questions: state.questions, status: "ready" };
    }
    case "tick": {
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    }
    case "add_points":
      return {
        ...state,
        jobScores: {
          ...state.jobScores,
          [action.payload.job]:
            state.jobScores[action.payload.job] + action.payload.value,
        },
      };

    default:
      throw new Error("action unknown");
  }
}
export default function App() {
  const [
    {
      questions,
      status,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
      jobScores,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, curr) => prev + curr.points,
    0
  );
  useEffect(function () {
    dispatch({ type: "dataReceived", payload: questionsData });
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress index={index} numQuestions={numQuestions} />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
            jobScores={jobScores}
          />
        )}
      </Main>
    </div>
  );
}

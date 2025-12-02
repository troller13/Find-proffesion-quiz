export default function FinishScreen({ jobScores, dispatch }) {
  // Get max value
  const maxScore = Math.max(...Object.values(jobScores));

  // Find all jobs with maxScore (in case of ties)
  const topJobs = Object.keys(jobScores).filter(
    (job) => jobScores[job] === maxScore
  );

  return (
    <div>
      <p className="result">
        Your ideal profession is: <strong>{topJobs.join(", ")}</strong>
      </p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart quiz
      </button>
    </div>
  );
}

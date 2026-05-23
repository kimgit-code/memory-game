export default function WinMessage({ moves }) {
  return (
    <div className="win-message">
      <h2>Congrats</h2>
      <p>You won the game in {moves} attempts</p>
    </div>
  );
}

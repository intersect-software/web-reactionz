export default function ReactionCount({
  emoji,
  count,
}: {
  emoji: string;
  count: number;
}) {
  return (
    <div className="reactionCount">
      <span>{emoji}</span>
      <span>{count}</span>
    </div>
  );
}

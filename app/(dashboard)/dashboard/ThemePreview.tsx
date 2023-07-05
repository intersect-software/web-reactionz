import { getEmoji } from "@/lib/helpers";
import { WidgetSettings } from "@/types/apiTypes";

export default function ThemePreview(
  props: WidgetSettings & {
    emojis: string[];
    theme: string;
    showReactionCounts: boolean;
  }
) {
  const styleOverrides = {
    ...(props.fontSizeScale && {
      fontSize: `${props.fontSizeScale}em`,
    }),
    ...(props.fontColor && {
      color: props.fontColor,
    }),
  };

  return (
    <div
      className={`theme ${props.theme} ${props.bordered && "bordered"} ${
        props.layout === "vertical" && "vertical"
      }`}
      style={styleOverrides}
    >
      {props.prompt && <span>{props.prompt}</span>}
      <div className={`emojis ${props.layout === "vertical" && "vertical"}`}>
        {props.emojis.map((e) => (
          <span key={`emoji-${e}`} className="emoji">
            {getEmoji(e)}
            {props.showReactionCounts && <span>1</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

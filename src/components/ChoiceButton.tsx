import type { ChoiceView } from "../engine/gameEngine";

interface ChoiceButtonProps {
  view: ChoiceView;
  disabled?: boolean;
  onChoice: (choiceId: string) => void;
}

export function ChoiceButton({ view, disabled = false, onChoice }: ChoiceButtonProps) {
  return (
    <button
      className="choice-button"
      type="button"
      disabled={disabled || !view.enabled}
      onClick={() => onChoice(view.choice.id)}
    >
      <span>{view.choice.text}</span>
      {!view.enabled && view.disabledReason ? <small>{view.disabledReason}</small> : null}
    </button>
  );
}

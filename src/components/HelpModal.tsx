interface HelpModalProps {
  onClose: () => void;
}

export function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="help-title">
        <h2 id="help-title">게임 설명</h2>
        <p>
          플레이어는 원작에 등장하지 않는 제3의 학생입니다. 안율이나 이도해를 대신해 사건을 해결하는 것이 아니라,
          교실의 소문과 관계, 상처 앞에서 무엇을 보고 어떻게 반응할지 선택합니다.
        </p>
        <p>
          선택은 시선 이해력, 관계 용기, 배려 감각, 표현 진심도와 인물 관계를 바꿉니다. 어떤 선택은 나중에
          사건이나 엔딩을 여는 조건으로 기억됩니다.
        </p>
        <p>
          좋은 선택과 나쁜 선택을 즉시 정답처럼 나누지 않습니다. 타인을 이해하는 일은 느리고 어려운 과정이라는
          분위기를 따라가 보세요.
        </p>
        <button className="primary-button" type="button" onClick={onClose}>
          닫기
        </button>
      </section>
    </div>
  );
}

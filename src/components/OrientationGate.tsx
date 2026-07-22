export function OrientationGate() {
  return (
    <main className="orientation-gate" role="dialog" aria-modal="true" aria-labelledby="orientation-title">
      <div className="orientation-device" aria-hidden="true">
        <span />
      </div>
      <p className="eyebrow">화면 방향 안내</p>
      <h1 id="orientation-title">가로 화면으로 접속하세요</h1>
      <p>기기를 가로로 돌리면 이 화면이 자동으로 사라지고 게임을 시작할 수 있습니다.</p>
    </main>
  );
}

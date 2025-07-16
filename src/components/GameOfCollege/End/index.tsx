import Arrow from "../Arrow";

export default function End() {
  return (
    <section id="goc-end-container">
      <div className="goc-graphic">
        <img src="" alt="" />
      </div>
      <div className="goc-prompt">
        <div data-role="content">
          <h2></h2>
          <p></p>
        </div>
        <div data-role="difficulty">
          <h4>Your Difficulty:</h4>
          <p></p>
          <p></p>
        </div>
        <div data-role="buttons">
          <div className="goc-button" data-role="choices">
            <Arrow direction="from-left" />
            <p>Play again, but I’ll pick</p>
          </div>
          <div className="goc-button" data-role="random">
            <Arrow direction="from-right" />
            <p>Play again, and pick for me</p>
          </div>
        </div>
      </div>
    </section>
  );
}

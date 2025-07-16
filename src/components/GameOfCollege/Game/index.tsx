import Arrow from "../Arrow";

const img1 = { src: "/game-of-college-assets/1-guidance-couns.svg" };
const img2 = { src: "/game-of-college-assets/2-AP-classes-01.svg" };
const img3 = { src: "/game-of-college-assets/3-test-prep-01.svg" };
const img4 = { src: "/game-of-college-assets/4-FAFSA-01.svg" };
const img5 = { src: "/game-of-college-assets/5-citizenship-01.svg" };
const img6 = { src: "/game-of-college-assets/6-financial aid-01.svg" };
const img7 = { src: "/game-of-college-assets/7-work-in-college-01.svg" };
const img7Alt = { src: "/game-of-college-assets/7-work-in-college-02.svg" };
const img8 = { src: "/game-of-college-assets/8-remedial-courses-01.svg" };
const img9 = { src: "/game-of-college-assets/9-know-major-01.svg" };
const img10 = { src: "/game-of-college-assets/10-transfer-colleges-01.svg" };
const img11 = { src: "/game-of-college-assets/11-intern-01.svg" };

const prompts = [
  {
    prompt_id: "prompt_one",
    value: 1,
    next_prompt_id: "prompt_two",
    stage_progress: "before-college",
    image_desktop_url: img1.src,
  },
  {
    prompt_id: "prompt_two",
    value: 2,
    next_prompt_id: "prompt_three",
    stage_progress: "before-college",
    image_desktop_url: img2.src,
  },
  {
    prompt_id: "prompt_three",
    value: 3,
    next_prompt_id: "prompt_four",
    stage_progress: "before-college",
    image_desktop_url: img3.src,
  },
  {
    prompt_id: "prompt_four",
    value: 4,
    next_prompt_id: "prompt_five",
    stage_progress: "before-college",
    image_desktop_url: img4.src,
  },
  {
    prompt_id: "prompt_five",
    value: 5,
    next_prompt_id: "prompt_six",
    stage_progress: "before-college",
    image_desktop_url: img5.src,
  },
  {
    prompt_id: "prompt_six",
    value: 6,
    next_prompt_id: "prompt_seven",
    stage_progress: "before-college",
    image_desktop_url: img6.src,
  },
  {
    prompt_id: "prompt_seven",
    value: 7,
    next_prompt_id: "prompt_eight",
    stage_progress: "before-college",
    image_desktop_url: img7.src,
    image_alternative: img7Alt.src,
  },
  {
    prompt_id: "prompt_eight",
    value: 8,
    next_prompt_id: "prompt_nine",
    stage_progress: "in-college",
    image_desktop_url: img8.src,
  },
  {
    prompt_id: "prompt_nine",
    value: 9,
    next_prompt_id: "prompt_ten",
    stage_progress: "in-college",
    image_desktop_url: img9.src,
  },
  {
    prompt_id: "prompt_ten",
    value: 10,
    next_prompt_id: "prompt_eleven",
    stage_progress: "in-college",
    image_desktop_url: img10.src,
  },
  {
    prompt_id: "prompt_eleven",
    value: 11,
    next_prompt_id: "end_screen",
    stage_progress: "graduation",
    image_desktop_url: img11.src,
  }
]

export default function Game() {
  return (
    <section id="goc-game-container">
      {prompts.map((prompt) => (
        <div
          key={prompt.prompt_id}
          id={prompt.prompt_id}
          className="goc-game-item"
          data-next_prompt={prompt.next_prompt_id}
          data-value={prompt.value}
        >
          <div className="goc-graphic">
            <img
              className="goc-img-typical"
              src={prompt.image_desktop_url}
            />
            
            {!!prompt.image_alternative && (
              <img
                className="goc-img-alternative"
                src={prompt.image_alternative}
              />
            )}
          </div>
          <div className="goc-prompt">
            <div data-role="content">
              <p></p>
            </div>
            <div data-role="buttons">
              <div className="goc-button" data-role="left">
                <Arrow direction="from-left" />
                <p></p>
              </div>
              <div className="goc-button" data-role="right">
                <Arrow direction="from-right" />
                <p></p>
              </div>
            </div>
          </div>
          <div className="goc-explain">
            <div data-role="content">
              <p></p>
            </div>
            <div data-role="buttons">
              <div className="goc-button">Continue</div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
